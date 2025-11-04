;(() => {
  async function fetchProduct() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    if (!id) {
      document.getElementById("product-detail").innerHTML =
        '<div class="p-8 text-center"><p class="text-gray-600">Product not found. <a href="products.html" class="text-cyan-600 hover:underline">Back to products</a></p></div>'
      return
    }
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`)
      if (!res.ok) throw new Error("Product not found")
      const p = await res.json()
      displayProduct(p)
    } catch (e) {
      console.error(e)
      document.getElementById("product-detail").innerHTML =
        '<div class="p-8 text-center"><p class="text-red-600">Failed to load product. <a href="products.html" class="text-cyan-600 hover:underline">Back to products</a></p></div>'
    }
  }
  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m],
    )
  }
  function displayProduct(p) {
    const detail = document.getElementById("product-detail")
    detail.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex items-center justify-center">
          <img src="${p.image}" class="max-h-96 object-contain"/>
        </div>
        <div class="flex flex-col">
          <h1 class="text-3xl font-bold mb-4">${escapeHtml(p.title)}</h1>
          <p class="text-gray-600 mb-4">${escapeHtml(p.description)}</p>
          <div class="text-2xl font-bold text-cyan-600 mb-2">${p.price} BDT</div>
          <div class="text-sm mb-6">Category: <span class="font-medium">${escapeHtml(p.category || "N/A")}</span></div>
          <div class="text-sm mb-6">Rating: <span class="font-medium">${p.rating?.rate || "N/A"} / 5</span></div>
          <div class="flex gap-3 mt-auto">
            <button id="addBtn" data-id="${p.id}" class="add-to-cart bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition">Add to Cart</button>
            <a href="products.html" class="btn-secondary px-6 py-3 text-center">Back to Products</a>
          </div>
        </div>
      </div>`
    document.getElementById("addBtn")?.addEventListener("click", onAdd)
  }
  function onAdd(e) {
    const id = String(e.currentTarget.dataset.id)
    const params = new URLSearchParams(window.location.search)
    const p_id = params.get("id")
    if (id !== p_id) return

    // Fetch product data to add to cart
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((prod) => {
        const cart = window.CartModule.loadCart()
        if (!cart[id]) cart[id] = { product: prod, qty: 0 }
        cart[id].qty += 1
        let subtotal = 0
        Object.values(cart).forEach((x) => (subtotal += x.product.price * x.qty))
        const balance = window.localStorage.getItem("smartshop_balance_v2") || 1000
        if (subtotal > balance) {
          alert("Total exceeds balance — add money or reduce items")
          return
        }
        window.CartModule.saveCart(cart)
        window.CartModule.renderCartUI()
        alert("Added to cart!")
      })
      .catch((e) => console.error(e))
  }
  document.addEventListener("DOMContentLoaded", () => {
    fetchProduct()
    window.CartModule?.renderCartUI()
  })
})()
