(()=>{"use strict";
const CORE="greenfarm.v2",CENTER="greenfarm.advanced.v1";
const read=(key,fallback)=>{try{const x=JSON.parse(localStorage.getItem(key)||"null");return x&&typeof x==="object"&&!Array.isArray(x)?x:fallback}catch(_){return fallback}};
const day=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const tag=x=>({...x,id:"demo-"+Math.random().toString(36).slice(2)+Date.now().toString(36),demo:true,recordLabel:"DEMO"});
const core=read(CORE,{records:{},profile:{},prediction:{}});if(!core.records||typeof core.records!=="object"||Array.isArray(core.records))core.records={};
const center=read(CENTER,{fields:[],cropPlans:[],irrigation:[],fertilizer:[],pests:[],money:[],harvest:[],seeds:[],equipment:[],tasks:[],diary:[],profile:{}});
["fields","cropPlans","irrigation","fertilizer","pests","money","harvest","seeds","equipment","tasks","diary"].forEach(k=>{if(!Array.isArray(center[k]))center[k]=[]});
const workspace={
crops:[{date:day(-24),crop:"Tomato",field:"DEMO Field A",variety:"PKM 1",stage:"Flowering",area:1.5,notes:"DEMO · Sample crop record; not real farm data."},{date:day(-60),crop:"Paddy",field:"DEMO Field B",variety:"ADT 45",stage:"Grain filling",area:2,notes:"DEMO · Sample crop record."}],
livestock:[{date:day(-1),group:"Dairy cows",count:4,purpose:"Milk",health:"Routine check",feed:"Green fodder and clean water",notes:"DEMO · Sample livestock record."}],
weather:[{date:day(0),field:"DEMO Field A",condition:"Sunny",temperature:31,rainfall:0,humidity:62,notes:"DEMO · Illustrative weather, not a live observation."}],
soil:[{date:day(-5),field:"DEMO Field A",type:"Sandy loam",ph:6.7,nitrogen:220,phosphorus:18,potassium:210,notes:"DEMO · Illustrative values only; use a real soil test."}],
irrigation:[{date:day(1),field:"DEMO Field A",method:"Drip",duration:45,water:5,status:"Planned",notes:"DEMO · Confirm actual irrigation needs."}],
ipm:[{date:day(-2),field:"Tomato · DEMO Field A",issue:"Whitefly scouting",severity:"Low",action:"Inspect leaf undersides and monitor",followup:day(2),notes:"DEMO · Sample scouting observation."}],
harvest:[{date:day(-7),crop:"Tomato",field:"DEMO Field A",quantity:180,grade:"A",price:24,buyer:"Demo Market",notes:"DEMO · Illustrative harvest and price."}],
finance:[{date:day(-3),type:"Expense",category:"Fertilizer",crop:"Tomato",amount:1850,description:"Illustrative input expense",reference:"DEMO Field A"},{date:day(-1),type:"Income",category:"Produce sale",crop:"Tomato",amount:4320,description:"Illustrative produce sale",reference:"Demo Market"}],
inventory:[{item:"Tomato seeds",category:"Seed",quantity:2,unit:"packets",reorder:5,updated:day(0),notes:"DEMO · Sample stock."},{item:"Drip connectors",category:"Equipment",quantity:8,unit:"pieces",reorder:10,updated:day(0),notes:"DEMO · Sample stock."}]
};
const centerRows={
fields:[{number:"A",area:1.5,crop:"Tomato",soil:"Sandy loam",notes:"DEMO field"},{number:"B",area:2,crop:"Paddy",soil:"Clay loam",notes:"DEMO field"}],
cropPlans:[{crop:"Tomato",field:"DEMO Field A",stage:"Flowering",health:"Healthy",sowing:day(-35),harvest:day(35),next:day(2),notes:"DEMO crop plan"},{crop:"Paddy",field:"DEMO Field B",stage:"Grain/Fruit filling",health:"Healthy",sowing:day(-75),harvest:day(15),next:day(3),notes:"DEMO crop plan"}],
irrigation:[{field:"DEMO Field A",crop:"Tomato",next:day(1),method:"Drip",water:5,notes:"DEMO irrigation plan"}],
fertilizer:[{product:"Compost",quantity:"250 kg",cost:1200,date:day(-10),field:"DEMO Field A",notes:"DEMO input record"}],
pests:[{crop:"Tomato",field:"DEMO Field A",problem:"Whitefly scouting",severity:"Low",date:day(-2),followup:day(2),action:"Monitor and inspect",notes:"DEMO scouting record"}],
money:[{type:"Expense",category:"Seeds and inputs",amount:1850,crop:"Tomato",date:day(-3),description:"DEMO illustrative expense"},{type:"Income",category:"Harvest sale",amount:4320,crop:"Tomato",date:day(-1),description:"DEMO illustrative income"}],
harvest:[{crop:"Tomato",field:"DEMO Field A",date:day(-1),quantity:180,price:24,notes:"DEMO harvest record"}],
seeds:[{variety:"PKM 1 Tomato",quantity:"2 packets",expiry:day(180),notes:"DEMO seed stock"}],
equipment:[{name:"Knapsack sprayer",condition:"Good",next:day(7),notes:"DEMO equipment record"}],
tasks:[{task:"Inspect tomato leaves",field:"DEMO Field A",due:day(1),priority:"High",status:"Pending",notes:"DEMO task"},{task:"Check paddy field moisture",field:"DEMO Field B",due:day(-1),priority:"Normal",status:"Pending",notes:"DEMO task"}],
diary:[{date:day(0),field:"DEMO Field A · Tomato",title:"Showcase crop observation",notes:"DEMO · Example entry; replace with actual observations for real decisions."}]
};
let changedCore=false,changedCenter=false;
Object.entries(workspace).forEach(([k,rows])=>{if(!Array.isArray(core.records[k]))core.records[k]=[];if(!core.records[k].some(x=>x&&x.demo===true)){core.records[k].push(...rows.map(tag));changedCore=true}});
Object.entries(centerRows).forEach(([k,rows])=>{if(!center[k].some(x=>x&&x.demo===true)){center[k].push(...rows.map(tag));changedCenter=true}});
try{if(changedCore)localStorage.setItem(CORE,JSON.stringify(core));if(changedCenter)localStorage.setItem(CENTER,JSON.stringify(center));if(changedCore||changedCenter)window.dispatchEvent(new CustomEvent("greenfarm:demoseeded"))}catch(_){/* Never clear or replace the user's existing data if storage is full. */}
})();