# Regenerates the static pages from one shared shell. Run: python3 build.py
NAV=[("index","Home"),("dashboard","Dashboard"),("crops","Crops"),("livestock","Livestock"),("activities","Activities"),("analytics","Analytics"),("reports","Reports"),("farm","Farm Tools"),("admin","Admin")]
def shell(page,title,body,extra_js=""):
    links="".join(f'<a href="{p}.html"{" class=\"active\" aria-current=\"page\"" if p==page else ""}>{n}</a>' for p,n in NAV)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#043a24"><meta name="description" content="{title} | GreenFarm Smart Digital Agriculture"><title>{title} | GreenFarm</title><link rel="stylesheet" href="assets/greenfarm.css"></head><body>
<header class="gf-header"><div class="container"><div class="gf-logo" aria-hidden="true">🌱</div><div><div class="gf-name">GreenFarm</div><div class="gf-sub">Smart Digital Agriculture · TNAU AC&amp;RI Vazhavachanur</div></div><span class="gf-badge">Local data</span></div></header>
<nav class="gf-nav" aria-label="Main"><div class="container"><span class="nav-brand">Menu</span><button class="nav-toggle" aria-expanded="false" aria-controls="navLinks" aria-label="Toggle menu">☰</button><div class="nav-links" id="navLinks">{links}</div></div></nav>
<main>{body}</main>
<footer class="gf-footer"><div class="container"><div><strong>🌱 GreenFarm</strong><p>Smart Digital Farm Management System</p></div><div><a href="index.html">Home</a><a href="reports.html">Reports</a><a href="farm.html#backup">Backup</a></div><small>© 2026 GreenFarm · Browser storage only</small></div></footer>
<script src="assets/app.js"></script>{extra_js}</body></html>'''
def page(key,title,kicker,desc,icon,empty,btn="farm.html#"):
    return shell(key,title,f'''<div class="page"><section class="page-hero"><small>{kicker}</small><h1>{title}</h1><p>{desc}</p></section>
<section class="workspace-card"><div class="empty-icon">{icon}</div><h2>{empty}</h2><p>Records you add in Farm Tools stay in this browser. No sample figures are shown.</p><div class="actions"><a class="btn2" href="{btn}">Open Farm Tools →</a><button class="btn2 alt" onclick="window.print()">Print page</button></div></section>
<div class="info-grid"><div class="info"><strong>Real data only</strong><span>No sample farm figures are shown.</span></div><div class="info"><strong>Local workspace</strong><span>Your records stay on this device.</span></div><div class="info"><strong>Backup ready</strong><span>Export a JSON copy any time.</span></div></div></div>''')
P=[("dashboard","Dashboard","FARM OVERVIEW","View your recorded farm information, current activities and operational summaries.","📊","No farm records yet","farm.html"),
("crops","Crop Management","CROPS","Track crops, fields, varieties and growth stages.","🌾","No crop records yet","farm.html#crops"),
("livestock","Livestock","LIVESTOCK","Manage animal groups, health observations and care notes.","🐄","No livestock records yet","farm.html#livestock"),
("activities","Farm Activities","OPERATIONS","Plan irrigation, scouting and daily farm operations.","📅","No activities yet","farm.html#irrigation"),
("analytics","Analytics","PERFORMANCE","Review yield, revenue and farm performance.","📈","No analytics yet","farm.html#harvest"),
("reports","Reports","PRINT &amp; SHARE","Generate print-ready farm summaries.","🧾","No report data yet","farm.html#reports"),
("admin","Admin","SETTINGS","Farm profile, backup and restore.","⚙️","Manage this workspace","farm.html#backup")]
for a in P: open(a[0]+".html","w").write(page(*a))
open("auth.html","w").write(shell("auth","Sign in",'''<div class="auth"><div class="auth-card"><span class="kicker">Farmer access</span><h1>Your farm, on this device</h1><p>GreenFarm keeps records in browser storage. No account or server sign-in is required.</p><a class="btn2" href="farm.html#profile">Open farm profile</a><p><a href="index.html">← Back to GreenFarm</a></p></div></div>'''))
cards=[("🌾","Crops","Fields, varieties and growth stages.","crops.html"),("🐄","Livestock","Animal groups and health records.","livestock.html"),("📅","Activities","Daily tasks and operations.","activities.html"),("📈","Analytics","Yield and revenue insights.","analytics.html"),("💧","Irrigation &amp; IPM","Water use and pest scouting.","farm.html#irrigation"),("💰","Finance","Income, expenses and net balance.","farm.html#finance")]
cd="".join(f'<a class="card" href="{u}"><div class="icon">{i}</div><h3>{t}</h3><p>{d}</p></a>' for i,t,d,u in cards)
open("index.html","w").write(shell("index","Smart Digital Agriculture",f'''<section class="hero"><div class="container hero-grid"><div><span class="eyebrow">TNAU · AC&amp;RI Vazhavachanur</span><h1>Smarter Farming. <span>Better Decisions.</span></h1><p>GreenFarm organises crops, livestock, activities, finances and reports in one responsive workspace that works on your phone or desktop.</p><div class="hero-actions"><a class="btn btn-gold" href="farm.html">Open Farm Tools</a><a class="btn btn-light" href="dashboard.html">View Dashboard</a></div></div><div class="hero-panel"><strong>Farm workspace</strong><div class="panel-grid"><div class="metric"><small>Modules</small><strong>13</strong></div><div class="metric"><small>Storage</small><strong>Local</strong></div><div class="metric"><small>Backup</small><strong>JSON</strong></div><div class="metric"><small>Reports</small><strong>PDF</strong></div></div></div></div></section>
<div class="container"><div class="snapshot-grid"><div class="snap"><strong>No server</strong><span>Works offline</span></div><div class="snap"><strong>Mobile + PC</strong><span>Fully responsive</span></div><div class="snap"><strong>Private</strong><span>Data stays with you</span></div><div class="snap"><strong>Free</strong><span>GitHub Pages</span></div></div></div>
<section class="section"><div class="container"><div class="section-head"><span class="kicker">Modules</span><h2>Everything your farm needs</h2><p>Pick a module to start recording real farm data.</p></div><div class="modules">{cd}</div></div></section>
<section class="cta"><div class="container cta-box"><h2>Start recording your farm today</h2><a class="btn btn-gold" href="farm.html">Get started →</a></div></section>'''))
# farm.html: keep body, swap shell
import re
s=open("farm.html").read()
m=re.search(r'<main class="farm-shell">.*?</main>',s,re.S).group(0)
t=re.search(r'<div class="toast".*?</div>',s,re.S).group(0)
open("farm.html","w").write(shell("farm","Farm Workspace",m+t,'<script src="assets/farm.js"></script>'))