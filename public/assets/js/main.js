import { Chart } from "@/components/ui/chart"
import simpleDatatables from 'simple-datatables' // Declare the simpleDatatables variable

(function () {
  // Wait for DOM to be fully ready
  function initializeAdmin() {
    const adminApp = document.querySelector('.admin-app')
    const toggleBtn = document.getElementById('toggleBtn')
    const sidebar = document.getElementById('sidebar')

    if (!adminApp || !toggleBtn || !sidebar) {
      // Try again if elements not found yet
      setTimeout(initializeAdmin, 100)
      return
    }

    attachEventListeners(adminApp, toggleBtn, sidebar)
  }

  function attachEventListeners(adminApp, toggleBtn, sidebar) {
    // Toggle collapsed / expanded sidebar for wide screens
    toggleBtn.addEventListener('click', function () {
      if (window.innerWidth >= 992) {
        // On wide screens hide the sidebar entirely (toggle)
        const hidden = adminApp.classList.toggle('sidebar-hidden')
        try {
          localStorage.setItem('cv_admin_sidebar_hidden', hidden ? '1' : '0')
        } catch (e) {}
        // ensure no horizontal scroll while hidden
        document.body.style.overflowX = hidden ? 'hidden' : ''
      } else {
        // On small screens, toggle sidebar open state
        adminApp.classList.toggle('sidebar-open')
        document.body.classList.toggle('admin-overlay')
      }
    })

    // Close sidebar when clicking outside on small screens
    document.addEventListener('click', function (e) {
      if (window.innerWidth < 992) {
        if (
          !sidebar.contains(e.target) &&
          !toggleBtn.contains(e.target) &&
          adminApp.classList.contains('sidebar-open')
        ) {
          adminApp.classList.remove('sidebar-open')
          document.body.classList.remove('admin-overlay')
        }
      }
    })

    // Close overlay on resize if necessary
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 992) {
        adminApp.classList.remove('sidebar-open')
        document.body.classList.remove('admin-overlay')
      }
    })

    // Highlight active link in sidebar
    markActiveLink()

    // Initialize charts
    initCharts()

    // Initialize DataTables
    initDataTables()

    // Restore sidebar state from localStorage on load
    restoreSidebarState(adminApp)
  }

  function markActiveLink() {
    const links = document.querySelectorAll('.sidebar .nav-link')
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase()
    links.forEach(l => {
      try {
        const href = (l.getAttribute('href') || '').split('/').pop().toLowerCase()
        if (href === current || (href === 'index.html' && (current === '' || current === 'index.html'))) {
          l.classList.add('active')
        }
      } catch (e) {}
    })
  }

  // Init Chart.js if canvas present
  function initCharts() {
    // Combined Bar Chart - Student & Teacher Performance
    const barCanvas = document.getElementById('barChart')
    if (barCanvas && typeof Chart !== 'undefined' && !barCanvas.dataset.chartInit) {
      const barCtx = barCanvas.getContext('2d')
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Mathematics', 'Science', 'English'],
          datasets: [
            {
              label: 'Students',
              data: [420, 560, 380],
              backgroundColor: '#651d32',
              borderColor: '#651d32',
              borderWidth: 1,
              borderRadius: 8,
              barPercentage: 0.7,
            },
            {
              label: 'Teachers',
              data: [42, 38, 35],
              backgroundColor: '#00305c',
              borderColor: '#00305c',
              borderWidth: 1,
              borderRadius: 8,
              barPercentage: 0.7,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              padding: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(0,0,0,0.8)',
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.05)' },
            },
            y: { grid: { display: false } },
          },
        },
      })
      barCanvas.dataset.chartInit = '1'
    }

    // Donut Chart
    const donutCanvas = document.getElementById('donutChart')
    if (donutCanvas && typeof Chart !== 'undefined' && !donutCanvas.dataset.chartInit) {
      const donutCtx = donutCanvas.getContext('2d')
      new Chart(donutCtx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'In Progress', 'Not Started'],
          datasets: [
            {
              data: [65, 25, 10],
              backgroundColor: ['#39ab71', '#00305c', '#d4a5b4'],
              borderColor: '#ffffff',
              borderWidth: 3,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', padding: 20 },
            tooltip: {
              padding: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(0,0,0,0.8)',
            },
          },
        },
      })
      donutCanvas.dataset.chartInit = '1'
    }
  }

  // Initialize DataTables (Simple-DataTables) for tables with class `datatable`
  function initDataTables() {
    try {
      if (typeof simpleDatatables === 'undefined' || !simpleDatatables.DataTable) return
      const tables = document.querySelectorAll('table.datatable')
      tables.forEach(t => {
        try {
          // prevent double-init
          if (t.dataset.dtInit) return
          new simpleDatatables.DataTable(t, {
            searchable: true,
            fixedHeight: false,
            perPage: 10,
            labels: {
              placeholder: 'Search...',
              perPage: '{select} entries per page',
            },
            noRowsLabel: 'No records found',
          })
          t.dataset.dtInit = '1'
        } catch (e) {
          /* ignore per-table errors */
        }
      })
    } catch (e) {
      /* ignore */
    }
  }

  // Restore sidebar state from localStorage on load
  function restoreSidebarState(adminApp) {
    try {
      const val = localStorage.getItem('cv_admin_sidebar_hidden')
      if (val === '1') {
        adminApp.classList.add('sidebar-hidden')
        // ensure body overflow hidden while sidebar hidden
        document.body.style.overflowX = 'hidden'
      } else {
        adminApp.classList.remove('sidebar-hidden')
        document.body.style.overflowX = ''
      }
    } catch (e) {}
  }

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdmin)
  } else {
    initializeAdmin()
  }
})()
