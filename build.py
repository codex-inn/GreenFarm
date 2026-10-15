# GreenFarm clean responsive page builder
import re
NAV=[("index","Home"),("dashboard","Dashboard"),("crops","Crops"),("livestock","Livestock"),("activities","Activities"),("analytics","Analytics"),("reports","Reports"),("farm","Workspace"),("advanced","Farm Center"),("admin","Settings")]
def shell(page,title,body,extra=""):
    links="".join('<a href="{}.html"{}>{}</a>'.format(p, ' class="active" aria-current="page"' if p==page else "", n) for p,n in NAV)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#063b25"><title>{title} | GreenFarm</title><link rel="stylesheet" href="assets/greenfarm.css"><link rel="stylesheet" href="assets/app-ui.css?v=greenfarm-v16"><link rel="stylesheet" href="assets/module-views.css?v=greenfarm-v16"></head><body>
<header class="inst-header"><div class="inst-inner"><div class="inst-left"><img class="inst-logo" src="https://agritech.tnau.ac.in/ta/pdf/images/TNAU.jpg" alt="TNAU logo"><div><div class="inst-title">TAMIL NADU AGRICULTURAL UNIVERSITY</div><div class="inst-tamil">தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகம்</div><div class="inst-address">Agricultural College &amp; Research Institute · Vazhavachanur</div></div></div><div class="gf-project"><div class="gf-project-name">GreenFarm</div><div class="gf-project-sub">SMART DIGITAL AGRICULTURE</div><div class="gf-project-meta">TNAU · AC&amp;RI · Vazhavachanur</div></div></div></header>
<nav class="gf-nav" aria-label="Main navigation"><div class="container"><div class="gf-nav-caption">Farm management</div><button class="dashboard-nav-toggle" onclick="this.nextElementSibling.classList.toggle('dashboard-nav-open')" aria-label="Open navigation">☰ <span>Menu</span></button><div class="nav-links">{links}</div></div></nav><main>{body}</main><footer class="gf-footer"><div class="container"><div><strong>🌱 GreenFarm</strong><p>Smart farm records · TNAU AC&RI Vazhavachanur</p></div><div><a href="index.html">Home</a> <a href="reports.html">Reports</a> <a href="farm.html#backup">Backup</a></div></div></footer><script src="assets/app.js"></script><script src="assets/app-ui.js?v=greenfarm-v16" defer></script>{extra}</body></html>'''
def home_shell(body):
    links="".join('<a href="{}.html"{}>{}</a>'.format(p, ' class="active" aria-current="page"' if p=="index" else "", n) for p,n in NAV)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#173e2d"><title>Farm Home | GreenFarm</title><link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="assets/greenfarm.css"><link rel="stylesheet" href="assets/app-ui.css?v=greenfarm-v16"><link rel="stylesheet" href="assets/module-views.css?v=greenfarm-v16"></head><body><nav class="gf-nav" aria-label="Main navigation"><div class="container"><div class="gf-nav-caption">Farm tools</div><div class="nav-links">{links}</div></div></nav><main>{body}</main><footer class="gf-footer gf-home-footer"><div class="container gf-home-footer-container"><div class="gf-home-brand"><strong>🌱 GreenFarm</strong><p>TNAU AC&amp;RI Vazhavachanur</p></div><div class="gf-project-credit"><span class="gf-project-credit-label">Project submitted by</span><strong>KOWSHIK S.</strong><span class="gf-project-credit-meta">AC&amp;RI VAZHAVACHANUR <span aria-hidden="true">·</span> TNAU</span></div></div></footer><script src="assets/app-ui.js?v=greenfarm-v16" defer></script><script src="assets/home-video.js?v=greenfarm-v16" defer></script><script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{{}});</script></body></html>'''
def standard(key,title,kicker,desc,icon,empty,button):
    return shell(key,title,f'''<div class="page"><section class="page-hero"><small>{kicker}</small><h1>{title}</h1><p>{desc}</p></section><section class="workspace-card"><div class="empty-icon" aria-hidden="true">{icon}</div><h2>{empty}</h2><p>Start in Workspace. Your data stays on this device.</p><div class="actions"><a class="btn2" href="{button}">Open Workspace →</a><button class="btn2 alt" onclick="window.print()">🖨️ Print</button></div></section></div>''')
pages=[("crops","Crops","🌾 CROPS","Track crop plans and growth.","🌱","No crop records yet","farm.html#crops"),("livestock","Livestock","🐄 LIVESTOCK","Track animals and care.","🐄","No livestock records yet","farm.html#livestock"),("activities","Activities","📅 ACTIVITIES","Plan daily farm work.","🧑‍🌾","No activities yet","farm.html#irrigation"),("analytics","Analytics","📈 ANALYTICS","Review farm records.","📈","Add records to see summaries","farm.html"),("reports","Reports","📄 REPORTS","Print a farm summary.","📄","No report data yet","farm.html#reports"),("admin","Settings","⚙️ SETTINGS","Manage local workspace settings.","💾","Your records stay in this browser","farm.html#backup")]
for p in pages: open(p[0]+".html","w",encoding="utf-8").write(standard(*p))
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
open("dashboard.html","w",encoding="utf-8").write(shell("dashboard","Dashboard",dash,dashjs))
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
      <img src="assets/greenfarm-sunrise-header.webp?v=greenfarm-v16" alt="Farmer walking beside green rice fields in Tamil Nadu" width="1536" height="1024" fetchpriority="high">
    </div>
  </section>
  <section class="gf-home-video" aria-labelledby="home-animation-title">
    <div class="gf-home-video-copy">
      <p class="gf-home-video-kicker">💧 WATER SMART FARMING · 3D ANIMATION</p>
      <h2 id="home-animation-title">See drip irrigation in action</h2>
      <p>A short farm animation showing how drip irrigation delivers water to crops.</p>
      <a class="gf-home-video-source" href="https://sawbo-animations.org/230" target="_blank" rel="noopener noreferrer">About this free SAWBO animation ↗</a>
    </div>
    <div class="gf-home-video-player" data-gf-video data-video-src="https://sawbo-animations.org/download_aws.php?id=230&amp;video=EN_English_USA_SGDripIrrigation3D_Final.mp4">
      <button class="gf-home-video-cover" type="button" aria-label="Play the 3D drip irrigation animation">
        <img src="assets/drip-irrigation-poster.svg?v=greenfarm-v16" alt="Illustrated farm with green crop rows and drip irrigation" width="1280" height="720" loading="lazy">
        <span class="gf-home-video-play"><span aria-hidden="true">▶</span> Watch 3D animation</span>
        <span class="gf-home-video-badge" aria-hidden="true">3D FARM ANIMATION</span>
      </button>
      <noscript><a class="gf-home-video-noscript" href="https://sawbo-animations.org/230">Watch the animation on SAWBO ↗</a></noscript>
    </div>
    <p class="gf-home-video-credit">Free for educational use · SAWBO, a Purdue University program</p>
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
open("index.html","w",encoding="utf-8").write(home_shell(home))
s=open("farm.html",encoding="utf-8").read(); m=re.search(r'<main\b[^>]*>(.*?)</main>',s,re.S)
if not m: raise SystemExit("farm main not found")
toast=re.search(r'<div class="toast"[^>]*>.*?</div>',s,re.S); tail=toast.group(0) if toast else '<div class="toast" id="toast" role="status"></div>'
open("farm.html","w",encoding="utf-8").write(shell("farm","Workspace",m.group(1)+tail,'<script src="assets/farm.js"></script>'))


# Data-driven app pages (keeps the static GitHub Pages architecture).
dashboard_body = """
<div class="page module-view-page dashboard-page">
<section class="module-view-hero dashboard-view-hero"><div><small id="dashboardToday">FARM OVERVIEW</small><h1 id="dashboardGreeting">Good morning</h1><p>A clear view of your saved farm records and scheduled work.</p></div><div class="module-view-actions"><a class="view-primary" href="farm.html">Open workspace →</a><a class="view-button" href="advanced.html#taskForm">Add task</a></div></section>
<section class="dashboard-kpi-grid" aria-label="Farm summary">
<article class="dashboard-kpi"><span>🗺️ Fields</span><strong id="dashFields">0</strong><small>Registered in Farm Center</small></article>
<article class="dashboard-kpi"><span>🌾 Crop plans</span><strong id="dashCrops">0</strong><small>Workspace + Farm Center</small></article>
<article class="dashboard-kpi"><span>🐄 Animals</span><strong id="dashLivestock">0</strong><small>Total entered animal count</small></article>
<article class="dashboard-kpi"><span>📅 Pending work</span><strong id="dashIrrigation">0</strong><small>Scheduled and overdue</small></article>
<article class="dashboard-kpi"><span>💰 Income</span><strong id="dashIncome">Not entered</strong><small>Entered transactions</small></article>
<article class="dashboard-kpi"><span>🧾 Expenses</span><strong id="dashExpenses">Not entered</strong><small>Entered transactions</small></article>
</section>
<div class="dashboard-content-grid">
<section class="dashboard-card"><div class="dashboard-card-heading"><div><small>PLAN AHEAD</small><h2>Scheduled work</h2></div><a href="activities.html">All activities →</a></div><div id="dashboardTasks" class="dashboard-task-list"></div></section>
<section class="dashboard-card"><div class="dashboard-card-heading"><div><small>RECENTLY SAVED</small><h2>Recent activity</h2></div><a href="reports.html">View report →</a></div><div id="dashboardRecent" class="dashboard-recent-list"></div></section>
</div>
<section class="dashboard-card dashboard-quick-card"><div class="dashboard-card-heading"><div><small>FARM TOOLS</small><h2>Quick actions</h2></div></div><div class="dashboard-quick-grid"><a href="farm.html#crops"><span>🌾</span><strong>Add crop record</strong></a><a href="farm.html#livestock"><span>🐄</span><strong>Add livestock</strong></a><a href="advanced.html#taskForm"><span>📅</span><strong>Plan an activity</strong></a><a href="farm.html#finance"><span>💰</span><strong>Enter farm finance</strong></a></div></section>
</div>
"""
dashboard_extra = '<script src="assets/dashboard.js?v=greenfarm-v16" defer></script>'
open("dashboard.html","w",encoding="utf-8").write(shell("dashboard","Dashboard",dashboard_body,dashboard_extra))

def data_view_page(key,title,kicker,description,actions):
    body = f'''<div class="page module-view-page" data-view="{key}">
<section class="module-view-hero"><div><small>{kicker}</small><h1>{title}</h1><p>{description}</p></div><div class="module-view-actions">{actions}</div></section>
<section class="view-toolbar" aria-label="Filter {title.lower()}"><label>Search<input id="recordSearch" type="search" placeholder="Search records..." autocomplete="off"></label><label>Show<select id="recordFilter"><option value="all">All records</option><option value="open">Open / scheduled</option><option value="overdue">Overdue</option><option value="completed">Completed</option></select></label><label>Sort by<select id="recordSort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label><button id="exportView" class="view-button" type="button">Download CSV</button><p id="recordsSummary" class="view-count" aria-live="polite"></p></section>
<section id="recordsView" class="records-view" aria-live="polite"></section><nav id="recordsPagination" class="record-pagination" aria-label="Record pages"></nav></div>'''
    extra = '<script src="assets/module-views.js?v=greenfarm-v16" defer></script>'
    open(key+".html","w",encoding="utf-8").write(shell(key,title,body,extra))

data_view_page("crops","Crops","🌾 CROP RECORDS","Crop records and plans in both GreenFarm workspaces.",'<a class="view-primary" href="farm.html#crops">Add crop record →</a>')
data_view_page("livestock","Livestock","🐄 ANIMAL CARE","Animal groups and care notes recorded in Workspace.",'<a class="view-primary" href="farm.html#livestock">Add livestock record →</a>')
data_view_page("activities","Activities","📅 FARM CALENDAR","Tasks, irrigation and scouting follow-ups in one place.",'<a class="view-primary" href="advanced.html#taskForm">Plan activity →</a><a class="view-button" href="farm.html#irrigation">Add irrigation</a>')

analytics_body = """<div class="page module-view-page" data-view="analytics">
<section class="module-view-hero"><div><small>📈 FARM INSIGHTS</small><h1>Analytics</h1><p>Review entered farm income, costs and harvest summaries.</p></div><div class="module-view-actions"><a class="view-primary" href="farm.html#finance">Add transaction →</a><a class="view-button" href="farm.html#harvest">Add harvest</a></div></section>
<section class="view-toolbar"><label>Financial period<select id="analyticsRange"><option value="6">Last 6 months</option><option value="12" selected>Last 12 months</option><option value="36">Last 3 years</option><option value="all">All recorded dates</option></select></label><button id="exportView" class="view-button" type="button">Download finance CSV</button><p id="analyticsSummary" class="view-count" aria-live="polite"></p></section><section id="analyticsView"></section></div>"""
open("analytics.html","w",encoding="utf-8").write(shell("analytics","Analytics",analytics_body,'<script src="assets/module-views.js?v=greenfarm-v16" defer></script>'))

reports_body = """<div class="page module-view-page" data-view="reports">
<section class="module-view-hero"><div><small>📄 PRINT &amp; EXPORT</small><h1>Farm reports</h1><p>A clean, print-ready summary of records stored on this device.</p></div><div class="module-view-actions"><button id="printReport" class="view-primary" type="button">Print / Save PDF</button><button id="exportView" class="view-button" type="button">Export CSV</button></div></section>
<section class="view-toolbar"><label>From date<input id="reportFrom" type="date"></label><label>To date<input id="reportTo" type="date"></label><p id="reportSummary" class="view-count" aria-live="polite"></p></section><section id="reportView" class="report-view"></section></div>"""
open("reports.html","w",encoding="utf-8").write(shell("reports","Farm Reports",reports_body,'<script src="assets/module-views.js?v=greenfarm-v16" defer></script>'))
