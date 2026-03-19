function SubscriptionAnalytics({ data }) {
  const { subscriptions, revenue } = data;

  return (
    <div className="card mt-4 mb-4">
      <div className="card-body">
        <h5 style={{ color: "#651d32", fontWeight: 600 }}>
          Subscription Analytics
        </h5>

        {/* ===== TOP STATS ===== */}
        <div className="row g-3 mt-3">
          <Stat
            title="Total Subscriptions"
            value={subscriptions.total}
            bg="rgb(101, 29, 50)"
          />
          <Stat
            title="Active"
            value={subscriptions.active}
            bg="rgb(34, 139, 87)"
          />
          <Stat
            title="Cancelled"
            value={subscriptions.cancelled}
            bg="rgb(178, 34, 34)"
          />
          <Stat
            title="Total Revenue"
            value={`₹ ${revenue.totalRevenue}`}
            bg="rgb(33, 37, 41)"
          />
        </div>

        {/* ===== STATUS BAR ===== */}
        {/* <div className="mt-4">
          <h6 style={{ fontWeight: 600 }}>Status Breakdown</h6>
          <div
            className="progress"
            style={{
              height: "10px",
              backgroundColor: "#e0e0e0",
              borderRadius: "6px",
            }}
          >
            <div
              className="progress-bar"
              style={{
                width: `${
                  (subscriptions.active / subscriptions.total) * 100 || 0
                }%`,
                backgroundColor: "#651d32",
              }}
            />
          </div>
          <small className="text-muted">
            Active {subscriptions.active} / {subscriptions.total}
          </small>
        </div> */}

        {/* ===== REVENUE TABLE ===== */}
        {/* <div className="mt-4">
          <h6 style={{ fontWeight: 600 }}>Revenue by Plan</h6>

          {revenue.revenueByPlan.length === 0 ? (
            <p className="text-muted mt-2">
              No revenue data available
            </p>
          ) : (
            <table className="table mt-2">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenue.revenueByPlan.map((plan, i) => (
                  <tr key={i}>
                    <td>{plan.name}</td>
                    <td>₹ {plan.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div> */}
      </div>
    </div>
  );
}

/* ===== BOLD STAT CARD ===== */
const Stat = ({ title, value, bg }) => (
  <div className="col-12 col-sm-6 col-lg-3">
    <div
      style={{
        background: bg,
        borderRadius: "14px",
        padding: "20px",
        color: "#fff",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        marginBottom: "12px",
      }}
    >
      <h6
        style={{
          marginBottom: "6px",
          opacity: 0.9,
        }}
      >
        {title}
      </h6>
      <h2 style={{ margin: 0, fontWeight: 700 }}>
        {value}
      </h2>
    </div>
  </div>
);

export default SubscriptionAnalytics;
