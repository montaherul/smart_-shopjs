// Utilities
window.Utils = (function(){
  function $qs(sel, ctx=document){ return ctx.querySelector(sel); }
  function $qa(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }
  function formatCurrency(v){ return Number(v).toFixed(2); }
  function lsGet(key, fallback=null){ try{ const v=localStorage.getItem(key); return v? JSON.parse(v): fallback;}catch(e){return fallback;} }
  function lsSet(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} }
  return { $qs, $qa, formatCurrency, lsGet, lsSet };
})();
