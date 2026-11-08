const day=86400000, today=new Date(); today.setHours(0,0,0,0);
const iso=d=>{const x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")};
const off=n=>iso(+today+n*day);
const VIEW=document.body.classList.contains("view");
const CS=VIEW?10:11;
let data=(Array.isArray(window.TRAINING_DATA)?window.TRAINING_DATA:[]).map(r=>({...r}));
const KEY="dt-dashboard-data-v1";
if(!VIEW){try{const s=JSON.parse(localStorage.getItem(KEY)||"null");if(Array.isArray(s))data=s}catch(e){}}
function save(){if(VIEW)return;try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}}
let editIdx=-1;
let filter="all",from="",to="",ym="",yr="";
const mon=new Date(+today-((today.getDay()+6)%7)*day), sun=new Date(+mon+6*day);
function inRange(r){
  const d=new Date(r.d+"T00:00:00");
  if(filter==="week")return d>=mon&&d<=sun;
  if(filter==="month")return d.getMonth()===today.getMonth()&&d.getFullYear()===today.getFullYear();
  if(filter==="range")return !(from&&r.d<from)&&!(to&&r.d>to);
  if(filter==="ym")return r.d.slice(0,7)===ym;
  if(filter==="year")return r.d.slice(0,4)===yr;
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
    const [y,m,dd]=r.d.split("-");let head="";if(r.c!==lastC){lastC=r.c;seq=0;const g=list.filter(z=>z.r.c===r.c),gd=g.filter(z=>z.r.ok).length;head=`<tr class="grp"><td colspan="${CS}"><b>${esc(r.c)}</b><span>${g.length} chuyên đề, ${gd} đã hoàn thành</span></td></tr>`}seq++;
    return head+`<tr><td>${seq}</td><td>${esc(r.n)}</td><td>${esc(r.t)}</td><td>${esc(r.cty||"")}</td><td>${esc(r.p)}</td><td>${dd}/${m}/${y}</td><td>${fmt(r.h)} giờ</td><td>${r.s}</td><td>${fmt(r.h*r.s)} giờ</td>
    <td><button class="tag ${r.ok?"ok":"no"}" data-i="${i}" title="Bấm để đổi trạng thái">${r.ok?"Hoàn thành":"Chưa hoàn thành"}</button></td>
    <td class="actc"><button class="act" data-a="edit" data-i="${i}">Sửa</button><button class="act del" data-a="del" data-i="${i}">Xóa</button></td></tr>`}).join("")
    :`<tr><td colspan="${CS}" class="empty">Chưa có chuyên đề nào trong khoảng thời gian này. Thêm chuyên đề ở phía dưới.</td></tr>`;
  document.querySelectorAll(".tabs button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.f===filter));
}
function clearCtl(keep){
  if(keep!=="range"){$("fFrom").value="";$("fTo").value=""}
  if(keep!=="ym")$("fMonth").value="";
  if(keep!=="year")$("fYear").value="";
}
function fillYears(){
  const s=$("fYear"),cur=s.value;
  const ys=[...new Set(data.map(r=>r.d.slice(0,4)).concat(String(today.getFullYear())))].sort();
  s.innerHTML='<option value="">Tất cả</option>'+ys.map(y=>`<option value="${y}">${y}</option>`).join("");
  s.value=cur;
}
document.querySelector(".tabs").addEventListener("click",e=>{const b=e.target.closest("button");if(b){filter=b.dataset.f;clearCtl("");render()}});
["fFrom","fTo"].forEach(id=>$(id).addEventListener("change",()=>{clearCtl("range");from=$("fFrom").value;to=$("fTo").value;filter=(from||to)?"range":"all";render()}));
$("fMonth").addEventListener("change",()=>{clearCtl("ym");ym=$("fMonth").value;filter=ym?"ym":"all";render()});
$("fYear").addEventListener("change",()=>{clearCtl("year");yr=$("fYear").value;filter=yr?"year":"all";render()});
$("rows").addEventListener("click",e=>{
  if(VIEW)return;
  const b=e.target.closest(".tag");
  if(b){const r=data[+b.dataset.i];r.ok=!r.ok;save();render();return}
  const a=e.target.closest(".act");if(!a)return;
  const i=+a.dataset.i,r=data[i];
  if(a.dataset.a==="del"){
    if(confirm("Xóa chuyên đề \""+r.n+"\"?")){data.splice(i,1);if(editIdx===i)stopEdit();else if(editIdx>i)editIdx--;save();fillYears();fillCourses();render()}
    return;
  }
  editIdx=i;
  $("fName").value=r.n;$("fCourse").value=r.c;$("fTeacher").value=r.t;$("fCompany").value=r.cty||"";
  $("fDate").value=r.d;$("fHours").value=r.h;$("fStu").value=r.s;$("fRoom").value=r.p;
  $("fSubmit").textContent="Lưu thay đổi";$("fCancel").hidden=false;$("fHint").textContent="Đang sửa: "+r.n;
  $("f").scrollIntoView({behavior:"smooth",block:"center"});
});
$("f").addEventListener("submit",e=>{
  e.preventDefault();
  const o={n:$("fName").value.trim(),c:$("fCourse").value.trim(),t:$("fTeacher").value.trim(),cty:$("fCompany").value.trim(),p:$("fRoom").value.trim(),d:$("fDate").value,h:+$("fHours").value,s:+$("fStu").value};
  if(editIdx>=0){o.ok=data[editIdx].ok;data[editIdx]=o}else{o.ok=false;data.push(o)}
  stopEdit();save();fillYears();fillCourses();render();
});
function fillCourses(){
  const cs=[...new Set(data.map(r=>r.c))].sort((a,b)=>a.localeCompare(b,"vi",{numeric:true}));
  $("courses").innerHTML=cs.map(c=>`<option value="${esc(c)}">`).join("");
}
function stopEdit(){
  editIdx=-1;$("f").reset();$("fSubmit").textContent="Thêm chuyên đề";$("fCancel").hidden=true;$("fHint").textContent="Thêm chuyên đề mới";
}
$("fCancel").addEventListener("click",stopEdit);

/* ===== Excel: nhập, xuất, file mẫu ===== */
const COLS=["Khóa học","Tên chuyên đề","Giảng viên","Công ty","Địa điểm đào tạo","Ngày đào tạo","Thời lượng (giờ)","Số học viên","Trạng thái"];
const pad2=n=>String(n).padStart(2,"0");
const norm=s=>String(s==null?"":s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/gi,"d").toLowerCase().replace(/[^a-z0-9]/g,"");
const KEYS={khoahoc:"c",tenchuyende:"n",chuyende:"n",giangvien:"t",congty:"cty",diadiemdaotao:"p",diadiem:"p",ngaydaotao:"d",ngay:"d",thoiluong:"h",thoiluonggio:"h",sohocvien:"s",hocvien:"s",trangthai:"ok"};
const num=v=>{const x=parseFloat(String(v==null?"":v).replace(",","."));return isFinite(x)&&x>0?x:0};
function toISO(v){
  if(typeof v==="number"&&isFinite(v)){const d=new Date(Math.round((v-25569)*864e5));return d.getUTCFullYear()+"-"+pad2(d.getUTCMonth()+1)+"-"+pad2(d.getUTCDate())}
  const s=String(v==null?"":v).trim();let m;
  if(m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))return m[1]+"-"+pad2(m[2])+"-"+pad2(m[3]);
  if(m=s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})/))return m[3]+"-"+pad2(m[2])+"-"+pad2(m[1]);
  return "";
}
function parseRows(rows){
  const out=[];let skip=0;
  rows.forEach(row=>{
    const o={};
    for(const k in row){const f=KEYS[norm(k)];if(f)o[f]=row[k]}
    const n=String(o.n==null?"":o.n).trim(),d=toISO(o.d);
    if(!n||!d){skip++;return}
    const st=norm(o.ok);
    out.push({n,c:String(o.c==null?"":o.c).trim()||"Chưa phân khóa",t:String(o.t==null?"":o.t).trim(),cty:String(o.cty==null?"":o.cty).trim(),p:String(o.p==null?"":o.p).trim(),d,h:num(o.h),s:Math.round(num(o.s)),ok:/^(hoanthanh|dahoanthanh|xong|x|1|true|co|ok)$/.test(st)});
  });
  return {out,skip};
}
function msg(t){$("msg").textContent=t}
function noLib(){
  if(typeof XLSX==="undefined"){msg("Chưa tải được thư viện Excel. Hãy kiểm tra kết nối mạng rồi tải lại trang.");return true}
  return false;
}
function saveXlsx(aoa,name,sheet){
  const ws=XLSX.utils.aoa_to_sheet(aoa);ws["!cols"]=aoa[0].map(()=>({wch:22}));
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,sheet);XLSX.writeFile(wb,name);
}
const vnDate=d=>d.split("-").reverse().join("/");
$("bTpl").addEventListener("click",()=>{
  if(noLib())return;
  saveXlsx([COLS,
    ["Khóa học 1","Định hướng nhân viên mới","Nguyễn Văn An","Công ty A","Phòng A1","15/11/2026",3,25,"Chưa hoàn thành"],
    ["Khóa học 1","An toàn thông tin cơ bản","Trần Thị Bình","Công ty A","Phòng A2","20/11/2026",2,40,"Hoàn thành"]],
    "mau-nhap-chuyen-de.xlsx","Chuyên đề");
  msg("Đã tạo file mẫu. Điền dữ liệu theo đúng tên cột rồi chọn Nhập từ Excel.");
});
$("bExp").addEventListener("click",()=>{
  if(noLib())return;
  saveXlsx([COLS.concat("Số giờ đào tạo")].concat(data.map(r=>[r.c,r.n,r.t,r.cty||"",r.p,vnDate(r.d),r.h,r.s,r.ok?"Hoàn thành":"Chưa hoàn thành",r.h*r.s])),
    "danh-sach-chuyen-de.xlsx","Chuyên đề");
  msg("Đã xuất "+data.length+" chuyên đề ra file Excel.");
});
$("bPub").addEventListener("click",()=>{
  const txt="/* Dữ liệu hiển thị cho mọi người. Xuất từ trang quản trị. */\nwindow.TRAINING_DATA=[\n"+data.map(r=>JSON.stringify(r)).join(",\n")+"\n];\n";
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([txt],{type:"text/javascript"}));a.download="data.js";
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  msg("Đã tạo file data.js ("+data.length+" chuyên đề). Tải file này lên GitHub, thay file data.js cũ, để mọi người cùng thấy số liệu mới.");
});
$("bClr").addEventListener("click",()=>{
  if(confirm("Xóa toàn bộ dữ liệu chuyên đề hiện có?")){data=[];stopEdit();save();fillYears();fillCourses();render();msg("Đã xóa toàn bộ dữ liệu.")}
});
$("fFile").addEventListener("change",async e=>{
  const f=e.target.files[0];if(!f)return;
  if(noLib()){e.target.value="";return}
  try{
    const wb=XLSX.read(await f.arrayBuffer(),{type:"array"});
    const res=parseRows(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:""}));
    if(!res.out.length){
      msg("Không đọc được dòng nào. File cần có cột \"Tên chuyên đề\" và \"Ngày đào tạo\" (bấm Tải file mẫu để xem định dạng).");
    }else if($("fMode").value==="replace"&&!confirm("Thay thế "+data.length+" chuyên đề hiện có bằng "+res.out.length+" dòng trong file?")){
      msg("Đã hủy nhập.");
    }else{
      data=$("fMode").value==="replace"?res.out:data.concat(res.out);
      stopEdit();save();fillYears();fillCourses();render();
      msg("Đã nhập "+res.out.length+" chuyên đề"+(res.skip?", bỏ qua "+res.skip+" dòng thiếu tên hoặc ngày":"")+".");
    }
  }catch(err){msg("Không đọc được file. Hãy dùng file .xlsx, .xls hoặc .csv.")}
  e.target.value="";
});

fillYears();fillCourses();render();
