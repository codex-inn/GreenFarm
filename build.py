# GreenFarm clean responsive page builder
import re
NAV=[("index","Home"),("dashboard","Dashboard"),("crops","Crops"),("livestock","Livestock"),("activities","Activities"),("analytics","Analytics"),("reports","Reports"),("farm","Workspace"),("advanced","Farm Center"),("admin","Settings")]
def shell(page,title,body,extra=""):
    links="".join(f'<a href="{p}.html"{" class="active" aria-current="page" if p==page else ""}>{n}</a>' for p,n in NAV)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#063b25"><title>{title} | GreenFarm</title><link rel="stylesheet" href="assets/greenfarm.css"><link rel="stylesheet" href="assets/app-ui.css?v=greenfarm-v11"></head><body>
<header class="inst-header"><div class="inst-inner"><div class="inst-left"><img class="inst-logo" src="https://agritech.tnau.ac.in/ta/pdf/images/TNAU.jpg" alt="TNAU logo"><div><div class="inst-title">TAMIL NADU AGRICULTURAL UNIVERSITY</div><div class="inst-tamil">தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகம்</div><div class="inst-address">Agricultural College &amp; Research Institute · Vazhavachanur</div></div></div><div class="gf-project"><div class="gf-project-name">GreenFarm</div><div class="gf-project-sub">SMART DIGITAL AGRICULTURE</div><div class="gf-project-meta">TNAU · AC&amp;RI · Vazhavachanur</div></div></div></header>
<nav class="gf-nav" aria-label="Main navigation"><div class="container"><div class="gf-nav-caption">Farm management</div><button class="dashboard-nav-toggle" onclick="this.nextElementSibling.classList.toggle('dashboard-nav-open')" aria-label="Open navigation">☰ <span>Menu</span></button><div class="nav-links">${links}</div></div></nav><main>{body}</main><footer class="gf-footer"><div class="container"><div><strong>🌱 GreenFarm</strong><p>Smart farm records · TNAU AC&RI Vazhavachanur</p></div><div><a href="index.html">Home</a> <a href="reports.html">Reports</a> <a href="farm.html#backup">Backup</a></div></div></footer><script src="assets/app.js"></script><script src="assets/app-ui.js?v=greenfarm-v11" defer></script>{extra}</body></html>'''
def home_shell(body):
    links="".join(f'<a href="{p}.html"{" class="active" aria-current="page" if p=="index" else ""}>{n}</a>' for p,n in NAV)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#173e2d"><title>Farm Home | GreenFarm</title><link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="assets/greenfarm.css"><link rel="stylesheet" href="assets/app-ui.css?v=greenfarm-v11"></head><body><nav class="gf-nav" aria-label="Main navigation"><div class="container"><div class="gf-nav-caption">Farm tools</div><div class="nav-links">{links}</div></div></nav><main>{body}</main><footer class="gf-footer"><div class="container"><strong>🌱 GreenFarm</strong><p>TNAU AC&amp;RI Vazhavachanur</p></div></footer><script src="assets/app-ui.js?v=greenfarm-v11" defer></script><script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script></body></html>'''
def standard(key,title,kicker,desc,icon,empty,button):
    return shell(key,title,f'''<div class="page"><section class="page-hero"><small>{kicker}</small><h1>{title}</h1><p>{desc}</p></section><section class="workspace-card"><div class="empty-icon" aria-hidden="true">{icon}</div><h2>{empty}</h2><p>Start in Workspace. Your data stays on this device.</p><div class="actions"><a class="btn2" href="{button}">Open Workspace →</a><button class="btn2 alt" onclick="window.print()">🖨️ Print</button></div></section></div>''')
pages=[("crops","Crops","🌾 CROPS","Track crop plans and growth.","🌱","No crop records yet","farm.html#crops"),("livestock","Livestock","🐄 LIVESTOCK","Track animals and care.","🐄","No livestock records yet","farm.html#livestock"),("activities","Activities","📅 ACTIVITIES","Plan daily farm work.","🧑‍🌾","No activities yet","farm.html#irrigation"),("analytics","Analytics","📈 ANALYTICS","Review farm records.","📈","Add records to see summaries","farm.html"),("reports","Reports","📄 REPORTS","Print a farm summary.","📄","No report data yet","farm.html#reports"),("admin","Settings","⚙️ SETTINGS","Manage local workspace settings.","💾","Your records stay in this browser","farm.html#backup")]
for p in pages: open(p[0]+".html","w").write(standard(*p))
dash='''<div class="page dashboard-page">
  <section class="page-hero"><small>📊 FARM OVERVIEW</small><h1>Dashboard</h1><p>Your farm records, in one clear view.</p></section>
  <section class="dashboard-stats" aria-label="Farm record totals">
    <div class="dashboard-stat"><div class="ds-icon" aria-hidden="true">🌾</div><strong id="dashCrops">0</strong><span>Crops</span></div>
    <div class="dashboard-stat"><div class="ds-icon" aria-hidden="true">🐄</div><strong id="dashLivestock">0</strong><span>Livestock</span></div>
    <div class="dashboard-stat"><div class="ds-icon" aria-hidden="true">💧</div><strong id="dashIrrigation">0</strong><span>Irrigation</span></div>
    <div class="dashboard-stat"><div class="ds-icon" aria-hidden="true">📊</div><strong id="dashTotal">0</strong><span>All records</span></div>
  </section>
  <section class="dashboard-panel">
    <div class="dashboard-section-head"><h2>Quick access</h2><a class="btn2" href="farm.html">Open workspace →</a></div>
    <div class="quick-grid">
      <a class="quick-card" href="farm.html#crops"><span aria-hidden="true">🌾</span><strong>Crops</strong><small>Crop records</small></a>
      <a class="quick-card" href="farm.html#livestock"><span aria-hidden="true">🐄</span><strong>Livestock</strong><small>Animal care</small></a>
      <a class="quick-card" href="farm.html#irrigation"><span aria-hidden="true">💧</span><strong>Irrigation</strong><small>Water records</small></a>
      <a class="quick-card" href="farm.html#reports"><span aria-hidden="true">📄</span><strong>Reports</strong><small>Print or save PDF</small></a>
    </div>
  </section>
</div>'''
dashjs='''<script>(function(){try{const d=JSON.parse(localStorage.getItem("greenfarm.v2")||"null")||{records:{}};const r=d.records||{};const n=k=>Array.isArray(r[k])?r[k].length:0;const ks=["crops","livestock","weather","soil","irrigation","ipm","harvest","finance","inventory"];document.getElementById("dashCrops").textContent=n("crops");document.getElementById("dashLivestock").textContent=n("livestock");document.getElementById("dashIrrigation").textContent=n("irrigation");document.getElementById("dashTotal").textContent=ks.reduce((s,k)=>s+n(k),0)}catch(e){}})();</script>'''
open("dashboard.html","w").write(shell("dashboard","Dashboard",dash,dashjs))
cards=[("🌾","Crops","Fields and growth.","crops.html"),("🐄","Livestock","Animals and care.","livestock.html"),("📅","Activities","Daily operations.","activities.html"),("📈","Analytics","Farm insights.","analytics.html"),("💧","Irrigation","Water management.","farm.html#irrigation"),("💰","Finance","Income and expenses.","farm.html#finance")]
cd="".join(f'<a class="card" href="{u}"><div class="icon">{i}</div><h3>{t}</h3><p>{d}</p></a>' for i,t,d,u in cards)
home='''<div class="gf-home-page">
  <section class="gf-home-banner" aria-labelledby="home-title">
    <div class="gf-home-copy">
      <p class="gf-home-kicker">🌱 GreenFarm overview</p>
      <h1 id="home-title">Your farm, at a glance.</h1>
      <p>Keep crops, livestock and daily work in one place.</p>
      <div class="gf-home-actions">
        <a class="primary" href="farm.html">Open workspace <span aria-hidden="true">→</span></a>
        <a href="dashboard.html">View dashboard</a>
      </div>
    </div>
    <div class="gf-home-art">
      <img src="assets/greenfarm-field-photo.png?v=greenfarm-v11" alt="Farmer walking beside green rice fields in Tamil Nadu" width="1536" height="1024" fetchpriority="high">
    </div>
  </section>
  <section class="gf-home-stat-grid" aria-label="Farm overview">
    <article class="gf-home-stat"><span>📊 Records</span><strong data-gf-stat="records">0</strong><small>saved on this device</small></article>
    <article class="gf-home-stat"><span>🗺️ Fields</span><strong data-gf-stat="fields">0</strong><small>Farm Center</small></article>
    <article class="gf-home-stat"><span>📅 Tasks</span><strong data-gf-stat="tasks">0</strong><small>Farm Center</small></article>
  </section>
  <section class="gf-home-section" aria-labelledby="home-tools-title">
    <div class="gf-home-section-head"><div><p>🌾 Farm tools</p><h2 id="home-tools-title">Choose a section</h2></div></div>
    <div class="gf-home-module-grid">
      <a class="gf-home-module" href="crops.html"><span class="gf-home-module-icon" aria-hidden="true">🌱</span><span><strong>Crops</strong><small>Plans and growth</small></span></a>
      <a class="gf-home-module" href="livestock.html"><span class="gf-home-module-icon" aria-hidden="true">🐄</span><span><strong>Livestock</strong><small>Animals and care</small></span></a>
      <a class="gf-home-module" href="activities.html"><span class="gf-home-module-icon" aria-hidden="true">🧑‍🌾</span><span><strong>Activities</strong><small>Daily farm work</small></span></a>
      <a class="gf-home-module" href="advanced.html"><span class="gf-home-module-icon" aria-hidden="true">🌿</span><span><strong>Farm Center</strong><small>Fields and tasks</small></span></a>
    </div>
  </section>
  <p class="gf-home-footer-note">💾 Your data stays in this browser. <a href="farm.html#backup">Open backup tools →</a></p>
</div>'''
open("index.html","w").write(home_shell(home))
s=open("farm.html",encoding="utf-8").read(); m=re.search(r'<main\b[^>]*>(.*?)</main>',s,re.S)
if not m: raise SystemExit("farm main not found")
toast=re.search(r'<div class="toast"[^>]*>.*?</div>',s,re.S); tail=toast.group(0) if toast else '<div class="toast" id="toast" role="status"></div>'
open("farm.html","w").write(shell("farm","Workspace",m.group(1)+tail,'<script src="assets/farm.js"></script>'))
