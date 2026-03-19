import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { cleanupExpiredTokensApi, getTokensOverviewApi } from "../api/TokenAPIs";

const TokenOverview = () => {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

///////==========================///////
  useEffect(() => {
    fetchData();
  }, []);

///////==========================///////
  const fetchData = async () => {
    try {
      const res = await getTokensOverviewApi();
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data) return <div>Loading...</div>;

  const { overview, top_token_holders } = data;

  const filteredUsers = top_token_holders.filter(
    (user) =>
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );
///////==========================///////
  const handleCleanupExpired = async () => {
  try {
    await cleanupExpiredTokensApi()
    alert("Expired tokens cleaned")

    // refresh data
    fetchData()
  } catch (err) {
    console.log(err)
  }
}
  return (
    <div className="admin-app">
      <Sidebar />

      <div className="content">
        <Header title="Token Overview" />

        <main className="container-fluid mt-4">
          {/* ===== OVERVIEW CARDS ===== */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card p-3 text-center">
                <h6>Total Tokens</h6>
                <h4>{overview.total_tokens_in_circulation}</h4>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card p-3 text-center">
                <h6>Users With Tokens</h6>
                <h4>{overview.users_with_tokens}</h4>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card p-3 text-center">
                <h6>No Tokens</h6>
                <h4>{overview.users_with_no_tokens}</h4>
              </div>
            </div>

            <div className="col-md-3">
           <div className="card p-3 text-center">
  
  {/* ===== TITLE + VALUE (SAME LINE) ===== */}
  <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
    <h6 className="mb-0 text-muted">Expired</h6>
    <h4 className="mb-0">{overview.expired_token_records}</h4>
  </div>

  {/* ===== BUTTON ===== */}
<button
  className="btn btn-outline-danger"
  style={{ padding: "2px 6px", fontSize: "12px" }}
  onClick={handleCleanupExpired}
>
  Cleanup expired token
</button>

</div>
              
            </div>
          </div>

          {/* ===== TABLE ===== */}
          <div className="card">
            <div className="card">
              <div className="card-body">
                {/* ===== TITLE + SEARCH (SAME LINE) ===== */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Top Token Holders</h5>

                  <div style={{ width: "300px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* ===== TABLE ===== */}
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Tokens</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                          <tr key={user.user_id}>
                            <td>{index + 1}</td>
                            <td>{user.full_name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className="badge bg-primary">
                                {user.tokens}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No data found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TokenOverview;
