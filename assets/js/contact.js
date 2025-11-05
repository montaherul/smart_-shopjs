document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('contact-form'); const msg = document.getElementById('contact-msg');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault(); const name = document.getElementById('cname').value.trim(); const email = document.getElementById('cemail').value.trim(); const message = document.getElementById('cmessage').value.trim();
    if(!name||!email||!message){ msg.textContent='Please fill all fields.'; msg.className='text-red-600'; return; }
    msg.textContent = `Thank you, ${name}! We received your message.`; msg.className='text-green-600'; form.reset();
  });
});
