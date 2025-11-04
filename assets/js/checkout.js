(() => {
  const ORD_KEY = "smartshop_orders_v2";
  const VALID_COUPONS = {
    SMART10: 0.1, // 10% discount
  };

  const Utils = {
    lsGet: (key, defaultValue) => {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : defaultValue;
    },
    lsSet: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
  };

  let appliedCoupon = null;

  function loadCart() {
    return window.CartModule.loadCart();
  }

  function saveOrders(o) {
    localStorage.setItem(ORD_KEY, JSON.stringify(o));
  }

  function loadOrders() {
    try {
      return JSON.parse(localStorage.getItem(ORD_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function applyCoupon() {
    const couponInput = document.getElementById("couponInput");
    const couponStatus = document.getElementById("couponStatus");
    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
      couponStatus.textContent = "";
      couponStatus.className = "text-xs mt-2";
      appliedCoupon = null;
      renderCheckout();
      return;
    }

    if (VALID_COUPONS[code]) {
      appliedCoupon = {
        code: code,
        discount: VALID_COUPONS[code],
      };
      couponStatus.textContent = `✓ Coupon applied: ${(
        VALID_COUPONS[code] * 100
      ).toFixed(0)}% discount`;
      couponStatus.className = "text-xs mt-2 text-success font-semibold";
      renderCheckout();
    } else {
      appliedCoupon = null;
      couponStatus.textContent = "✗ Invalid coupon code";
      couponStatus.className = "text-xs mt-2 text-danger font-semibold";
      renderCheckout();
    }
  }

  function showSuccessModal(order) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn";
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center animate-scaleIn">
        <div class="mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center mb-4 animate-bounce">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-text-primary mb-2">Order Confirmed!</h2>
          <p class="text-text-secondary mb-4">Your order has been successfully placed.</p>
        </div>
        
        <div class="bg-bg-soft rounded-lg p-4 mb-6 text-left space-y-2">
          <div class="flex justify-between">
            <span class="text-text-secondary">Order ID:</span>
            <span class="font-bold text-text-primary">#${order.id}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">Total Amount:</span>
            <span class="font-bold text-accent">${order.total.toFixed(
              2
            )} BDT</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">Items:</span>
            <span class="font-bold text-text-primary">${
              order.items.length
            }</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">Date:</span>
            <span class="font-bold text-text-primary">${new Date(
              order.date
            ).toLocaleDateString()}</span>
          </div>
        </div>

        <div class="mb-6 max-h-40 overflow-y-auto">
          <h3 class="font-semibold text-text-primary mb-3 text-left">Order Items:</h3>
          <div class="space-y-2 text-left">
            ${order.items
              .map(
                (item) => `
              <div class="flex justify-between text-sm p-2 bg-bg-soft rounded">
                <span class="text-text-secondary">${item.title}</span>
                <span class="font-semibold">x${item.qty}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <button onclick="this.closest('.fixed').remove()" class="w-full bg-gradient-to-r from-accent to-accent-light text-white font-bold py-3 rounded-lg hover:shadow-lg transition mb-2">
          Continue Shopping
        </button>
        <button onclick="window.location.href='/checkout.html'" class="w-full bg-bg-soft text-text-primary font-semibold py-2 rounded-lg hover:bg-border-color transition">
          View Orders
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function renderCheckout() {
    const cart = loadCart();
    const items = Object.values(cart);
    const balance = Utils.lsGet("smartshop_balance_v2", 1000);

    const balanceAmount = document.getElementById("balance-amount");
    if (balanceAmount) {
      balanceAmount.textContent = balance.toFixed(2) + " BDT";
    }

    const cartItemsContainer = document.getElementById("cart-items");
    if (cartItemsContainer) {
      if (items.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="text-center py-8">
            <p class="text-text-secondary">Your cart is empty</p>
            <a href="/products.html" class="text-accent hover:text-accent-light font-semibold mt-2 inline-block">Continue Shopping</a>
          </div>
        `;
      } else {
        cartItemsContainer.innerHTML = items
          .map(
            (i) => `
          <div class="flex items-start justify-between p-3 bg-bg-soft rounded-lg hover:bg-bg-card transition animate-slideIn">
            <div class="flex-1">
              <p class="font-semibold text-text-primary text-sm">${
                i.product.title
              }</p>
              <p class="text-xs text-text-secondary">Qty: ${i.qty}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-accent text-sm">${(
                i.product.price * i.qty
              ).toFixed(2)}</p>
              <p class="text-xs text-text-secondary">${i.product.price.toFixed(
                2
              )} each</p>
            </div>
          </div>
        `
          )
          .join("");
      }
    }

    let subtotal = 0;
    items.forEach((i) => (subtotal += i.product.price * i.qty));

    let discount = 0;
    if (appliedCoupon) {
      discount = subtotal * appliedCoupon.discount;
    }

    const subtotalAfterDiscount = subtotal - discount;
    const delivery = subtotalAfterDiscount * 0.02;
    const shipping =
      subtotalAfterDiscount > 2000 ? 0 : subtotalAfterDiscount > 0 ? 50 : 0;
    const total = Math.max(0, subtotalAfterDiscount + delivery + shipping);

    document.getElementById("cart-item-count").textContent = items.length;
    document.getElementById("subtotal-display").textContent =
      subtotal.toFixed(2);

    const discountRow = document.getElementById("discount-row");
    const discountDisplay = document.getElementById("discount-display");
    if (discount > 0) {
      discountRow.classList.remove("hidden");
      discountDisplay.textContent = `-${discount.toFixed(2)}`;
    } else {
      discountRow.classList.add("hidden");
    }

    document.getElementById("delivery-display").textContent =
      delivery.toFixed(2);
    document.getElementById("shipping-display").textContent =
      shipping.toFixed(2);
    document.getElementById("total-display").textContent = total.toFixed(2);

    const confirmBtn = document.getElementById("confirmOrder");
    if (confirmBtn) {
      if (items.length === 0) {
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = "0.5";
        confirmBtn.style.cursor = "not-allowed";
      } else if (total > balance) {
        confirmBtn.style.background =
          "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
        confirmBtn.textContent = "Insufficient Balance";
      } else {
        confirmBtn.style.background =
          "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)";
        confirmBtn.textContent = "Confirm & Pay";
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = "1";
        confirmBtn.style.cursor = "pointer";
      }
    }

    renderOrders();
  }

  function confirmOrder() {
    const cart = loadCart();
    const items = Object.values(cart);

    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const balance = Utils.lsGet("smartshop_balance_v2", 1000);
    let subtotal = 0;
    items.forEach((i) => (subtotal += i.product.price * i.qty));

    let discount = 0;
    if (appliedCoupon) {
      discount = subtotal * appliedCoupon.discount;
    }

    const subtotalAfterDiscount = subtotal - discount;
    const delivery = subtotalAfterDiscount * 0.02;
    const shipping =
      subtotalAfterDiscount > 2000 ? 0 : subtotalAfterDiscount > 0 ? 50 : 0;
    const total = Math.max(0, subtotalAfterDiscount + delivery + shipping);

    if (total > balance) {
      alert(
        "Insufficient balance. Your current balance: " +
          balance.toFixed(2) +
          " BDT"
      );
      return;
    }

    const newBalance = balance - total;
    Utils.lsSet("smartshop_balance_v2", newBalance);

    const balanceElement = document.getElementById("user-balance");
    if (balanceElement) {
      balanceElement.textContent = newBalance.toFixed(2);
    }

    const orders = loadOrders();
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      total: total,
      subtotal: subtotal,
      discount: discount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      items: items.map((i) => ({
        id: i.product.id,
        title: i.product.title,
        qty: i.qty,
        price: i.product.price,
      })),
    };
    orders.unshift(order);
    saveOrders(orders);

    window.CartModule.saveCart({});
    window.CartModule.renderCartUI();
    appliedCoupon = null;
    document.getElementById("couponInput").value = "";
    document.getElementById("couponStatus").textContent = "";

    renderCheckout();

    showSuccessModal(order);
  }

  function renderOrders() {
    const list = document.getElementById("orders-list");
    if (!list) return;

    const orders = loadOrders();
    if (orders.length === 0) {
      list.innerHTML =
        '<div class="text-center py-8 text-text-secondary">No orders yet.</div>';
      return;
    }

    list.innerHTML = orders
      .map(
        (o) => `
      <div class="card-glass rounded-xl border border-white/20 p-6 hover:border-accent/50 transition">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <p class="font-bold text-text-primary text-lg">Order #${o.id}</p>
            <p class="text-sm text-text-secondary">${new Date(
              o.date
            ).toLocaleDateString()} at ${new Date(
          o.date
        ).toLocaleTimeString()}</p>
          </div>
          <p class="text-xl font-bold text-accent mt-2 sm:mt-0">${o.total.toFixed(
            2
          )} BDT</p>
        </div>
        <div class="text-sm text-text-secondary">
          <p class="font-semibold mb-2">${o.items.length} item(s)</p>
          <div class="space-y-1">
            ${o.items
              .map((item) => `<p>• ${item.title} x${item.qty}</p>`)
              .join("")}
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderCheckout();

    const confirmBtn = document.getElementById("confirmOrder");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", confirmOrder);
    }

    const applyCouponBtn = document.getElementById("applyCoupon");
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener("click", applyCoupon);

      const couponInput = document.getElementById("couponInput");
      if (couponInput) {
        couponInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") applyCoupon();
        });
      }
    }
  });
})();
