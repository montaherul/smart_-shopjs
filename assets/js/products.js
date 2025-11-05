;(() => {
  const PER_PAGE = 8
  let PRODUCTS = []
  let currentPage = 1
  const Utils = {
    lsGet: (key, defaultValue) => {
      const value = localStorage.getItem(key)
      return value !== null ? JSON.parse(value) : defaultValue
    },
  }
  async function fetchProducts() {
    try {
      const res = await fetch("https://fakestoreapi.com/products")
      PRODUCTS = await res.json()
      renderFeatured()
      renderPage(currentPage)
    } catch (e) {
      console.error(e)
      document.getElementById("products-grid") &&
        (document.getElementById("products-grid").innerHTML = '<div class="p-6">Failed to load products</div>')
    }
  }
  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m],
    )
  }
  function card(p) {
    const div = document.createElement("div")
    div.className = "bg-white p-4 rounded shadow flex flex-col card-glass card-hover"
    div.innerHTML = `
      <img src="${p.image}" class="h-44 object-contain mb-3"/>
      <h3 class="font-semibold text-sm mb-1">${escapeHtml(p.title)}</h3>
      <div class="text-indigo-600 font-bold mb-2">${p.price} BDT</div>
      <div class="text-xs mb-3">Rating: ${p.rating?.rate || "N/A"}</div>
      <div class="mt-auto flex items-center justify-between">
        <button data-id="${p.id}" class="add-to-cart bg-green-500 text-white px-3 py-1 rounded">Add</button>
        <a href="product.html?id=${p.id}" class="details btn border px-2 py-1 rounded text-sm">Details</a>
      </div>`
    return div
  }
  function renderFeatured() {
    const f = document.getElementById("featured-grid")
    if (!f) return
    f.innerHTML = ""
    PRODUCTS.slice(0, 4).forEach((p) => f.appendChild(card(p)))
    attachAdd()
  }
  function renderPage(page) {
    const grid = document.getElementById("products-grid")
    if (!grid) return
    const start = (page - 1) * PER_PAGE
    const chunk = PRODUCTS.slice(start, start + PER_PAGE)
    grid.innerHTML = ""
    chunk.forEach((p) => grid.appendChild(card(p)))
    document.getElementById("pageIndicator") && (document.getElementById("pageIndicator").textContent = `Page ${page}`)
    attachAdd()
  }
  function attachAdd() {
    document.querySelectorAll(".add-to-cart").forEach((b) => b.addEventListener("click", onAdd))
  }
  function onAdd(e) {
    const id = String(e.currentTarget.dataset.id)
    const prod = PRODUCTS.find((p) => String(p.id) === id)
    if (!prod) return
    const cart = window.CartModule.loadCart()
    if (!cart[id]) cart[id] = { product: prod, qty: 0 }
    cart[id].qty += 1
    let subtotal = 0
    Object.values(cart).forEach((x) => (subtotal += x.product.price * x.qty))
    const balance = Utils.lsGet("smartshop_balance_v2", 1000)
    if (subtotal > balance) {
      alert("Total exceeds balance — add money or reduce items")
      return
    }
    window.CartModule.saveCart(cart)
    window.CartModule.renderCartUI()

    // Show checkout drawer
    if (window.CheckoutModule && window.CheckoutModule.showDrawer) {
      window.CheckoutModule.showDrawer()
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("prevPage")?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        renderPage(currentPage)
      }
    })
    document.getElementById("nextPage")?.addEventListener("click", () => {
      if (currentPage * PER_PAGE < PRODUCTS.length) {
        currentPage++
        renderPage(currentPage)
      }
    })
    document.getElementById("search")?.addEventListener("input", applyFilters)
    document.getElementById("sort")?.addEventListener("change", applyFilters)
    window.CartModule?.renderCartUI()
    fetchProducts()
  })
  function applyFilters() {
    const q = (document.getElementById("search")?.value || "").toLowerCase().trim()
    let list = PRODUCTS.slice()
    if (q) list = list.filter((p) => p.title.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q))
    const s = document.getElementById("sort")?.value
    if (s === "price-asc") list.sort((a, b) => a.price - b.price)
    if (s === "price-desc") list.sort((a, b) => b.price - a.price)
    if (s === "rating-desc") list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
    PRODUCTS = list
    currentPage = 1
    renderPage(currentPage)
  }
})()
