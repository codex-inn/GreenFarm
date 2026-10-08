# 🌱 GreenFarm

**GreenFarm – Smart Digital Farm Management System**

> Smarter Farming. Better Decisions. Sustainable Future.

GreenFarm is a responsive, browser-based digital agriculture platform for organizing crop, livestock, field, irrigation, input, pest/disease, harvest, finance, inventory, task and farm-diary records in one place.

## ✨ Main Features

- 🏠 Responsive GreenFarm home and dashboard
- 🌾 Crop records and crop lifecycle calendar
- 🩺 Crop health tracking: Healthy / Warning / Pest / Disease
- 🗺️ Field management with area, soil and irrigation details
- 💧 Irrigation planning and next-watering dates
- 🧪 Fertilizer and manure records
- 🐛 Pest and disease scouting log
- 💰 Income, expenses and net-profit calculation
- 🌾 Harvest and yield records
- 🌦️ Manual weather observations: temperature, rainfall and humidity
- ⏰ Farm task/reminder records
- 🌱 Seed inventory
- 🚜 Equipment register and service dates
- 👨‍🌾 Farmer/farm profile
- 📓 Digital farm diary
- 📊 Advanced farm metrics and reports
- 📥 CSV export
- 💾 JSON backup and restore
- ✨ Demo-data mode for project demonstrations
- 🖨️ Print / Save as PDF
- 📱 Responsive mobile + desktop UI
- 📲 PWA install/offline shell support
- 🔒 Browser LocalStorage architecture — no Supabase/backend required

## 🧩 Project Pages

| Page | Purpose |
|---|---|
| Home | Project introduction and navigation |
| Dashboard | Farm overview and quick access |
| Crops | Crop records |
| Livestock | Animal/group records |
| Activities | Daily farm activities |
| Analytics | Farm analytics |
| Reports | Print-ready reports |
| Workspace | Core GreenFarm records, prediction and backup |
| Farm Center | Advanced field, crop, irrigation, inputs, IPM, finance, harvest, inventory, tasks and diary tools |
| Admin | Project/data administration |
| Auth | Informational project entry page; no server authentication |

## 🛠️ Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Browser LocalStorage
- Progressive Web App manifest + service worker
- GitHub Pages

The project is intentionally backend-free. Records are stored in the browser on the current device. Use JSON/CSV export to preserve or transfer data.

> Core farm data works without a backend. Some visual background images are external web assets and may require an internet connection.

## 📁 Structure

```text
GreenFarm/
├── index.html
├── auth.html
├── dashboard.html
├── crops.html
├── livestock.html
├── activities.html
├── analytics.html
├── reports.html
├── farm.html
├── advanced.html
├── admin.html
├── manifest.webmanifest
├── sw.js
├── assets/
│   ├── greenfarm.css
│   ├── farm.css
│   ├── farm.js
│   ├── advanced.css
│   ├── advanced.js
│   ├── style.css
│   ├── app.js
│   └── greenfarm-logo.svg
└── README.md
```

## 💾 Data & Privacy

GreenFarm stores editable records locally in the browser using the `greenfarm.v2` and `greenfarm.advanced.v1` LocalStorage stores. No account or cloud database is required for the current academic version.

Back up important data before clearing browser storage or changing devices.

## 🚀 GitHub Pages

The project is deployed from the `main` branch using GitHub Pages.

## 🎓 Academic Use

Designed as a TNAU agriculture-oriented digital farm management project for demonstration, field-record organization and academic presentation.

## 📄 License

Academic/development project. Add an open-source license before public redistribution if required.

---
**GreenFarm** 🌱  
*Smart Digital Farm Management System*
