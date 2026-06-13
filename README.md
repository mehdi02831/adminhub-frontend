# AdminHub — Admin Dashboard Frontend

A high-fidelity admin dashboard built with Vue.js 3, featuring real-time charts, user management, and a clean dark sidebar design.

## Tech Stack
- Vue.js 3 (Composition API)
- Vite
- Pinia (state management)
- Vue Router 4
- Chart.js + vue-chartjs
- Axios

## Features
- 📊 Dashboard with doughnut and bar charts
- 👥 Full user CRUD (create, edit, delete)
- 🔍 Search and filter by name, email, role, status
- 🏷️ Role badges (admin/user) and status badges (active/inactive)
- 📅 Formatted dates
- ⚡ Loading states and error handling
- 🎨 Dark sidebar + light content area design

## Project Structure
src/

├── router/index.js

├── stores/userStore.js

├── views/

│   ├── Dashboard.vue

│   └── Users.vue

├── components/

│   ├── Sidebar.vue

│   ├── StatsCard.vue

│   ├── UserTable.vue

│   └── UserModal.vue

└── App.vue

## Run Locally

```bash
# Install dependencies
npm install

# Start mock API server
npm run mock

# Start dev server (in separate terminal)
npm run dev
```

Open `http://localhost:5173`

## Connect to Real Backend
Update the base URL in `src/stores/userStore.js`:
```js
const API_URL = "http://localhost:8000"
```

## Live Demo
[adminhub.netlify.app](https://adminhub.netlify.app)
