// app.js

const APP_URL = "http://localhost:8080"; // backend URL
let currentUser = { name: 'Guest' }; // placeholder since no auth
let isSidebarCollapsed = false;
let currentScreen = 'dashboard';

// Loader functions
function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}
function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

// Centralized API request function
async function apiRequest(endpoint, options = {}) {
    try {
        const res = await fetch(`${APP_URL}${endpoint}`, {
            credentials: 'include',
            ...options
        });
        return await res.json();
    } catch (err) {
        console.error(`API request failed for ${endpoint}:`, err);
        return {};
    }
}

// Initialize app after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        showApp();
        loadDashboardStats();
    } catch (err) {
        console.error("App initialization failed:", err);
    }

    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('open');
        document.getElementById('sidebarOverlay').style.display = 'block';
        document.body.classList.add('sidebar-open');
    });

    // Optional: close sidebar on Esc key
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSidebar();
    });
});

// Language switching
function switchLanguage(lang) {
    document.querySelectorAll('[lang]').forEach(el => {
        el.classList.toggle('hidden', el.lang !== lang);
    });
}

// Navigation
function showScreen(screenId) {
    currentScreen = screenId;
    document.querySelectorAll('#app > div').forEach(el => {
        el.classList.toggle('hidden', el.id !== screenId);
    });

    const titles = {
        'dashboard': { en: 'Dashboard', np: 'ड्यासबोर्ड' },
        'addCadet': { en: 'Add Cadet', np: 'क्याडेट थप्नुहोस्' },
        'viewCadets': { en: 'View Cadets', np: 'क्याडेट सूची' },
        'schoolManagement': { en: 'School Management', np: 'विद्यालय व्यवस्थापन' },
        'reports': { en: 'Reports', np: 'रिपोर्टहरू' },
        'settings': { en: 'Settings', np: 'सेटिङहरू' },
        'messages': { en: 'Messages', np: 'सन्देशहरू' },
        'meet': { en: 'Meet', np: 'बैठक' }
    };

    const titleEl = document.getElementById('screenTitle');
    if (titleEl) {
        titleEl.textContent = titles[screenId].en;
        if (titleEl.nextElementSibling) {
            titleEl.nextElementSibling.textContent = titles[screenId].np;
        }
    }

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="showScreen('${screenId}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    document.getElementById('sidebar').classList.remove('open');

    // Load screen-specific data
    if (screenId === 'viewCadets') loadCadetTable();
    if (screenId === 'messages') initChat();
    if (screenId === 'meet') initMeeting();
    if (screenId === 'reports') {
        initReports();
        document.querySelectorAll('#reports .report-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('overview-section')?.classList.add('active');
    }
}

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const app = document.getElementById('app');
    isSidebarCollapsed = !isSidebarCollapsed;

    if (isSidebarCollapsed) {
        sidebar.classList.add('sidebar-collapsed', 'w-20');
        sidebar.classList.remove('w-64');
        app.classList.replace('ml-64', 'ml-20');
        sidebar.querySelector('.text-lg')?.classList.add('hidden');
        sidebar.querySelectorAll('.nav-text, .lang-text, .logout-text')
            .forEach(el => el.classList.add('hidden'));
        sidebar.querySelectorAll('.lang-btn, .logout-btn')
            .forEach(el => el.classList.add('justify-center'));
        sidebar.querySelector('.sidebar-footer')?.classList.add('items-center');
        document.getElementById('sidebarToggle').innerHTML = '<i class="fas fa-chevron-right"></i>';
    } else {
        sidebar.classList.remove('sidebar-collapsed', 'w-20');
        sidebar.classList.add('w-64');
        app.classList.replace('ml-20', 'ml-64');
        sidebar.querySelector('.text-lg')?.classList.remove('hidden');
        sidebar.querySelectorAll('.nav-text, .lang-text, .logout-text')
            .forEach(el => el.classList.remove('hidden'));
        sidebar.querySelectorAll('.lang-btn, .logout-btn')
            .forEach(el => el.classList.remove('justify-center'));
        sidebar.querySelector('.sidebar-footer')?.classList.remove('items-center');
        document.getElementById('sidebarToggle').innerHTML = '<i class="fas fa-chevron-left"></i>';
    }
}

// Logout (without auth)
function logout() {
    window.location.href = "../../index.html";
}

// // Dashboard stats
// async function loadDashboardStats() {
//     showLoader();
//     try {
//         const result = await apiRequest('/api/stats'); // adjust endpoint as needed
//         if (result.success) {
//             document.getElementById('totalCadets').textContent = result.stats.total;
//             document.getElementById('maleCadets').textContent = result.stats.male;
//             document.getElementById('femaleCadets').textContent = result.stats.female;
//         }
//     } catch (error) {
//         console.error('Error loading stats:', error);
//     }
//     hideLoader();
// }

// App init
function showApp() {
    document.getElementById('appContainer').classList.remove('hidden');

    // Set greeting
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) greetingEl.textContent = `Welcome to the system, ${currentUser.name}`;

    switchLanguage('en');
    showScreen('dashboard');
}

// Close sidebar
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').style.display = 'none';
    document.body.classList.remove('sidebar-open');
}

// Placeholder functions for other modules
function loadCadetTable() { console.log("Load cadet table"); }
function initChat() { console.log("Init chat module"); }
function initMeeting() { console.log("Init meeting module"); }
function initReports() { console.log("Init reports module"); }
