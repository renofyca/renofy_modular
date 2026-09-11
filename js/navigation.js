const menuButton=qs('.hamb');
const menuLinks=qs('#navlinks');
function setMenu(open){
  menuLinks.classList.toggle('open',open);
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.textContent=open?'CLOSE':'MENU';
}
menuButton.addEventListener('click',()=>setMenu(!menuLinks.classList.contains('open')));
menuLinks.addEventListener('click',e=>{if(e.target.closest('a')) setMenu(false)});
addEventListener('keydown',e=>{if(e.key==='Escape') setMenu(false)});
addEventListener('resize',()=>{if(innerWidth>800) setMenu(false)},{passive:true});
