
(() => {
  'use strict';
  const KEY = 'greenfarm.v2';
  const fields = {
    crops: { label:'Crop records', icon:'🌾', fields:[['date','Start / record date','date',true],['crop','Crop name','text',true],['field','Field / location','text',true],['variety','Variety','text'],['stage','Growth stage','text'],['area','Area (acre)','number'],['photo','Crop photo (optional)','file'],['notes','Notes','text']] },
    livestock: { label:'Livestock records', icon:'🐄', fields:[['date','Record date','date',true],['group','Animal / group','text',true],['count','Count','number',true],['purpose','Purpose / type','text'],['health','Health observation','text'],['feed','Feed / care note','text'],['notes','Notes','text']] },
    weather: { label:'Weather observations', icon:'🌦️', fields:[['date','Date','date',true],['field','Field / location','text',true],['condition','Conditions','select',true,['Sunny','Cloudy','Rain','Windy','Storm']],['temperature','Temperature (°C)','number'],['rainfall','Rainfall (mm)','number'],['humidity','Humidity (%)','number'],['notes','Notes','text']] },
    soil: { label:'Soil records', icon:'🪴', fields:[['date','Sample date','date',true],['field','Field','text',true],['type','Soil type','text'],['ph','pH','number'],['nitrogen','Nitrogen (kg/ha)','number'],['phosphorus','Phosphorus (kg/ha)','number'],['potassium','Potassium (kg/ha)','number'],['notes','Notes / next action','text']] },
    irrigation: { label:'Irrigation records', icon:'💧', fields:[['date','Date','date',true],['field','Field','text',true],['method','Method','select',true,['Drip','Sprinkler','Furrow','Flood','Other']],['duration','Duration (minutes)','number'],['water','Water applied (mm)','number'],['status','Status','select',true,['Planned','Completed','Skipped']],['notes','Notes','text']] },
    ipm: { label:'Scouting records', icon:'🐛', fields:[['date','Scouting date','date',true],['field','Field / crop','text',true],['issue','Pest or disease','text',true],['severity','Severity','select',true,['Low','Moderate','High']],['action','IPM action','text'],['followup','Follow-up date','date'],['photo','Scouting photo (optional)','file'],['notes','Notes','text']] },
    harvest: { label:'Harvest records', icon:'🌾', fields:[['date','Harvest date','date',true],['crop','Crop','text',true],['field','Field','text'],['quantity','Quantity (kg)','number',true],['grade','Grade / quality','text'],['price','Sale price per kg (₹)','number'],['buyer','Buyer','text'],['notes','Notes','text']] },
    finance: { label:'Finance entries', icon:'💰', fields:[['date','Date','date',true],['type','Type','select',true,['Income','Expense']],['category','Category','text',true],['crop','Crop (optional)','text'],['amount','Amount (₹)','number',true],['description','Description','text'],['reference','Reference / related field','text']] },
    inventory: { label:'Inventory items', icon:'📦', fields:[['item','Item name','text',true],['category','Category','select',true,['Seed','Fertilizer','Crop protection','Fuel','Equipment','Feed','Other']],['quantity','On hand','number',true],['unit','Unit','text',true],['reorder','Reorder at','number'],['updated','Last updated','date'],['notes','Notes / supplier','text']] }
  };
  const emptyData = () => ({records:{crops:[],livestock:[],weather:[],soil:[],irrigation:[],ipm:[],harvest:[],finance:[],inventory:[]},profile:{},prediction:{}});
  let data;
  try { data = JSON.parse(localStorage.getItem(KEY) || 'null') || emptyData(); } catch { data = emptyData(); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) data = emptyData();
  if (!data.records || typeof data.records !== 'object' || Array.isArray(data.records)) data.records = {};
  if (!data.profile || typeof data.profile !== 'object') data.profile = {}; if (!data.prediction || typeof data.prediction !== 'object') data.prediction = {};
  Object.keys(fields).forEach(k => { if (!Array.isArray(data.records[k])) data.records[k] = []; });
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,10);
  const moduleFilters = Object.create(null);
  const fieldControl = ([name,label,type,required,options], value='') => {
    const req = required ? ' required' : '';
    if (type === 'file') return `<label>${esc(label)}<input name="${name}" type="file" accept="image/*"${req}><small>Compressed and stored only in this browser.</small></label>`;
    if (type === 'select') return `<label>${esc(label)}<select name="${name}"${req}><option value="">Choose…</option>${options.map(o=>`<option${value===o?' selected':''}>${esc(o)}</option>`).join('')}</select></label>`;
    return `<label>${esc(label)}<input name="${name}" type="${type}"${type==='number'?' step="any" min="0"':''}${req} value="${esc(value || (type==='date'?today:''))}"></label>`;
  };
  async function compressPhoto(file){
    if(!file.type.startsWith("image/"))throw new Error("Choose an image file.");
    if(file.size>8*1024*1024)throw new Error("Choose an image under 8 MB.");
    if(typeof createImageBitmap!=="function")throw new Error("Photo compression is unavailable in this browser.");
    const bitmap=await createImageBitmap(file),scale=Math.min(1,1000/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    canvas.getContext("2d").drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",0.68));
    if(!blob)throw new Error("Could not compress this photo.");
    if(blob.size>300*1024)throw new Error("This image is still too large. Choose a smaller photo.");
    return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error("Could not read this photo."));reader.readAsDataURL(blob);});
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch { try { data = JSON.parse(localStorage.getItem(KEY) || 'null') || emptyData(); Object.keys(fields).forEach(k => { if (!Array.isArray(data.records?.[k])) data.records[k] = []; }); } catch { data = emptyData(); } notify('Could not save. Previous saved records were kept.'); return false; } }
  function notify(message) { const el=document.getElementById('toast'); if (!el) return; el.textContent=message; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2600); }
  function csvCell(value) { const text = String(value ?? ''); return '"' + ((text[0] === '=' || text[0] === '+' || text[0] === '-' || text[0] === '@' || text.charCodeAt(0) === 9 || text.charCodeAt(0) === 13) ? "'" : '') + text.replace(/"/g, '""') + '"'; }
  function exportModule(key) {
    const cfg = fields[key], rows = data.records[key];
    const csv = [cfg.fields.map(f => csvCell(f[2]==='file'?f[1]+' (attached) ':f[1])).join(','), ...rows.map(row => cfg.fields.map(f => csvCell(f[2]==='file'?(row[f[0]]?'Photo attached':''):row[f[0]])).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], {type:'text/csv;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'greenfarm-' + key + '-' + today + '.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function renderModule(key) {
    const cfg = fields[key], host = document.querySelector('[data-module="' + key + '"]');
    if (!cfg || !host) return;
    const rows = data.records[key];
    host.innerHTML = '<form class="data-form record-form" data-key="' + key + '"><input type="hidden" name="id"><div class="form-grid">' +
      cfg.fields.map(f => fieldControl(f)).join('') +
      '</div><div class="form-actions"><button class="button" type="submit">Save record</button><button class="button button-soft" type="reset">Clear form</button><span class="edit-hint" aria-live="polite"></span></div></form>' +
      '<div class="record-tools"><label>Search ' + esc(cfg.label.toLowerCase()) + '<input type="search" data-module-search="' + key + '" placeholder="Search saved records..." autocomplete="off"></label><button type="button" class="button button-soft" data-export-module="' + key + '">Download CSV</button></div>' +
      (key==="irrigation"?'<p class="irrigation-estimate-note">Water estimate uses recorded depth × matched field area × 4,046.86 L per acre-mm. It is an estimate of applied volume, not a crop water recommendation.</p>':'') + '<div class="table-wrap"><table><thead><tr>' + cfg.fields.slice(0,5).map(f => '<th>' + esc(f[1]) + '</th>').join('') + ((key==="crops"||key==="ipm")?'<th>Photo</th>':'') + (key==="irrigation"?'<th>Est. applied water</th>':'') + '<th>Actions</th></tr></thead><tbody data-module-rows="' + key + '"></tbody></table></div>';
    const body = host.querySelector('[data-module-rows="' + key + '"]');
    const paintRows = () => {
      const q = String(moduleFilters[key] || '').trim().toLowerCase();
      const shown = rows.filter(row => !q || cfg.fields.some(f => f[2]!=='file'&&String(row[f[0]] ?? '').toLowerCase().includes(q)) || (q.includes('photo')&&cfg.fields.some(f=>f[2]==='file'&&row[f[0]])))
        .slice().sort((a,b) => String(b.updatedAt || b.createdAt || b.date || b.updated || '').localeCompare(String(a.updatedAt || a.createdAt || a.date || a.updated || '')));
      body.innerHTML = shown.length ? shown.map(row => {
        const cells=cfg.fields.slice(0,5).map(f => {const value=row[f[0]];return '<td>'+esc(value==null||String(value).trim()===''?'—':value)+'</td>';}).join('');
        let photo='';
        if(key==="crops"||key==="ipm"){
          const safePhoto=typeof row.photo==="string"&&/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/i.test(row.photo)?row.photo:"";
          photo=safePhoto?'<td><a href="'+safePhoto+'" target="_blank" rel="noopener" aria-label="Open attached photo"><img class="record-photo" src="'+safePhoto+'" alt="Attached farm observation"></a></td>':'<td>—</td>';
        }
        let water='';
        if(key==="irrigation"){
          let center={};try{center=JSON.parse(localStorage.getItem("greenfarm.advanced.v1")||"{}");}catch(_){}
          const target=String(row.field||"").trim().toLowerCase();
          const centerFields=Array.isArray(center.fields)?center.fields:[];
          const match=centerFields.find(x=>[x.number,x.field,x.name].some(v=>String(v||"").trim().toLowerCase()===target));
          const coreMatch=data.records.crops.find(x=>String(x.field||"").trim().toLowerCase()===target);
          const rawArea=match?.area??coreMatch?.area,depth=row.water==null||String(row.water).trim()===""?null:Number(row.water),acres=rawArea==null||String(rawArea).trim()===""?null:Number(rawArea);
          water=depth!==null&&Number.isFinite(depth)&&acres!==null&&Number.isFinite(acres)?'<td>'+Math.round(depth*acres*4046.86).toLocaleString()+' L</td>':'<td>Enter depth + area</td>';
        }
        return '<tr>'+cells+photo+water+'<td class="row-actions"><button type="button" class="text-button" data-edit="'+esc(row.id)+'" data-key="'+key+'">Edit</button><button type="button" class="text-button danger-text" data-delete="'+esc(row.id)+'" data-key="'+key+'">Delete</button></td></tr>';
      }).join('') :
        '<tr><td class="empty-cell" colspan="' + (Math.min(cfg.fields.length,5)+((key==="crops"||key==="ipm")?1:0)+(key==="irrigation"?2:1)) + '">' + (rows.length ? 'No records match this search.' : 'No records yet. Add your first ' + esc(cfg.label.toLowerCase()) + ' above.') + '</td></tr>';
    };
    const search = host.querySelector('[data-module-search="' + key + '"]');
    search.value = moduleFilters[key] || '';
    search.addEventListener('input', () => { moduleFilters[key] = search.value; paintRows(); });
    host.querySelector('[data-export-module="' + key + '"]').addEventListener('click', () => exportModule(key));
    paintRows();
    const form = host.querySelector('form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form), obj = {};
      cfg.fields.forEach(f => { const value=fd.get(f[0]); obj[f[0]]=f[2]==="file"?"":(value||""); });
      const id = fd.get('id'), existing=id?rows.find(r=>r.id===id):null;
      try {
        const photoFile=form.elements.photo?.files?.[0];
        if(photoFile)obj.photo=await compressPhoto(photoFile);
        else if(existing?.photo)obj.photo=existing.photo;
      } catch(error) { notify(error.message||"Could not read this photo."); return; }
      if (id) {
        const i = rows.findIndex(r => r.id === id);
        if (i >= 0) rows[i] = {...rows[i], ...obj, updatedAt:new Date().toISOString()};
      } else rows.push({...obj, id:globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random(), createdAt:new Date().toISOString()});
      if (save()) { render(); notify(id ? 'Record updated' : 'Record saved'); }
    });
    form.addEventListener('reset', () => setTimeout(() => {
      form.querySelector('[name=id]').value = '';
      form.querySelector('.edit-hint').textContent = '';
    }, 0));
  }
  function renderPrediction(){const host=document.getElementById('predictionApp');if(!host)return;const last=data.prediction||{};const crops=['Rice','Maize','Wheat','Groundnut','Tomato','Chilli','Cotton','Sugarcane','Banana','Other'];host.innerHTML=`<form id="predictionForm" class="data-form prediction-form"><div class="form-grid"><label>Crop<select name="crop" required><option value="">Choose crop…</option>${crops.map(c=>`<option${last.crop===c?' selected':''}>${c}</option>`).join('')}</select></label><label>Crop age (days)<input name="age" type="number" min="0" value="${esc(last.age||'')}"></label><label>Soil pH<input name="ph" type="number" min="3" max="10" step="0.1" value="${esc(last.ph||'')}"></label><label>Nitrogen (kg/ha)<input name="n" type="number" min="0" step="any" value="${esc(last.n||'')}"></label><label>Phosphorus (kg/ha)<input name="p" type="number" min="0" step="any" value="${esc(last.p||'')}"></label><label>Potassium (kg/ha)<input name="k" type="number" min="0" step="any" value="${esc(last.k||'')}</label><label>Rainfall (mm)<input name="rain" type="number" min="0" step="any" value="${esc(last.rain||'')}</label><label>Temperature (°C)<input name="temp" type="number" min="0" max="60" step="0.1" value="${esc(last.temp||'')}</label><label>Humidity (%)<input name="humidity" type="number" min="0" max="100" step="1" value="${esc(last.humidity||'')}</label><label>Irrigation<select name="irrigation"><option value="" selected>Not entered</option><option value="Good"${last.irrigation==='Good'?' selected':''}>Good</option><option value="Moderate"${last.irrigation==='Moderate'?' selected':''}>Moderate</option><option value="Poor"${last.irrigation==='Poor'?' selected':''}>Poor</option></select></label><label>Pest severity<select name="pest"><option value="" selected>Not entered</option><option value="Low"${last.pest==='Low'?' selected':''}>Low</option><option value="Moderate"${last.pest==='Moderate'?' selected':''}>Moderate</option><option value="High"${last.pest==='High'?' selected':''}>High</option></select></label></div><div class="form-actions"><button class="button" type="submit">🔮 Generate outlook</button><span class="edit-hint">Uses only the values entered above.</span></div></form><div id="predictionResult"></div>`;host.querySelector('#predictionForm').addEventListener('submit',e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget).entries());const result=calculatePrediction(v);data.prediction={...v,...result,generatedAt:new Date().toISOString()};save();showPrediction(result,v);notify('Prediction updated');});if(last.score)showPrediction(last,last)}
  function calculatePrediction(v) {
    const reasons = [], actions = [];
    const num = key => v[key] == null || String(v[key]).trim() === '' ? null : Number(v[key]);
    const measured = ['age','ph','n','p','k','rain','temp','humidity'].filter(key => num(key) !== null && Number.isFinite(num(key))).length +
      ['irrigation','pest'].filter(key => Boolean(v[key])).length;
    if (measured < 2) return {score:null, outlook:'Insufficient field data', reasons:['Enter at least two field measurements or observations to calculate an outlook.'], actions:['Use crop-specific soil-test results and local field observations.']};
    let score = 50;
    const ph=num('ph'), n=num('n'), p=num('p'), k=num('k'), rain=num('rain'), temp=num('temp'), hum=num('humidity');
    if (ph !== null) { if (ph >= 5.8 && ph <= 7.2) {score+=8;reasons.push('Entered soil pH is within a broad favourable range.');} else {score-=10;actions.push('Review the soil test and crop-specific pH guidance.');} }
    if (n !== null) { if (n >= 40 && n <= 180) score+=5; else if (n < 40) {score-=6;actions.push('Review nitrogen availability with local agronomic guidance.');} }
    if (p !== null) { if (p >= 15 && p <= 80) score+=3; else if (p < 15) {score-=4;actions.push('Review phosphorus availability from the soil test.');} }
    if (k !== null) { if (k >= 40 && k <= 200) score+=3; else if (k < 40) {score-=4;actions.push('Review potassium availability from the soil test.');} }
    if (rain !== null) { if (rain >= 40 && rain <= 220) score+=5; else if (rain < 40) {score-=5;actions.push('Check field moisture before scheduling irrigation.');} else {score-=3;actions.push('Check drainage and crop response after heavy rainfall.');} }
    if (temp !== null) { if (temp >= 18 && temp <= 34) score+=5; else {score-=7;actions.push('Compare temperature with crop-specific thresholds.');} }
    if (hum !== null) { if (hum >= 45 && hum <= 80) score+=2; else if (hum > 85) {score-=5;actions.push('Increase scouting where humid conditions raise disease risk.');} }
    if (v.irrigation === 'Good') score+=5; else if (v.irrigation === 'Poor') {score-=8;actions.push('Review irrigation timing and field moisture.');}
    if (v.pest === 'Low') score+=3; else if (v.pest === 'Moderate') {score-=5;actions.push('Continue scouting and use integrated pest management thresholds.');} else if (v.pest === 'High') {score-=12;actions.push('Prioritize crop scouting and seek local agricultural advice.');}
    if (num('age') !== null && num('age') < 15) actions.push('Recheck the crop after its next growth stage.');
    score=Math.max(0,Math.min(100,Math.round(score)));
    const outlook=score>=80?'Favourable':score>=60?'Watch':score>=40?'Needs attention':'High risk';
    if (!reasons.length) reasons.push('Outlook is based on the measurements and observations entered.');
    if (!actions.length) actions.push('Continue routine scouting, soil and moisture monitoring.');
    return {score,outlook,reasons,actions,measurementCount:measured};
  }
  function showPrediction(r,v) {
    const out=document.getElementById('predictionResult'); if(!out)return;
    const hasScore=Number.isFinite(r.score), tone=!hasScore?'watch':r.score>=70?'positive':r.score>=45?'watch':'risk';
    out.innerHTML='<div class="prediction-result '+tone+'"><div class="prediction-score"><span>Rule-based field outlook</span>'+
      (hasScore?'<strong>'+esc(r.score)+'<small>/100</small></strong>':'<strong class="prediction-insufficient">—</strong>')+
      '<em>'+esc(r.outlook||'Insufficient field data')+'</em></div><div class="prediction-details"><div><small>Crop</small><b>'+esc(v.crop||'—')+'</b></div><div><small>Inputs used</small><b>'+esc(r.measurementCount||0)+' field observations</b></div><div><small>Generated</small><b>'+esc(new Date(data.prediction.generatedAt||Date.now()).toLocaleString())+'</b></div></div><div class="prediction-grid"><div><h3>What the entries suggest</h3><ul>'+(r.reasons||[]).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div><div><h3>Next steps</h3><ul>'+(r.actions||[]).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div></div><p class="prediction-note">Decision support only. This simple rule-based indicator is not a yield forecast or a substitute for crop-specific agronomic advice, soil testing or local weather information.</p></div>';
  }
  function renderProfile(){const form=document.getElementById('profileForm'); if(!form)return;const cfg=[['farmName','Farm name','text'],['farmer','Farmer name','text'],['phone','Phone','tel'],['email','Email','email'],['location','Village / district','text'],['area','Farm area (acres)','number'],['cropFocus','Main crops','text']];form.innerHTML=`<div class="form-grid">${cfg.map(([n,l,t])=>`<label>${l}<input name="${n}" type="${t}"${t==='number'?' min="0" step="any"':''} value="${esc(data.profile[n]||'')}"></label>`).join('')}</div><div class="form-actions"><button class="button" type="submit">Save profile</button></div>`;form.onsubmit=e=>{e.preventDefault();data.profile=Object.fromEntries(new FormData(form).entries());if(save()){render();notify('Farm profile saved');}};}
  function currency(n){return new Intl.NumberFormat(undefined,{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(n)||0)}
  function renderSummary() {
    const host=document.getElementById('summary'); if(!host)return;
    const finance=data.records.finance;
    const total=type=>finance.filter(x=>x.type===type).filter(x=>x.amount!=null&&String(x.amount).trim()!==''&&Number.isFinite(Number(x.amount))).reduce((a,x)=>a+Number(x.amount),0);
    const hasFinance=finance.some(x=>x.amount!=null&&String(x.amount).trim()!==''&&Number.isFinite(Number(x.amount)));
    const income=total('Income'),expense=total('Expense'),stock=data.records.inventory.length;
    const harvest=data.records.harvest.filter(x=>x.quantity!=null&&String(x.quantity).trim()!==''&&Number.isFinite(Number(x.quantity)));
    const cards=[[data.records.weather.length,'Weather logs','🌦️'],[data.records.soil.length,'Soil tests','🪴'],[data.records.ipm.length,'Scouting notes','🐛'],[harvest.length?harvest.reduce((a,x)=>a+Number(x.quantity),0).toLocaleString()+' kg':'Not entered','Harvest logged','🌾'],[hasFinance?currency(income-expense):'Not entered','Net recorded','💰'],[stock,'Inventory items','📦']];
    host.innerHTML=cards.map(([v,l,i])=>'<article class="summary-card"><span>'+i+'</span><strong>'+esc(v)+'</strong><small>'+l+'</small></article>').join('');
  }
  function renderReport() {
    const out=document.getElementById('reportOutput'); if(!out)return;
    const profile=data.profile;
    const finance=data.records.finance.filter(row=>row.amount!=null&&String(row.amount).trim()!==''&&Number.isFinite(Number(row.amount)));
    const total=type=>finance.filter(row=>row.type===type).reduce((sum,row)=>sum+Number(row.amount),0);
    const hasFinance=finance.length>0;
    const sections=Object.entries(fields).map(([key,cfg])=>{
      const rows=data.records[key];
      return '<section class="report-section"><h3>'+cfg.icon+' '+esc(cfg.label)+' <small>('+rows.length+')</small></h3>'+
        (rows.length?'<table><thead><tr>'+cfg.fields.slice(0,5).map(field=>'<th>'+esc(field[1])+'</th>').join('')+'</tr></thead><tbody>'+
        rows.slice().reverse().map(row=>'<tr>'+cfg.fields.slice(0,5).map(field=>'<td>'+esc(row[field[0]]||'—')+'</td>').join('')+'</tr>').join('')+
        '</tbody></table>':'<p class="muted">No entries recorded.</p>')+'</section>';
    }).join('');
    out.innerHTML='<div class="report-header"><div><small>GREENFARM · FARM SUMMARY</small><h3>'+esc(profile.farmName||'My farm')+'</h3><p>'+esc([profile.farmer,profile.location,profile.area?profile.area+' acres':null].filter(Boolean).join(' · ')||'Farm profile not completed')+'</p></div><div><b>Generated</b><br>'+new Date().toLocaleDateString()+'</div></div>'+
      '<div class="report-totals"><span>Income <b>'+(hasFinance?currency(total('Income')):'Not entered')+'</b></span><span>Expenses <b>'+(hasFinance?currency(total('Expense')):'Not entered')+'</b></span><span>Net <b>'+(hasFinance?currency(total('Income')-total('Expense')):'Not entered')+'</b></span></div>'+sections;
  }
  function render(){Object.keys(fields).forEach(renderModule);renderProfile();renderSummary();renderReport();renderPrediction();}
  document.addEventListener('click',e=>{const edit=e.target.closest('[data-edit]');if(edit){const key=edit.dataset.key, row=data.records[key].find(x=>x.id===edit.dataset.edit), form=document.querySelector(`.record-form[data-key="${key}"]`);if(row&&form){form.reset();Object.entries(row).forEach(([k,v])=>{if(form.elements[k]&&form.elements[k].type!=='file')form.elements[k].value=v;});form.elements.id.value=row.id;form.querySelector('.edit-hint').textContent='Editing this record';form.scrollIntoView({behavior:'smooth',block:'center'});}}const del=e.target.closest('[data-delete]');if(del&&confirm('Delete this saved record? This cannot be undone unless you restore a backup.')){data.records[del.dataset.key]=data.records[del.dataset.key].filter(x=>x.id!==del.dataset.delete);if(save()){render();notify('Record deleted');}}const action=e.target.closest('[data-action]')?.dataset.action;if(action==='print')window.print();if(action==='export')exportBackup();if(action==='export-csv')Object.keys(fields).forEach(exportModule);if(action==='clear'&&confirm('Clear all GreenFarm records and the farm profile saved in this browser? Export a backup first if you may need these records.')){data=emptyData();if(save()){render();notify('Farm records cleared');}}});
  function exportBackup(){const blob=new Blob([JSON.stringify({app:'GreenFarm',version:2,exportedAt:new Date().toISOString(),...data},null,2)],{type:'application/json'}), url=URL.createObjectURL(blob), a=document.createElement('a');a.href=url;a.download=`greenfarm-backup-${today}.json`;a.click();URL.revokeObjectURL(url);}
  document.getElementById('restoreFile')?.addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const b=JSON.parse(await file.text()), candidate=b.records?b:(b.data||null);if(file.size>5*1024*1024||!candidate||!candidate.records||!Object.keys(fields).every(k=>Array.isArray(candidate.records[k])&&candidate.records[k].length<=10000&&candidate.records[k].every(row=>row&&typeof row==='object'&&!Array.isArray(row)))||!candidate.profile||typeof candidate.profile!=='object'||Array.isArray(candidate.profile))throw new Error('This file is not a valid GreenFarm backup or contains unsupported records.');if(!confirm('Replace the farm records in this browser with the records in this backup? Export a backup first if you may need the current data.'))return;const previous=data;data={records:Object.fromEntries(Object.keys(fields).map(k=>[k,candidate.records[k]])),profile:candidate.profile,prediction:candidate.prediction&&typeof candidate.prediction==='object'?candidate.prediction:{}};if(save()){render();notify('Backup restored');}else data=previous;}catch(err){document.getElementById('backupMessage').textContent=err.message||'Could not read that backup file.';}finally{e.target.value='';}});
  render();
})();

