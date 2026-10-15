(() => {
  "use strict";
  const read = key => { try { const value=JSON.parse(localStorage.getItem(key)||"null"); return value&&typeof value==="object"?value:{}; } catch (_) { return {}; } };
  const core=read("greenfarm.v2"), center=read("greenfarm.advanced.v1");
  const records=core.records&&typeof core.records==="object"?core.records:{};
  const arr=(source,key)=>Array.isArray(source?.[key])?source[key]:[];
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const csvCell=v=>{const text=String(v??"");return '"'+((text[0]==="="||text[0]==="+"||text[0]==="-"||text[0]==="@"||text.charCodeAt(0)===9||text.charCodeAt(0)===13)?"'":"")+text.replace(/"/g,'""')+'"';};
  const download=(name,rows,columns)=>{
    if(!rows.length){announce("There are no records to export yet.");return;}
    const csv=[columns.map(c=>csvCell(c.label)).join(","),...rows.map(row=>columns.map(c=>csvCell(row[c.key])).join(","))].join("\r\n");
    const url=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download=name+"-"+new Date().toISOString().slice(0,10)+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  function announce(message){const live=document.getElementById("viewStatus");if(live)live.textContent=message;}
  const today=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
  const taskRows=[
    ...arr(center,"tasks").map(r=>({...r,viewType:"Task",viewTitle:r.task||"Farm task",viewDate:r.due||"",viewDetail:r.field||r.priority||"Farm Center",viewStatus:r.status||"Pending",viewHref:"advanced.html#taskList"})),
    ...arr(center,"irrigation").map(r=>({...r,viewType:"Irrigation",viewTitle:"Irrigation · "+(r.field||r.crop||"Field"),viewDate:r.next||"",viewDetail:r.method||"Farm Center",viewStatus:"Planned",viewHref:"advanced.html#irrList"})),
    ...arr(records,"irrigation").map(r=>({...r,viewType:"Irrigation",viewTitle:"Irrigation · "+(r.field||"Field"),viewDate:r.date||"",viewDetail:r.method||"Workspace",viewStatus:r.status||"Planned",viewHref:"farm.html#irrigation"})),
    ...arr(records,"ipm").filter(r=>r.followup).map(r=>({...r,viewType:"Scouting follow-up",viewTitle:"Scouting · "+(r.issue||r.field||"Crop"),viewDate:r.followup,viewDetail:r.severity||"",viewStatus:"Follow-up",viewHref:"farm.html#ipm"})),
    ...arr(center,"cropPlans").filter(r=>r.next).map(r=>({...r,viewType:"Crop check",viewTitle:"Crop check · "+(r.crop||"Crop"),viewDate:r.next,viewDetail:r.field||"",viewStatus:r.health||"Scheduled",viewHref:"advanced.html#cropsList"}))
  ].filter(r=>r.viewDate).map(r=>({...r,viewOverdue:r.viewStatus!=="Completed"&&r.viewStatus!=="Skipped"&&r.viewDate<today}));

  function pageRows(page){
    if(page==="crops")return [
      ...arr(records,"crops").map(r=>({...r,viewType:"Workspace",viewTitle:r.crop||"Crop",viewDate:r.date||"",viewDetail:[r.field,r.variety,r.stage].filter(Boolean).join(" · "),viewStatus:r.stage||"Recorded",viewHref:"farm.html#crops"})),
      ...arr(center,"cropPlans").map(r=>({...r,viewType:"Farm Center",viewTitle:r.crop||"Crop",viewDate:r.sowing||"",viewDetail:[r.field,r.variety,r.stage].filter(Boolean).join(" · "),viewStatus:r.health||"Recorded",viewHref:"advanced.html#cropsList"}))
    ];
    if(page==="livestock")return arr(records,"livestock").map(r=>({...r,viewType:"Workspace",viewTitle:r.group||"Animal group",viewDate:r.date||"",viewDetail:[r.count? r.count+" animals":"",r.purpose,r.health].filter(Boolean).join(" · "),viewStatus:r.health||"Recorded",viewHref:"farm.html#livestock"}));
    return taskRows;
  }
  function rowMarkup(row,page){
    return '<article class="record-card"><div class="record-card-top"><span class="record-source">'+esc(row.viewType)+'</span><span class="record-status '+(row.viewOverdue?"is-late":"")+'">'+esc(row.viewOverdue?"Overdue":row.viewStatus||"Recorded")+'</span></div><h2>'+esc(row.viewTitle)+'</h2><p>'+esc(row.viewDetail||"No additional details")+'</p><div class="record-card-bottom"><span>'+esc(row.viewDate||"Date not entered")+'</span><a href="'+row.viewHref+'">Open record →</a></div></article>';
  }
  const page=document.body.dataset.view || document.querySelector("[data-view]")?.dataset.view;
  if(["crops","livestock","activities"].includes(page)){
    const search=document.getElementById("recordSearch"),filter=document.getElementById("recordFilter"),sort=document.getElementById("recordSort"),host=document.getElementById("recordsView"),summary=document.getElementById("recordsSummary");
    let all=pageRows(page), currentPage=1, exportRows=all;
    const pageSize=20,pager=document.getElementById("recordsPagination");
    function render(){
      const q=(search?.value||"").trim().toLowerCase(), f=filter?.value||"all";
      let rows=all.filter(r=>(!q||[r.viewTitle,r.viewDetail,r.viewType,r.viewDate,r.viewStatus].join(" ").toLowerCase().includes(q))&&(f==="all"||(f==="overdue"&&r.viewOverdue)||(f==="open"&&r.viewStatus!=="Completed"&&r.viewStatus!=="Skipped")||(f==="completed"&&r.viewStatus==="Completed")));
      rows.sort((a,b)=>sort?.value==="oldest"?String(a.viewDate).localeCompare(String(b.viewDate)):String(b.viewDate).localeCompare(String(a.viewDate)));
      const pageCount=Math.max(1,Math.ceil(rows.length/pageSize));currentPage=Math.min(currentPage,pageCount);exportRows=rows;
      const shown=rows.slice((currentPage-1)*pageSize,currentPage*pageSize);
      if(summary)summary.textContent=rows.length+" matching · "+all.length+" total";
      if(host)host.innerHTML=rows.length?shown.map(r=>rowMarkup(r,page)).join(""):'<div class="view-empty"><span aria-hidden="true">'+(page==="crops"?"🌾":page==="livestock"?"🐄":"📅")+'</span><h2>No matching records</h2><p>'+ (all.length?"Try another search or filter.":"Add records in Workspace or Farm Center to see them here.")+'</p><a class="view-primary" href="'+(page==="activities"?"advanced.html#taskForm":page==="livestock"?"farm.html#livestock":"farm.html#crops")+'">Open farm workspace →</a></div>';
      if(pager)pager.innerHTML=rows.length>pageSize?'<button type="button" data-page-step="-1" '+(currentPage===1?'disabled':'')+' aria-label="Previous page">← Previous</button><span>Page '+currentPage+' of '+pageCount+'</span><button type="button" data-page-step="1" '+(currentPage===pageCount?'disabled':'')+' aria-label="Next page">Next →</button>':'';
    }
    [search,filter,sort].filter(Boolean).forEach(el=>el.addEventListener(el===search?"input":"change",()=>{currentPage=1;render();}));
    pager?.addEventListener("click",event=>{const button=event.target.closest("[data-page-step]");if(button&&!button.disabled){currentPage+=Number(button.dataset.pageStep);render();}});
    document.getElementById("exportView")?.addEventListener("click",()=>download(page+"-records",exportRows,[{key:"viewTitle",label:"Name"},{key:"viewType",label:"Workspace"},{key:"viewDate",label:"Date"},{key:"viewDetail",label:"Details"},{key:"viewStatus",label:"Status"}]));
    render();
  }
  if(page==="analytics"){
    const range=document.getElementById("analyticsRange"),host=document.getElementById("analyticsView"),summary=document.getElementById("analyticsSummary");
    const moneyRows=[...arr(records,"finance"),...arr(center,"money")].map(r=>({...r,amount:r.amount==null||String(r.amount).trim()===""?null:Number(r.amount)})).filter(r=>r.date&&Number.isFinite(r.amount));
    const harvestRows=[...arr(records,"harvest"),...arr(center,"harvest")];
    const currency=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
    function render(){
      const isAll=range?.value==="all", months=isAll?12:Number(range?.value||12), start=new Date();start.setDate(1);start.setMonth(start.getMonth()-months+1);
      const monthKey=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
      const recordedDates=[...moneyRows.map(r=>r.date),...harvestRows.map(r=>r.date||r.harvest)].filter(Boolean).sort();
      const from=isAll?(recordedDates[0]?.slice(0,7)||monthKey(start)):monthKey(start), chosen=moneyRows.filter(r=>r.date.slice(0,7)>=from);
      const earliest=new Date((from||monthKey(start))+"-01T00:00:00"), monthSpan=Math.max(1,(new Date().getFullYear()-earliest.getFullYear())*12+new Date().getMonth()-earliest.getMonth()+1);
      const monthsShown=isAll?Math.min(36,monthSpan):months;
      const incomeRows=chosen.filter(r=>r.type==="Income"),expenseRows=chosen.filter(r=>r.type==="Expense"),
        income=incomeRows.reduce((s,r)=>s+r.amount,0),expenses=expenseRows.reduce((s,r)=>s+r.amount,0);
      const groups=new Map();
      chosen.forEach(r=>{const k=r.date.slice(0,7);if(!groups.has(k))groups.set(k,{income:0,expenses:0,incomeCount:0,expenseCount:0});
        const bucket=groups.get(k),incomeType=r.type==="Income";bucket[incomeType?"income":"expenses"]+=r.amount;bucket[incomeType?"incomeCount":"expenseCount"]++;});
      const timeline=Array.from({length:Math.min(monthsShown,36)},(_,i)=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-(Math.min(monthsShown,36)-1-i));const k=monthKey(d);return{key:k,label:d.toLocaleDateString(undefined,{month:"short"}),...(groups.get(k)||{income:0,expenses:0,incomeCount:0,expenseCount:0})};});
      const max=Math.max(1,...timeline.flatMap(x=>[x.income,x.expenses]));
      const fields=arr(center,"fields"), areas=fields.map(r=>r.area==null||String(r.area).trim()===""?null:Number(r.area)).filter(Number.isFinite), area=areas.reduce((s,n)=>s+n,0);
      const avgYield=harvestRows.map(r=>r.yield==null||String(r.yield).trim()===""?null:Number(r.yield)).filter(Number.isFinite);
      const textKey=value=>String(value||"").trim().toLocaleLowerCase();
      const number=value=>value==null||String(value).trim()===""||!Number.isFinite(Number(value))?null:Number(value);
      const selectedHarvest=harvestRows.filter(r=>{const d=r.date||r.harvest||"";return d&&d.slice(0,7)>=from;});
      const areaByField=new Map();
      arr(center,"fields").forEach(r=>{const acres=number(r.area);if(acres!==null){[r.number,r.field,r.name].filter(Boolean).forEach(key=>areaByField.set(textKey(key),acres));}});
      const cropsByField=new Map();
      arr(records,"crops").forEach(r=>{const acres=number(r.area);if(acres!==null&&r.field)cropsByField.set(textKey(r.field),acres);});
      const cropNames=new Set([
        ...arr(records,"crops").map(r=>r.crop),...arr(center,"cropPlans").map(r=>r.crop),
        ...selectedHarvest.map(r=>r.crop),...chosen.filter(r=>r.type==="Expense").map(r=>r.crop)
      ].filter(name=>String(name||"").trim()));
      const economics=[...cropNames].sort((a,b)=>String(a).localeCompare(String(b))).map(crop=>{
        const key=textKey(crop), harvest=selectedHarvest.filter(r=>textKey(r.crop)===key);
        const qty=harvest.map(r=>number(r.quantity)).filter(n=>n!==null);
        const priced=harvest.filter(r=>number(r.quantity)!==null&&number(r.price)!==null);
        const value=priced.reduce((s,r)=>s+number(r.quantity)*number(r.price),0);
        const expensesForCrop=chosen.filter(r=>r.type==="Expense"&&textKey(r.crop)===key);
        const cost=expensesForCrop.reduce((s,r)=>s+r.amount,0);
        const costEntered=expensesForCrop.length>0, revenueEntered=priced.length>0;
        const yields=harvest.map(r=>{
          const manual=number(r.yield);if(manual!==null)return manual;
          const field=textKey(r.field),acres=areaByField.get(field)??cropsByField.get(field);
          const amount=number(r.quantity);return acres>0&&amount!==null?amount/acres:null;
        }).filter(n=>n!==null);
        const returns=revenueEntered||costEntered?currency((revenueEntered?value:0)-(costEntered?cost:0)):"Not entered";
        return '<tr><td>'+esc(crop)+'</td><td>'+ (qty.length?qty.reduce((s,n)=>s+n,0).toLocaleString()+" kg":"Not entered")+'</td><td>'+ (yields.length?(yields.reduce((s,n)=>s+n,0)/yields.length).toFixed(1)+" kg/acre":"Not entered")+'</td><td>'+ (revenueEntered?currency(value):"Not entered")+'</td><td>'+ (costEntered?currency(cost):"Not entered")+'</td><td>'+returns+'</td></tr>';
      }).join("");
      const economicsCard='<section class="economics-card"><div class="chart-heading"><div><small>CROP ECONOMICS</small><h2>Recorded costs and harvest value</h2></div></div><p>Harvest value uses entered quantity × sale price. Tag an expense with a crop name to include it in that crop’s costs. These are record-based estimates, not a market-price forecast.</p>'+(economics?'<div class="table-wrap"><table><thead><tr><th>Crop</th><th>Harvest</th><th>Yield</th><th>Harvest value</th><th>Tagged costs</th><th>Recorded return</th></tr></thead><tbody>'+economics+'</tbody></table></div>':'<div class="view-empty compact"><span>🌾</span><h2>No crop economics yet</h2><p>Add harvest quantity and price, and tag crop expenses in Workspace or Farm Center.</p></div>')+'</section>';
      const kpis='<div class="analytics-kpis"><article><span>💰 Income</span><strong>'+ (incomeRows.length?currency(income):"Not entered")+'</strong><small>From entered transactions</small></article><article><span>🧾 Expenses</span><strong>'+ (expenseRows.length?currency(expenses):"Not entered")+'</strong><small>From entered transactions</small></article><article><span>📊 Net recorded</span><strong>'+ (incomeRows.length&&expenseRows.length?currency(income-expenses):"Insufficient data")+'</strong><small>Income less expenses</small></article><article><span>🌾 Harvest</span><strong>'+ (harvestRows.length?harvestRows.reduce((s,r)=>s+(Number(r.quantity)||0),0).toLocaleString()+" kg":"Insufficient data")+'</strong><small>Recorded quantity</small></article></div>';
      const chart='<section class="chart-card"><div class="chart-heading"><div><small>FINANCIAL ACTIVITY</small><h2>Income and expenses</h2></div><span>'+esc(range?.selectedOptions?.[0]?.textContent||"Last 12 months")+'</span></div>'+(chosen.length?'<div class="bar-chart" role="img" aria-label="Monthly income and expenses; detailed values follow in the table">'+timeline.map(m=>'<div class="bar-month"><div class="bar-pair"><span class="bar-income" style="height:'+Math.max(m.income?5:0,m.income/max*100)+'%" title="Income '+currency(m.income)+'"></span><span class="bar-expense" style="height:'+Math.max(m.expenses?5:0,m.expenses/max*100)+'%" title="Expenses '+currency(m.expenses)+'"></span></div><small>'+esc(m.label)+'</small></div>').join("")+'</div><div class="chart-legend"><span><i class="legend-income"></i>Income</span><span><i class="legend-expense"></i>Expenses</span></div><div class="table-wrap"><table><thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Net</th></tr></thead><tbody>'+timeline.map(m=>'<tr><td>'+esc(m.key)+'</td><td>'+(m.incomeCount?currency(m.income):'—')+'</td><td>'+(m.expenseCount?currency(m.expenses):'—')+'</td><td>'+(m.incomeCount||m.expenseCount?currency(m.income-m.expenses):'—')+'</td></tr>').join("")+'</tbody></table></div>':'<div class="view-empty compact"><span>📈</span><h2>Not enough finance data yet</h2><p>Enter dated income and expenses in Workspace or Farm Center to build a monthly comparison.</p></div>')+'</section>';
      const yieldCard=avgYield.length?'<article class="analytics-note"><small>HARVEST RECORDS</small><h2>'+avgYield.length+' yield entries</h2><p>Average entered yield: '+(avgYield.reduce((a,b)=>a+b,0)/avgYield.length).toFixed(1)+' kg per acre.</p></article>':'<article class="analytics-note"><small>FARM AREA</small><h2>'+(areas.length?area.toFixed(2)+" acres":"Not entered")+'</h2><p>Area totals use saved Farm Center fields.</p></article>';
      if(summary)summary.textContent=chosen.length+" dated transactions · "+timeline.length+" months shown"+(isAll&&monthSpan>36?" · totals cover all recorded dates":"");
      if(host)host.innerHTML=kpis+chart+yieldCard+economicsCard;
    }
    range?.addEventListener("change",render);
    document.getElementById("exportView")?.addEventListener("click",()=>download("greenfarm-finances",moneyRows,[{key:"date",label:"Date"},{key:"type",label:"Type"},{key:"category",label:"Category"},{key:"crop",label:"Crop"},{key:"amount",label:"Amount"},{key:"description",label:"Description"}]));
    render();
  }
  if(page==="reports"){
    const from=document.getElementById("reportFrom"),to=document.getElementById("reportTo"),host=document.getElementById("reportView"),summary=document.getElementById("reportSummary");
    let currentRows=[];
    const groups=[
      ["Crops",[...arr(records,"crops"),...arr(center,"cropPlans")],"crop"],
      ["Livestock",arr(records,"livestock"),"group"],
      ["Weather",arr(records,"weather"),"condition"],
      ["Soil",arr(records,"soil"),"field"],
      ["Irrigation",[...arr(records,"irrigation"),...arr(center,"irrigation")],"field"],
      ["Scouting",[...arr(records,"ipm"),...arr(center,"pests")],"issue"],
      ["Harvest",[...arr(records,"harvest"),...arr(center,"harvest")],"crop"],
      ["Finance",[...arr(records,"finance"),...arr(center,"money")],"category"],
      ["Inventory",[...arr(records,"inventory"),...arr(center,"seeds"),...arr(center,"equipment")],"item"],
      ["Tasks",arr(center,"tasks"),"task"],
      ["Diary",arr(center,"diary"),"title"]
    ];
    function render(){
      const filtered=groups.map(([name,rows,key])=>[name,rows.filter(r=>{const d=r.date||r.sowing||r.due||r.next||r.followup||r.purchase||"";return(!from?.value||d>=from.value)&&(!to?.value||d<=to.value);}),key]);
      currentRows=filtered.flatMap(([module,rows])=>rows.map(row=>({module,...row})));
      if(from?.value&&to?.value&&from.value>to.value){if(summary)summary.textContent="Choose a start date on or before the end date.";if(host)host.innerHTML="<div class=\"view-empty\"><h2>Check the selected dates</h2><p>The start date must come before the end date.</p></div>";return;}
      const count=filtered.reduce((s,[,rows])=>s+rows.length,0);
      if(summary)summary.textContent=count+" records in selected period";
      if(host)host.innerHTML='<div class="report-print-header"><div><small>GREENFARM · TNAU AC&RI VAZHAVACHANUR</small><h2>Farm summary</h2><p>Generated '+new Date().toLocaleDateString()+'</p></div><strong>'+count+' records</strong></div><div class="report-summary-grid">'+filtered.filter(([,rows])=>rows.length).map(([name,rows])=>'<article><span>'+esc(name)+'</span><strong>'+rows.length+'</strong></article>').join("")+'</div>'+filtered.map(([name,rows,key])=>'<section class="report-group"><h2>'+esc(name)+' <small>'+rows.length+'</small></h2>'+(rows.length?'<div class="table-wrap"><table><thead><tr><th>Date</th><th>Record</th><th>Details</th><th>Workspace</th></tr></thead><tbody>'+rows.map(r=>{const date=r.date||r.sowing||r.due||r.next||r.followup||r.purchase||"Not entered";const main=r[key]||r.group||r.item||r.task||r.title||r.name||"Record";const detail=[r.field,r.stage,r.health,r.category,r.type,r.amount?("₹"+r.amount):"",r.status].filter(Boolean).join(" · ");return'<tr><td>'+esc(date)+'</td><td>'+esc(main)+'</td><td>'+esc(detail||"—")+'</td><td>'+esc(center&&rows.includes(r)?"Farm records":"Farm records")+'</td></tr>';}).join("")+'</tbody></table></div>':'<p class="report-no-data">No records in this period.</p>')+'</section>').join("");
    }
    from?.addEventListener("change",render);to?.addEventListener("change",render);
    document.getElementById("printReport")?.addEventListener("click",()=>window.print());
    document.getElementById("exportView")?.addEventListener("click",()=>{const cols=[...new Set(currentRows.flatMap(Object.keys))].map(key=>({key,label:key}));download("greenfarm-all-records",currentRows,cols);});
    render();
  }
  window.addEventListener("storage",event=>{if(!event.key||event.key==="greenfarm.v2"||event.key==="greenfarm.advanced.v1")location.reload();});
})();
