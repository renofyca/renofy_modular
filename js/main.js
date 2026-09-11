
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const qs=s=>document.querySelector(s);
const qsa=s=>Array.from(document.querySelectorAll(s));
const smoothstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};

const nav=qs('#nav');
const progress=qs('#progress');
const heroMedia=qs('#heroMedia');
const heroContent=qs('#heroContent');
const film=qs('#film');
const filmFrame=qs('#filmFrame');
const filmCopy=qs('#filmCopy');
const filmLabel=qs('#filmLabel');
const story=qs('.story');
const storyBg=qs('#storyBg');
const storyLines=qsa('.story-line');
const stackPin=qs('#stackPin');
const stackCards=qsa('.stack-card');
const galleryPin=qs('.gallery-pin');
const galleryTrack=qs('#galleryTrack');
const galleryProgress=qs('#galleryProgress');
const compare=qs('#compare');
const after=qs('#after');
const compareLine=qs('#compareLine');
const materialRow=qs('#materialRow');
const materialsPin=qs('.materials-pin');
const materialsProgress=qs('#materialsProgress');
const processSection=qs('#process');
const steps=qsa('.step');

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

let lastY=scrollY;
let lastT=performance.now();
let velocity=0;
let targetVelocity=0;
let smoothVelocity=0;
let raf=0;

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('on');
      revealObserver.unobserve(e.target);
    }
  });
},{threshold:.08});
qsa('.reveal').forEach(el=>revealObserver.observe(el));

const navlinks=qsa('#navlinks a');
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    const link=navlinks.find(a=>a.dataset.sec===e.target.id);
    if(link) link.classList.toggle('active',e.isIntersecting);
  });
},{rootMargin:'-45% 0px -45% 0px'});
['story','work','materials','process','contact'].forEach(id=>{
  const el=document.getElementById(id);
  if(el) navObserver.observe(el);
});

function sectionProgress(el){
  const r=el.getBoundingClientRect();
  return clamp((innerHeight-r.top)/(innerHeight+r.height),0,1);
}
function pinProgress(el){
  const r=el.getBoundingClientRect();
  const total=el.offsetHeight-innerHeight;
  if(total<=0) return 1;
  return clamp(-r.top/total,0,1);
}

function measureVelocity(now){
  const dy=scrollY-lastY;
  const dt=Math.max(8,now-lastT);
  targetVelocity=clamp(Math.abs(dy/dt)*16,0,1);
  velocity=clamp(dy/dt*16,-1,1);
  lastY=scrollY;
  lastT=now;
}

function animate(now=performance.now()){
  measureVelocity(now);
  smoothVelocity += (targetVelocity-smoothVelocity)*.11;

  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(max?scrollY/max*100:0)+'%';
  nav.classList.toggle('scrolled',scrollY>70);

  if(!reduce){
    const hp=clamp(scrollY/innerHeight,0,1);
    const heroPush=hp*.13 + smoothVelocity*.035;
    heroMedia.style.transform=`scale(${1.08+heroPush}) translate3d(0,${hp*-3.5-velocity*1.1}%,0)`;
    heroMedia.style.filter=`saturate(${.72+smoothVelocity*.22}) contrast(${1+smoothVelocity*.055})`;
    heroContent.style.transform=`translate3d(0,${scrollY*.08}px,0)`;
    heroContent.style.opacity=1-smoothstep(0,.85,hp);

    const fp=pinProgress(film);
    const growEnd=.55;
    const grow=smoothstep(0,growEnd,fp);
    const frameW=34+grow*66;
    const frameH=42+grow*58;
    const radius=28*(1-grow);
    filmFrame.style.width=frameW+'vw';
    filmFrame.style.height=frameH+'vh';
    filmFrame.style.borderRadius=radius+'px';
    filmLabel.style.opacity=1-smoothstep(0,.28,fp);
    filmLabel.style.transform=`translateY(${-fp*40}px)`;
    const copyIn=smoothstep(growEnd,growEnd+.28,fp);
    filmCopy.style.opacity=copyIn;
    filmCopy.style.transform=`translateY(${(1-copyIn)*24}px)`;

    const sp=pinProgress(story);
    storyBg.style.opacity=.04+sp*.70+smoothVelocity*.08;
    storyBg.style.transform=`scale(${.58+sp*.60+smoothVelocity*.045}) rotate(${5-sp*5-velocity*2}deg) translate3d(${velocity*1.5}%,${(1-sp)*45-velocity*3}px,0)`;
    storyBg.style.filter=`saturate(${.6+smoothVelocity*.25}) blur(${smoothVelocity*1.5}px)`;
    const bands=[[0,.42],[.30,.68],[.58,1]];
    storyLines.forEach((el,i)=>{
      const [a,b]=bands[i];
      const mid=(a+b)/2;
      const inO=smoothstep(a,mid,sp);
      const outO=1-smoothstep(mid,b,sp);
      const finalO= sp<=a ? (i===0?1:0) : Math.min(inO,outO);
      el.style.opacity=finalO;
      el.style.transform=`translateY(${(1-inO)*26}px)`;
    });

    const stp=pinProgress(stackPin)*stackCards.length;
    stackCards.forEach((card,i)=>{
      const local=clamp(stp-i,0,1);
      const covered=Math.max(0,stp-(i+1));
      const y=(1-local)*100;
      const scale=1-Math.min(covered,1)*.06;
      const bright=1-Math.min(covered,1)*.45;
      card.style.transform=`translateY(${y}vh) scale(${scale})`;
      card.style.filter=`brightness(${bright})`;
      card.style.zIndex=i+1;
    });

    if(galleryTrack && galleryPin){
      const gp=pinProgress(galleryPin);
      const travel=Math.max(0,galleryTrack.scrollWidth-innerWidth+innerWidth*0.06);
      galleryTrack.style.transform=`translate3d(${-gp*travel}px,0,0)`;
      if(galleryProgress) galleryProgress.style.width=(gp*100)+'%';
    }

    const cp=pinProgress(compare);
    const x=clamp(8+cp*84,8,92);
    after.style.clipPath=`inset(0 ${100-x}% 0 0)`;
    compareLine.style.left=x+'%';

    if(materialRow && materialsPin){
      const matp=pinProgress(materialsPin);
      const travel=Math.max(0,materialRow.scrollWidth-innerWidth+innerWidth*0.06);
      materialRow.style.transform=`translate3d(${-matp*travel}px,0,0)`;
      if(materialsProgress) materialsProgress.style.width=(matp*100)+'%';
      const center=innerWidth/2;
      materialRow.querySelectorAll('.material').forEach(el=>{
        const r=el.getBoundingClientRect();
        const dist=Math.abs((r.left+r.width/2)-center)/innerWidth;
        const focus=1-clamp(dist*1.6,0,1);
        el.style.filter=`saturate(${.7+focus*.35})`;
      });
    }

    const pp=sectionProgress(processSection);
    const activeIdx=Math.floor(smoothstep(.15,.85,pp)*steps.length);
    steps.forEach((el,i)=>el.classList.toggle('active',i<activeIdx));

    const cta=document.querySelector('.cta');
    if(cta){
      const cp2=sectionProgress(cta);
      cta.style.setProperty('--camera',`${1.05+cp2*.06+smoothVelocity*.03}`);
      const pseudoHint=cta.querySelector(':scope > div');
      if(pseudoHint) pseudoHint.style.transform=`translate3d(0,${velocity*-5}px,0)`;
    }
  }

  raf=requestAnimationFrame(animate);
}

addEventListener('scroll',()=>{ if(!raf) raf=requestAnimationFrame(animate); },{passive:true});
addEventListener('resize',()=>{ if(!raf) raf=requestAnimationFrame(animate); },{passive:true});

animate();

