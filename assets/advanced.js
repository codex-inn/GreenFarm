(() => {
  "use strict";
  const KEY="greenfarm.advanced.v1";
  const today=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
  const empty=()=>({fields:[],cropPlans:[],irrigation:[],fertilizer:[],pests:[],money:[],harvest:[],seeds:[],equipment:[],tasks:[],diary:[],profile:{}});
  const arrays=["fields","cropPlans","irrigation","fertilizer","pests","money","harvest","seeds","equipment","tasks","diary"];
  let d;
  try { d=JSON.parse(localStorage.getItem(KEY)||"null"); } catch (_) { d=null; }
  if(!d||typeof d!=="object"||Array.isArray(d)) d=empty();
  arrays.forEach(key=>{if(!Array.isArray(d[key]))d[key]=[];});
  if(!d.profile||typeof d.profile!=="object"||Array.isArray(d.profile))d.profile={};
  d.tasks.forEach(task=>{if(!task.status)task.status="Pending";});
  const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const id=()=>globalThis.crypto?.randomUUID?.()||Date.now()+"-"+Math.random();
  const filters=Object.create(null);
  const maps={
    fieldsList:["fields","fieldForm"],cropsList:["cropPlans","cropForm"],irrList:["irrigation","irrForm"],
    fertList:["fertilizer","fertForm"],pestList:["pests","pestForm"],moneyList:["money","moneyForm"],
    seedList:["seeds","seedForm"],equipmentList:["equipment","equipmentForm"],taskList:["tasks","taskForm"],diaryList:["diary","diaryForm"]
  };
  const notify=message=>{
    const el=document.getElementById("toast");
    if(el){el.textContent=message;el.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(()=>el.classList.remove("show"),2600);}
  };
  const save=()=>{
    try{localStorage.setItem(KEY,JSON.stringify(d));window.dispatchEvent(new CustomEvent("greenfarm:datachange",{detail:{key:KEY}}));return true;}
    catch(_){try{d=JSON.parse(localStorage.getItem(KEY)||"null")||empty();arrays.forEach(key=>{if(!Array.isArray(d[key]))d[key]=[];});}catch(__){d=empty();}notify("Could not save. Previous saved records were kept.");return false;}
  };
  const money=value=>value==null||String(value).trim()===""||!Number.isFinite(Number(value))?null:Number(value);
  const currency=value=>value==null||String(value).trim()===""||!Number.isFinite(Number(value))?"Not entered":new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(value));
  function prepareLabels(){
    document.querySelectorAll(".advanced-page form .form-grid > input, .advanced-page form .form-grid > select, .advanced-page form .form-grid > textarea").forEach(control=>{
      if(control.parentElement?.tagName==="LABEL")return;
      const labelText=control.getAttribute("aria-label")||control.placeholder||String(control.name||control.id||"Field").replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase());
      const label=document.createElement("label");
      label.className="advanced-field-label";
      label.append(document.createTextNode(labelText));
      control.parentNode.insertBefore(label,control);label.append(control);
      control.setAttribute("aria-label",labelText);
      if(control.matches('input[type="number"]')&&!control.hasAttribute("min"))control.min="0";
    });
    document.querySelectorAll(".advanced-page form").forEach(form=>{
      if(!form.querySelector('input[name="id"]')){const hidden=document.createElement("input");hidden.type="hidden";hidden.name="id";form.prepend(hidden);}
    });
  }
  const formErrors=new WeakMap();
  function validateForm(form){
    if(!form.reportValidity())return false;
    const values=Object.fromEntries(new FormData(form).entries());
    const start=values.sowing||values.date||"", end=values.harvest||values.expiry||"";
    if(start&&end&&end<start){notify("Check the dates: the end date must follow the start date.");return false;}
    return true;
  }
  function list(element,rows,formatter,key,formId){
    const host=document.getElementById(element);if(!host)return;
    const q=String(filters[element]||"").trim().toLowerCase();
    const shown=rows.filter(row=>!q||Object.values(row).join(" ").toLowerCase().includes(q))
      .slice().sort((a,b)=>String(b.date||b.due||b.next||b.sowing||b.purchase||"").localeCompare(String(a.date||a.due||a.next||a.sowing||a.purchase||"")));
    host.innerHTML='<label class="advanced-list-search">Search saved entries<input type="search" data-list-filter="'+element+'" value="'+esc(q)+'" placeholder="Search..." autocomplete="off"></label>'+
      (shown.length?shown.map(row=>{
        const dueClass=key==="tasks"&&row.status!=="Completed"&&row.due<today?" is-overdue":"";
        const taskAction=key==="tasks"?'<button type="button" class="mini-action" data-done="'+esc(row.id)+'" aria-label="'+(row.status==="Completed"?"Reopen task":"Mark task complete")+'">'+(row.status==="Completed"?"Reopen":"Complete")+'</button>':"";
        return '<article class="mini-row'+dueClass+'"><div class="mini-row-copy">'+formatter(row)+(key==="tasks"?'<span class="task-state">'+esc(row.status||"Pending")+(row.due<today&&row.status!=="Completed"?" · overdue":"")+'</span>':"")+'</div><div class="mini-actions"><button type="button" class="mini-action" data-advanced-edit="'+esc(row.id)+'" data-key="'+key+'" data-form="'+formId+'">Edit</button>'+taskAction+'<button type="button" class="mini-action danger-action" data-del="'+esc(row.id)+'" data-key="'+key+'">Delete</button></div></article>';
      }).join(""):'<div class="mini-empty">'+(rows.length?"No entries match this search.":"No records yet.")+'</div>');
    host.querySelector("[data-list-filter]").addEventListener("input",event=>{
      filters[element]=event.target.value;
      host.querySelectorAll(".mini-row").forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(filters[element].toLowerCase());});
    });
  }
  const formatters={
    fields:x=>"<b>Field "+esc(x.number)+"</b> · "+esc(x.area||"Area not entered")+" acre · "+esc(x.crop||"No crop")+ " · "+esc(x.soil||"Soil not set"),
    cropPlans:x=>"<b>"+esc(x.crop)+"</b> · "+esc(x.field)+" · "+esc(x.stage)+" · <b>"+esc(x.health)+"</b> · harvest "+esc(x.harvest||"—"),
    irrigation:x=>"<b>"+esc(x.field)+"</b> · next "+esc(x.next||"Date not entered")+" · "+esc(x.water||"—")+" mm",
    fertilizer:x=>"<b>"+esc(x.product)+"</b> · "+esc(x.quantity||"Quantity not entered")+" · "+currency(money(x.cost)),
    pests:x=>"<b>"+esc(x.crop)+"</b> · "+esc(x.problem)+" · "+esc(x.severity),
    money:x=>"<b>"+esc(x.type)+"</b> · "+esc(x.category||"General")+" · "+currency(money(x.amount))+(x.crop?" · "+esc(x.crop):""),
    seeds:x=>"<b>"+esc(x.variety)+"</b> · "+esc(x.quantity||"Quantity not entered")+" · expiry "+esc(x.expiry||"—"),
    equipment:x=>"<b>"+esc(x.name)+"</b> · "+esc(x.condition||"Condition not entered")+" · service "+esc(x.next||"—"),
    tasks:x=>"<b>"+esc(x.task)+"</b> · "+esc(x.field||"Farm task")+" · due "+esc(x.due||"Date not entered")+" · "+esc(x.priority||"Normal"),
    diary:x=>"<b>"+esc(x.date||"Date not entered")+" · "+esc(x.title)+"</b><br>"+esc(x.notes)
  };
  function render(){
    const incomeRows=d.money.filter(x=>x.type==="Income"&&money(x.amount)!==null),income=incomeRows.reduce((s,x)=>s+money(x.amount),0);
    const expenseRows=d.money.filter(x=>x.type==="Expense"&&money(x.amount)!==null),expenses=expenseRows.reduce((s,x)=>s+money(x.amount),0);
    const areaValues=d.fields.map(x=>money(x.area)).filter(value=>value!==null),area=areaValues.reduce((s,value)=>s+value,0);
    const metrics=document.getElementById("metrics");
    if(metrics)metrics.innerHTML=[[""+d.fields.length,"Fields"],[""+d.cropPlans.length,"Crop plans"],[areaValues.length?area.toFixed(2):"Not entered","Total acres"],[incomeRows.length?currency(income):"Not entered","Income"],[expenseRows.length?currency(expenses):"Not entered","Expenses"],[incomeRows.length||expenseRows.length?currency(income-expenses):"Not entered","Net recorded"]].map(x=>'<article class="metric"><b>'+esc(x[0])+'</b><small>'+esc(x[1])+'</small></article>').join("");
    Object.entries(maps).forEach(([element,[key,form]])=>list(element,d[key],formatters[key],key,form));
    const report=document.getElementById("advancedReport");
    if(report)report.innerHTML='<div class="report-box"><table><thead><tr><th>Indicator</th><th>Value</th></tr></thead><tbody><tr><td>Fields</td><td>'+d.fields.length+'</td></tr><tr><td>Crop plans</td><td>'+d.cropPlans.length+'</td></tr><tr><td>Total farm area</td><td>'+(areaValues.length?area.toFixed(2)+" acres":"Not entered")+'</td></tr><tr><td>Harvest records</td><td>'+d.harvest.length+'</td></tr><tr><td>Income</td><td>'+(incomeRows.length?currency(income):"Not entered")+'</td></tr><tr><td>Expenses</td><td>'+(expenseRows.length?currency(expenses):"Not entered")+'</td></tr><tr><td>Net recorded</td><td>'+((incomeRows.length||expenseRows.length)?currency(income-expenses):"Not entered")+'</td></tr><tr><td>Open tasks</td><td>'+d.tasks.filter(x=>x.status!=="Completed").length+'</td></tr><tr><td>Diary entries</td><td>'+d.diary.length+'</td></tr></tbody></table></div>';
    const profile=document.getElementById("profileForm");
    if(profile)Object.entries(d.profile).forEach(([name,value])=>{if(profile.elements[name])profile.elements[name].value=value;});
  }
  function bind(formId,key){
    const form=document.getElementById(formId);if(!form)return;
    form.addEventListener("submit",event=>{
      event.preventDefault();if(!validateForm(form))return;
      const values=Object.fromEntries(new FormData(form).entries()), recordId=values.id;delete values.id;
      const now=new Date().toISOString();
      if(recordId){const index=d[key].findIndex(row=>row.id===recordId);if(index>=0)d[key][index]={...d[key][index],...values,updatedAt:now};}
      else d[key].push({...values,id:id(),createdAt:now});
      if(save()){form.reset();render();notify(recordId?"Record updated":"Saved successfully");}
    });
  }
  const bindings={fieldForm:"fields",cropForm:"cropPlans",irrForm:"irrigation",fertForm:"fertilizer",pestForm:"pests",moneyForm:"money",harvestForm:"harvest",seedForm:"seeds",equipmentForm:"equipment",taskForm:"tasks",diaryForm:"diary"};
  prepareLabels();
  Object.entries(bindings).forEach(([form,key])=>bind(form,key));
  const profile=document.getElementById("profileForm");
  profile?.addEventListener("submit",event=>{
    event.preventDefault();if(!validateForm(profile))return;
    d.profile=Object.fromEntries(new FormData(profile).entries());delete d.profile.id;
    if(save())notify("Farm profile saved");
  });
  document.addEventListener("click",event=>{
    const edit=event.target.closest("[data-advanced-edit]");
    if(edit){
      const rows=d[edit.dataset.key],row=rows.find(item=>item.id===edit.dataset.advancedEdit),form=document.getElementById(edit.dataset.form);
      if(row&&form){form.reset();Object.entries(row).forEach(([key,value])=>{if(form.elements[key])form.elements[key].value=value;});form.elements.id.value=row.id;form.scrollIntoView({behavior:"smooth",block:"center"});notify("Editing saved record");}
    }
    const done=event.target.closest("[data-done]");
    if(done){const row=d.tasks.find(item=>item.id===done.dataset.done);if(row){row.status=row.status==="Completed"?"Pending":"Completed";if(save()){render();notify(row.status==="Completed"?"Task marked complete":"Task reopened");}}}
    const remove=event.target.closest("[data-del]");
    if(remove&&confirm("Delete this saved record? This cannot be undone unless you restore a backup.")){const key=remove.dataset.key;d[key]=d[key].filter(row=>row.id!==remove.dataset.del);if(save()){render();notify("Record deleted");}}
  });
  document.getElementById("clearBtn")?.addEventListener("click",()=>{if(confirm("Clear all Farm Center data saved in this browser? Export a backup first if you may need these records.")){const previous=d;d=empty();if(save()){render();notify("Farm Center data cleared");}else d=previous;}});
  document.getElementById("demoBtn")?.addEventListener("click",()=>{
    if(!confirm("Replace Farm Center data with illustrative demo records? Export a backup first if you may need your current data."))return;
    d={fields:[{id:id(),number:"F-01",area:"2.5",soil:"Clay loam",irrigation:"Drip",crop:"Rice"}],cropPlans:[{id:id(),crop:"Rice",field:"F-01",variety:"CO 51",sowing:today,harvest:"",stage:"Vegetative",health:"Healthy",next:today}],irrigation:[{id:id(),field:"F-01",crop:"Rice",method:"Drip",last:today,next:today,water:"25"}],fertilizer:[{id:id(),product:"Urea",field:"F-01",quantity:"25 kg",date:today,cost:"800"}],pests:[{id:id(),crop:"Rice",field:"F-01",problem:"Stem borer scouting",symptoms:"No visible damage",severity:"Low",treatment:"Monitor",date:today}],money:[{id:id(),type:"Expense",category:"Fertilizer",amount:"800",crop:"Rice",date:today},{id:id(),type:"Income",category:"Previous harvest",amount:"12000",crop:"Rice",date:today}],harvest:[{id:id(),crop:"Rice",quantity:"900",yield:"360",price:"28",date:today}],seeds:[{id:id(),variety:"CO 51",crop:"Rice",quantity:"10 kg",purchase:today,expiry:"",notes:"Certified seed"}],equipment:[{id:id(),name:"Power sprayer",type:"Sprayer",condition:"Good",service:today,next:"",notes:""}],tasks:[{id:id(),task:"Irrigate F-01",field:"Rice",due:today,priority:"High",status:"Pending"}],diary:[{id:id(),date:today,title:"Illustrative field observation",notes:"Crop is healthy; continue routine scouting and irrigation."}],profile:{name:"Demo Farmer",village:"Vazhavachanur",farmArea:"2.5",mainCrops:"Rice"}};
    if(save()){render();notify("Illustrative demo records loaded");}
  });
  function csv(value){const text=String(value??"");return '"'+((text[0]==="="||text[0]==="+"||text[0]==="-"||text[0]==="@"||text.charCodeAt(0)===9||text.charCodeAt(0)===13)?"'":"")+text.replace(/"/g,'""')+'"';}
  document.getElementById("csvBtn")?.addEventListener("click",()=>{
    const rows=arrays.flatMap(module=>d[module].map(row=>({module,...row})));
    if(!rows.length){notify("No records available to export.");return;}
    const columns=[...new Set(rows.flatMap(row=>Object.keys(row)))];
    const text=[columns.map(csv).join(","),...rows.map(row=>columns.map(key=>csv(row[key])).join(","))].join("\r\n");
    const url=URL.createObjectURL(new Blob(["\uFEFF"+text],{type:"text/csv;charset=utf-8"}));
    const link=document.createElement("a");link.href=url;link.download="greenfarm-farm-center-"+today+".csv";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  render();
})();