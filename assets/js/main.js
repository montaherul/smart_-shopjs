;(() => {
  const HEADER_HTML = `
  <nav class="bg-white shadow-md sticky top-0 z-40 border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
      <a href="index.html" class="text-2xl font-bold" style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">SmartShop</a>
      <ul class="hidden sm:flex space-x-8 text-sm font-medium">
        <li><a href="index.html" class="nav-link">Home</a></li>
        <li><a href="products.html" class="nav-link">Products</a></li>
        <li><a href="reviews.html" class="nav-link">Reviews</a></li>
        <li><a href="contact.html" class="nav-link">Contact</a></li>
      </ul>
      <div class="flex items-center space-x-4">
        <!-- Format balance to 2 decimal places -->
        <div class="text-sm font-semibold">Balance: <span id="user-balance" class="text-cyan-600">0.00</span> BDT</div>
        <button id="add-money" class="btn-primary px-3 py-1.5 text-sm">+1000</button>
        <div class="relative">
          <a href="checkout.html" class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100">Checkout</a>
          <button id="cartBtn" class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100">Cart (<span id="cart-count">0</span>)</button>
          <div id="cart-dropdown" class="hidden absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg p-4 border border-gray-200 z-50"></div>
        </div>
      </div>
    </div>
  </nav>`

  const FOOTER_HTML = `
  <footer class="bg-slate-900 text-white mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Top section -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12 pb-12 border-b border-slate-700">
        <!-- Brand section -->
        <div class="md:col-span-1">
          <h3 class="text-xl font-bold mb-2" style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">SmartShop</h3>
          <p class="text-sm text-slate-400">Modern e-commerce experience with premium products and exceptional service.</p>
        </div>
        <!-- Shop Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Shop</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="products.html" class="text-slate-400 hover:text-cyan-400 transition">All Products</a></li>
            <li><a href="products.html" class="text-slate-400 hover:text-cyan-400 transition">Best Sellers</a></li>
            <li><a href="products.html" class="text-slate-400 hover:text-cyan-400 transition">New Arrivals</a></li>
            <li><a href="products.html" class="text-slate-400 hover:text-cyan-400 transition">Sale</a></li>
          </ul>
        </div>
        <!-- Company Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Company</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">About Us</a></li>
            <li><a href="contact.html" class="text-slate-400 hover:text-cyan-400 transition">Contact</a></li>
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">Blog</a></li>
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">Careers</a></li>
          </ul>
        </div>
        <!-- Support Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Support</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">Help Center</a></li>
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">Shipping Info</a></li>
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">Returns</a></li>
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">FAQ</a></li>
          </ul>
        </div>
        <!-- Legal Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Legal</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">Privacy Policy</a></li>
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">Terms of Service</a></li>
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">Cookie Policy</a></li>
            <li><a href="#" class="text-slate-400 hover:text-cyan-400 transition">Accessibility</a></li>
          </ul>
        </div>
      </div>
      <!-- Bottom section -->
      <div class="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400">
        <div>© SmartShop 2025 · Built with excellence · Contact: info@smartshop.local</div>
        <div class="flex space-x-6 mt-4 sm:mt-0">
          <a href="index.html" class="hover:text-cyan-400 transition">Home</a>
          <a href="products.html" class="hover:text-cyan-400 transition">Products</a>
          <a href="reviews.html" class="hover:text-cyan-400 transition">Reviews</a>
          <a href="contact.html" class="hover:text-cyan-400 transition">Contact</a>
        </div>
      </div>
    </div>
  </footer>`

  const Utils = {
    lsGet: (key, defaultValue) => {
      const value = localStorage.getItem(key)
      return value !== null ? JSON.parse(value) : defaultValue
    },
    lsSet: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
  }

  document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header")
    const footer = document.getElementById("site-footer")
    if (header) header.innerHTML = HEADER_HTML
    if (footer) footer.innerHTML = FOOTER_HTML

    const BAL_KEY = "smartshop_balance_v2"
    let balance = Utils.lsGet(BAL_KEY, 1000)
    const balanceEl = document.getElementById("user-balance")
    if (balanceEl) balanceEl.textContent = balance.toFixed(2)

    document.getElementById("add-money")?.addEventListener("click", () => {
      balance += 1000
      Utils.lsSet(BAL_KEY, balance)
      if (balanceEl) balanceEl.textContent = balance.toFixed(2)
    })

    const cartBtn = document.getElementById("cartBtn")
    const cartDropdown = document.getElementById("cart-dropdown")
    cartBtn?.addEventListener("click", () => cartDropdown.classList.toggle("hidden"))

    const back = document.createElement("button")
    back.textContent = "↑"
    back.id = "backToTop"
    back.className = "fixed bottom-6 right-6 p-3 rounded-full hidden z-40 text-white font-bold text-lg"
    document.body.appendChild(back)

    window.addEventListener("scroll", () => back.classList.toggle("hidden", window.scrollY < 300))
    back.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }))

    // banner
    const banner = document.getElementById("banner")
    if (banner) {
      let idx = 0,
        count = banner.children.length
      function show(i) {
        idx = (i + count) % count
        banner.style.transform = `translateX(-${idx * 100}%)`
      }
      document.getElementById("nextBanner")?.addEventListener("click", () => show(idx + 1))
      document.getElementById("prevBanner")?.addEventListener("click", () => show(idx - 1))
      setInterval(() => show(idx + 1), 5000)
    }
  })
})()
