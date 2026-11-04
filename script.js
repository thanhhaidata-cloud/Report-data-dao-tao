const day=86400000, today=new Date(); today.setHours(0,0,0,0);
const iso=d=>{const x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")};
const off=n=>iso(+today+n*day);
let data=[
 {n:"Định hướng nhân viên mới",c:"Khóa học 1",d:off(-20),h:3,s:24,t:"Nguyễn Văn An",p:"Phòng A1",ok:true},
 {n:"An toàn thông tin cơ bản",c:"Khóa học 1",d:off(-12),h:2,s:58,t:"Trần Thị Bình",p:"Phòng A2",ok:true},
 {n:"Kỹ năng giao tiếp nội bộ",c:"Khóa học 1",d:off(-6),h:4,s:32,t:"Lê Minh Châu",p:"Phòng B1",ok:true},
 {n:"Quản lý thời gian",c:"Khóa học 1",d:off(-1),h:2,s:41,t:"Phạm Quốc Dũng",p:"Phòng A1",ok:true},
 {n:"Kỹ năng chăm sóc khách hàng",c:"Khóa học 2",d:off(1),h:3,s:36,t:"Trần Thị Bình",p:"Phòng B2",ok:false},
 {n:"Lãnh đạo nhóm cho trưởng bộ phận",c:"Khóa học 2",d:off(3),h:6,s:15,t:"Võ Thanh Hà",p:"Phòng A2",ok:false},
 {n:"Quy trình ISO nội bộ",c:"Khóa học 2",d:off(12),h:2.5,s:50,t:"Nguyễn Văn An",p:"Phòng B1",ok:false}
];
let filter="all";
const mon=new Date(+today-((today.getDay()+6)%7)*day), sun=new Date(+mon+6*day);
function inRange(r){
  const d=new Date(r.d+"T00:00:00");
  if(filter==="week")return d>=mon&&d<=sun;
  if(filter==="month")return d.getMonth()===today.getMonth()&&d.getFullYear()===today.getFullYear();
  return true;
}
const fmt=n=>(Math.round(n*10)/10).toLocaleString("vi-VN");
const $=id=>document.getElementById(id);
function esc(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function render(){
  const t=data.length, done=data.filter(r=>r.ok).length, not=t-done;
  const p=t?Math.round(done/t*100):0;
  $("kTotal").textContent=t;
  $("kHours").textContent=fmt(data.reduce((a,r)=>a+r.h,0));
  $("kStu").textContent=data.reduce((a,r)=>a+r.s,0).toLocaleString("vi-VN");
  $("kNot").textContent=not;
  $("pct").textContent=p+"%";
  $("ring").style.setProperty("--p",p);
  $("doneTxt").textContent=done+" / "+t+" chuyên đề đã hoàn thành";
  $("notTxt").textContent=not+" chuyên đề chưa hoàn thành";
  let lastC=null,seq=0;const list=data.map((r,i)=>({r,i})).filter(x=>inRange(x.r)).sort((a,b)=>a.r.c.localeCompare(b.r.c,"vi",{numeric:true})||(a.r.d<b.r.d?-1:1));
  $("rows").innerHTML=list.length?list.map(({r,i},k)=>{
    const [y,m,dd]=r.d.split("-");let head="";if(r.c!==lastC){lastC=r.c;seq=0;const g=list.filter(z=>z.r.c===r.c),gd=g.filter(z=>z.r.ok).length;head=`<tr class="grp"><td colspan="8"><b>${esc(r.c)}</b><span>${g.length} chuyên đề, ${gd} đã hoàn thành</span></td></tr>`}seq++;
    return head+`<tr><td>${seq}</td><td>${esc(r.n)}</td><td>${esc(r.t)}</td><td>${esc(r.p)}</td><td>${dd}/${m}/${y}</td><td class="n">${fmt(r.h)}</td><td class="n">${r.s}</td>
    <td><button class="tag ${r.ok?"ok":"no"}" data-i="${i}" title="Bấm để đổi trạng thái">${r.ok?"Hoàn thành":"Chưa hoàn thành"}</button></td></tr>`}).join("")
    :`<tr><td colspan="8" class="empty">Chưa có chuyên đề nào trong khoảng thời gian này. Thêm chuyên đề ở phía dưới.</td></tr>`;
  document.querySelectorAll(".tabs button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.f===filter));
}
document.querySelector(".tabs").addEventListener("click",e=>{const b=e.target.closest("button");if(b){filter=b.dataset.f;render()}});
$("rows").addEventListener("click",e=>{const b=e.target.closest(".tag");if(b){const r=data[+b.dataset.i];r.ok=!r.ok;render()}});
$("f").addEventListener("submit",e=>{
  e.preventDefault();
  data.push({n:$("fName").value.trim(),c:$("fCourse").value.trim(),t:$("fTeacher").value.trim(),p:$("fRoom").value.trim(),d:$("fDate").value,h:+$("fHours").value,s:+$("fStu").value,ok:false});
  e.target.reset();render();
});
render();
