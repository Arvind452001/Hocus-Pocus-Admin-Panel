import { useEffect, useRef, useState } from "react";
import { getDashboaranalyticsdApi } from "../api/Api";
import { useTranslation } from "react-i18next";

function Dashboard() {
  // old keys kept (for compatibility) but used for new project keywords
  const [stats, setStats] = useState({
    activeUsers: { total: 0, growth: 0 },
    totalReadings: { total: 0, growth: 0 },
    tokensSold: { total: 0, growth: 0 },
    aiRequests: { total: 0, growth: 0 },
  });

  const [readingsLast30Days, setReadingsLast30Days] = useState([]);
  const [readingsByCategory, setReadingsByCategory] = useState([]);
  const [recentUsers, setRecentUsers] = useState();
  // console.log("recentUsers",recentUsers);
  /* ================= CHART REFS ================= */

  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const donutChartInstance = useRef(null);

   const { t } = useTranslation(); 
  /* ================= FETCH DASHBOARD ANALYTICS ================= */

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getDashboaranalyticsdApi();

        // console.log(res.data.stats);

        const data = res?.data?.stats || {};
        setReadingsLast30Days(data?.readings_last_30_days || []);
        setReadingsByCategory(data?.readings_by_category || []);

        setStats({
          activeUsers: {
            total: data.active_users_7d || 0,
            growth: 12,
          },

          totalReadings: {
            total: data.total_readings || 0,
            growth: 12,
          },

          tokensSold: {
            total: data.total_tokens_circulation || 0,
            growth: 12,
          },

          aiRequests: {
            total: data.total_support_messages || 0,
            growth: 12,
          },
        });
        setRecentUsers(data?.top_readers);
      } catch (error) {
        console.error("Dashboard analytics fetch failed:", error);
      }
    };

    fetchDashboardData();
  }, []);

  /* ================= BAR CHART ================= */

  useEffect(() => {
    if (typeof Chart === "undefined") return;
    if (!barChartRef.current) return;

    if (barChartRef.current.chart) {
      barChartRef.current.chart.destroy();
    }

    barChartRef.current.chart = new Chart(barChartRef.current, {
      type: "bar",

      data: {
        labels: readingsLast30Days.map((i) => i.date),
        datasets: [
          {
            label: "Readings",
            data: readingsLast30Days.map((i) => i.count),
            backgroundColor: "#bd00da",
            borderRadius: 8,
          },
        ],
      },

      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [readingsLast30Days]);

  /* ================= DONUT CHART ================= */

  useEffect(() => {
    if (!donutChartRef.current) return;

    if (donutChartInstance.current) {
      donutChartInstance.current.destroy();
    }

    donutChartInstance.current = new Chart(donutChartRef.current, {
      type: "doughnut",

      data: {
        labels: readingsByCategory.map((i) => i.category),
        datasets: [
          {
            data: readingsByCategory.map((i) => i.count),
            backgroundColor: ["#39ab71", "#00305c", "#d4a5b4", "#bd00da"],
            borderWidth: 0,
          },
        ],
      },

      options: {
        maintainAspectRatio: false,
        cutout: "70%",
      },
    });
  }, [readingsByCategory]);

  /* ================= UI ================= */

  return (
    <main className="container-fluid mr-4">
      {/* ================= STATS ================= */}

      <div className="row g-3 mb-3">
        <StatBox
          title={t("dashboard.activeUser")}
          value={stats.activeUsers.total}
          growth={stats.activeUsers.growth}
        />

        <StatBox
          title={t("dashboard.totalReadings")}
          value={stats.totalReadings.total}
          growth={stats.totalReadings.growth}
        />

        <StatBox
          title={t("dashboard.tokensSold")}
          value={stats.tokensSold.total}
          growth={stats.tokensSold.growth}
        />

        <StatBox
          title={t("dashboard.aiRequests")}
          value={stats.aiRequests.total}
          growth={stats.aiRequests.growth}
        />
      </div>

      {/* ================= CHARTS ================= */}

      <div className="row g-3 mb-3">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">{t("dashboard.tokenSales")}</h5>

              <div style={{ height: "320px" }}>
                <canvas ref={barChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">{t("dashboard.readingTypes")}</h5>

              <div style={{ height: "320px" }}>
                <canvas ref={donutChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECENT USERS TABLE ================= */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-12">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h5 className="card-title mb-0">{t("dashboard.recentUsers")}</h5>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>{t("dashboard.id")}</th>
                      <th>{t("dashboard.user")}</th>
                      <th>{t("dashboard.email")}</th>
                      <th>{t("dashboard.totalReadings")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentUsers?.map((user) => (
                      <tr key={user.user_id}>
                        <td>{user.user_id}</td>

                        <td className="d-flex align-items-center">
                          {/* <img
                            className="avatar me-2"
                            src={`https://i.pravatar.cc/40?u=${user.user_id}`}
                            alt="user"
                          /> */}

                          <span className="fw-semibold">{user.full_name}</span>
                        </td>

                        <td>{user.email}</td>

                        <td>
                          <span className="badge bg-primary">
                            {user.reading_count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ================= STAT BOX ================= */

const StatBox = ({ title, value, growth, color, icon }) => {
    const { t } = useTranslation(); 
  const isPositive = growth >= 0;

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div
        style={{
          background: color,
          padding: "18px 20px",
          borderRadius: "14px",
          color: "#000",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "120px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <div>
          <h6 style={{ marginBottom: "6px", fontWeight: 600 }}>{title}</h6>

          <h3 style={{ margin: 0, fontWeight: 700 }}>{value}</h3>

          <small
            style={{
              opacity: 0.9,
              color: isPositive ? "#B2BEB5" : "#fee2e2",
            }}
          >
            {isPositive ? `▲ 12% ${t("dashboard.fromLastMonth")}` : `▼ ${Math.abs(growth)}% ${t("dashboard.fromLastMonth")}`}
          </small>
        </div>

        <div
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            background: "#bd00da",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
          }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
