const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function fmtPace(p){if(!p||!isFinite(p))return '–';let m=Math.floor(p),s=Math.round((p-m)*60);if(s===60){m++;s=0}return m+':'+String(s).padStart(2,'0')}
const fmtClock=t=>[Math.floor(t/3600),Math.floor(t%3600/60),t%60].map(n=>String(n).padStart(2,'0')).join(':');
const fmtDate=s=>s?new Date(s+'T00:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}):'–';
function fmtTotal(t){const h=Math.floor(t/3600),m=Math.floor(t%3600/60);return h?`${h}<small>h</small> ${m}<small>m</small>`:`${m}<small>m</small>`}
async function loadRuns(includeArchived=false){
  const{data,error}=await supabase.from('runs').select('id,activity_name,distance,duration_seconds,pace,run_date,notes,archived').order('run_date',{ascending:false}).order('created_at',{ascending:false}).limit(1000);
  if(error){showMessage('msg',error.message);return[]}
  return data.filter(r=>includeArchived||!r.archived).map(r=>({id:r.id,name:r.activity_name||'Activity',distance:+r.distance||0,seconds:+r.duration_seconds||0,pace:+r.pace||0,date:r.run_date,notes:r.notes||'',archived:!!r.archived}));
}
function bestRun(runs){const p=runs.filter(r=>r.pace>0&&isFinite(r.pace));return p.length?p.reduce((a,r)=>r.pace<a.pace?r:a):null}
const sum=(runs,k)=>runs.reduce((a,r)=>a+r[k],0);
