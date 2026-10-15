(() => {
  "use strict";
  const CORE = "greenfarm.v2";
  const CENTER = "greenfarm.advanced.v1";
  const read = (key) => { try { const value = JSON.parse(localStorage.getItem(key) || "null"); return value && typeof value === "object" ? value : {}; } catch (_) { return {}; } };
  const core = read(CORE);
  const center = read(CENTER);
  const records = core.records && typeof core.records === "object" ? core.records : {};
  const list = (source, key) => Array.isArray(source?.[key]) ? source[key] : [];
  const workspaceRecords = Object.values(records).flatMap(value => Array.isArray(value) ? value : []);
  const centerRecords = Object.values(center).flatMap(value => Array.isArray(value) ? value : []);
  const money = (value) => value == null || String(value).trim() === "" || !Number.isFinite(Number(value)) ? null : Number(value);
  const amountRows = (rows, type) => rows.filter(row => row.type === type && money(row.amount) !== null);
  const amount = rows => rows.reduce((sum,row)=>sum+money(row.amount),0);
  const finances = [...list(records, "finance"), ...list(center, "money")];
  const incomeRows = amountRows(finances,"Income"), expenseRows = amountRows(finances,"Expense");
  const income = amount(incomeRows), expenses = amount(expenseRows);
  const currency = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const today = new Date();
  const todayKey = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 17 ? "Good afternoon" : "Good evening";
  const profile = core.profile && typeof core.profile === "object" ? core.profile : center.profile || {};
  const name = String(profile.farmer || profile.name || "").trim();
  const title = document.getElementById("dashboardGreeting");
  if (title) title.textContent = name ? greeting + ", " + name : greeting;
  const dateLabel = document.getElementById("dashboardToday");
  if (dateLabel) dateLabel.textContent = today.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const tasks = [
    ...list(center, "tasks").filter(row => row.status !== "Completed").map(row => ({ title: row.task || "Farm task", detail: row.field || row.priority || "Farm Center", due: row.due || "", status: row.status || "Pending", href: "advanced.html#taskList", source: "Farm Center" })),
    ...list(center, "irrigation").map(row => ({ title: "Irrigation · " + (row.field || row.crop || "Field"), detail: row.method || "Scheduled water", due: row.next || "", status: "Planned", href: "advanced.html#irrList", source: "Farm Center" })),
    ...list(center, "cropPlans").filter(row => row.next).map(row => ({ title: "Crop check · " + (row.crop || "Crop"), detail: row.field || row.stage || "Crop plan", due: row.next, status: row.health || "Scheduled", href: "advanced.html#cropsList", source: "Farm Center" })),
    ...list(records, "irrigation").filter(row => row.status !== "Completed" && row.status !== "Skipped").map(row => ({ title: "Irrigation · " + (row.field || "Field"), detail: row.method || "Workspace", due: row.date || "", status: row.status || "Planned", href: "farm.html#irrigation", source: "Workspace" })),
    ...list(records, "ipm").filter(row => row.followup).map(row => ({ title: "Scouting follow-up · " + (row.issue || row.field || "Crop"), detail: row.severity || "Follow-up", due: row.followup, status: "Scheduled", href: "farm.html#ipm", source: "Workspace" }))
  ].filter(task => task.due).sort((a,b) => a.due.localeCompare(b.due));

  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  set("dashCrops", String(list(records,"crops").length + list(center,"cropPlans").length));
  set("dashLivestock", String(list(records,"livestock").reduce((sum,row)=>sum+(money(row.count)??0),0)));
  set("dashFields", String(list(center,"fields").length));
  set("dashIrrigation", String(tasks.length));
  set("dashIncome", incomeRows.length ? currency(income) : "Not entered");
  set("dashExpenses", expenseRows.length ? currency(expenses) : "Not entered");

  const taskHost = document.getElementById("dashboardTasks");
  if (taskHost) taskHost.innerHTML = tasks.length ? tasks.slice(0,5).map(task => {
    const late = task.due < todayKey;
    return '<a class="dashboard-task" href="' + task.href + '"><span class="dashboard-task-date">' + new Date(task.due + "T00:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short"}) + '</span><span class="dashboard-task-copy"><strong>' + esc(task.title) + '</strong><small>' + esc(task.detail) + " · " + esc(task.source) + '</small></span><span class="status-pill ' + (late ? "is-late" : "") + '">' + (late ? "Overdue" : esc(task.status)) + '</span></a>';
  }).join("") : '<div class="dashboard-empty"><span aria-hidden="true">🌿</span><strong>Nothing scheduled</strong><p>Add a task in Farm Center or plan irrigation in Workspace.</p><a href="advanced.html#taskForm">Add a task →</a></div>';

  const recent = [
    ...Object.entries(records).flatMap(([key, rows]) => Array.isArray(rows) ? rows.map(row => ({ row, module: key, href: "farm.html#" + key, when: row.updatedAt || row.createdAt || row.date || row.updated })) : []),
    ...Object.entries(center).flatMap(([key, rows]) => Array.isArray(rows) ? rows.map(row => ({ row, module: key, href: "advanced.html#" + ({cropPlans:"cropsList",tasks:"taskList",irrigation:"irrList"}[key]||key), when: row.updatedAt || row.createdAt || row.date || row.due || row.next })) : [])
  ].filter(item => item.when).sort((a,b) => String(b.when).localeCompare(String(a.when))).slice(0,5);
  const labels = {crops:"Crop",livestock:"Livestock",weather:"Weather",soil:"Soil",irrigation:"Irrigation",ipm:"Scouting",harvest:"Harvest",finance:"Finance",inventory:"Inventory",cropPlans:"Crop plan",tasks:"Task",fertilizer:"Farm input",pests:"Pest log",money:"Finance",seeds:"Seed stock",equipment:"Equipment",diary:"Farm diary"};
  const recentHost = document.getElementById("dashboardRecent");
  if (recentHost) recentHost.innerHTML = recent.length ? recent.map(item => {
    const row=item.row;
    const title=row.crop || row.task || row.group || row.field || row.item || row.title || row.category || row.name || labels[item.module] || "Farm record";
    const when = new Date(String(item.when).slice(0,10)+"T00:00:00");
    return '<a class="dashboard-recent-row" href="' + item.href + '"><span class="recent-icon" aria-hidden="true">🌱</span><span><strong>' + esc(title) + '</strong><small>' + esc(labels[item.module] || "Record") + " · " + (Number.isNaN(when.getTime()) ? "Saved" : when.toLocaleDateString(undefined,{day:"numeric",month:"short"})) + '</small></span><span aria-hidden="true">→</span></a>';
  }).join("") : '<div class="dashboard-empty compact"><strong>Your farm activity will appear here.</strong><p>Records from both workspaces are shown here.</p></div>';

  function esc(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  window.addEventListener("storage", event => { if (!event.key || event.key === CORE || event.key === CENTER) location.reload(); });
})();
