window.CartModule = (function(){
  const KEY = 'smartshop_cart_v2';
  function loadCart(){ try{ return JSON.parse(localStorage.getItem(KEY) || '{}'); }catch(e){ return {}; } }
  function saveCart(c){ try{ localStorage.setItem(KEY, JSON.stringify(c)); }catch(e){} }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function renderCartUI(){
    const cart = loadCart(); const entries = Object.values(cart);
    const el = document.getElementById('cart-count'); if(el) el.textContent = entries.reduce((s,e)=> s + e.qty, 0);
    const dropdown = document.getElementById('cart-dropdown');
    if(!dropdown) return;
    if(entries.length===0){ dropdown.innerHTML = '<div class="text-sm">Cart is empty</div>'; return; }
    let html = '';
    entries.forEach(e=>{
      html += `<div class="flex items-center justify-between py-2 border-b">
        <div class="flex items-center space-x-3"><img src="${e.product.image}" class="h-10 w-10 object-contain"/><div class="text-sm">${escapeHtml(e.product.title)}<div class="text-xs text-gray-500">${e.product.price} BDT x ${e.qty}</div></div></div>
        <div><button data-id="${e.product.id}" class="remove text-red-600">Remove</button></div>
      </div>`;
    });
    html += `<div class="mt-3"><button id="clearCart" class="w-full bg-red-500 text-white py-2 rounded">Clear Cart</button></div>`;
    dropdown.innerHTML = html;
    dropdown.querySelectorAll('.remove').forEach(btn=> btn.addEventListener('click', ev=>{
      const id = String(ev.currentTarget.dataset.id);
      const c = loadCart(); delete c[id]; saveCart(c); renderCartUI();
    }));
    dropdown.querySelector('#clearCart')?.addEventListener('click', ()=>{ saveCart({}); renderCartUI(); });
  }
  return { loadCart, saveCart, renderCartUI };
})();
