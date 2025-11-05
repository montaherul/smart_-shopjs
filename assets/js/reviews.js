(async function(){
  const track = document.getElementById('reviews-track');
  const prev = document.getElementById('prevReview');
  const next = document.getElementById('nextReview');
  let reviews = [];
  try{
    const res = await fetch('assets/data/reviews.json');
    reviews = await res.json();
  }catch(e){ reviews = []; }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function render(){
    if(!track) return;
    track.innerHTML = reviews.map(r=> `
      <div class="min-w-full p-4 bg-gray-50 rounded">
        <div class="flex items-center justify-between"><div><div class="font-semibold">${escapeHtml(r.name)}</div><div class="text-sm text-gray-500">${escapeHtml(r.date)}</div></div><div class="text-yellow-500">${'★'.repeat(r.rating)}</div></div>
        <p class="mt-3 text-sm">${escapeHtml(r.comment)}</p>
      </div>
    `).join('');
    show(0);
  }
  let idx=0; function show(i){ idx = (i + reviews.length) % reviews.length; track.style.transform = `translateX(-${idx*100}%)`; }
  prev?.addEventListener('click', ()=> show(idx-1)); next?.addEventListener('click', ()=> show(idx+1));
  render();
  setInterval(()=> show(idx+1), 5000);
})();
