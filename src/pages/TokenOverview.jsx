import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  cleanupExpiredTokensApi,
  getTokensOverviewApi,
} from "../api/TokenAPIs";

const TokenOverview = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cleaning, setCleaning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await getTokensOverviewApi();
      if (res?.data) {
        setData(res.data);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanupExpired = async () => {
    try {
      setCleaning(true);
      await cleanupExpiredTokensApi();
      alert(t("tokenOverview.expiredTokensCleaned"));
      await fetchData();
    } catch (err) {
      console.error(err);
      alert(t("tokenOverview.cleanupFailed") || "Cleanup failed");
    } finally {
      setCleaning(false);
    }
  };

  const overview = data?.overview || {
    total_tokens_in_circulation: 0,
    users_with_tokens: 0,
    users_with_no_tokens: 0,
    expired_token_records: 0,
  };
  const topTokenHolders = data?.top_token_holders || [];

  const filteredUsers = topTokenHolders.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4">
      {/* ===== CARDS – always visible, numbers ya dash ===== */}
      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h6 className="text-muted">{t("tokenOverview.totalTokens")}</h6>
            <h4>{error ? "—" : overview.total_tokens_in_circulation}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h6 className="text-muted">{t("tokenOverview.usersWithTokens")}</h6>
            <h4>{error ? "—" : overview.users_with_tokens}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h6 className="text-muted">{t("tokenOverview.noTokens")}</h6>
            <h4>{error ? "—" : overview.users_with_no_tokens}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h6 className="text-muted mb-0">{t("tokenOverview.expired")}</h6>
              <h4 className="mb-0">{error ? "—" : overview.expired_token_records}</h4>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleCleanupExpired}
                disabled={cleaning || loading}
              >
                {cleaning
                  ? t("tokenOverview.cleaning") || "Cleaning..."
                  : t("tokenOverview.cleanupExpiredTokens")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABLE SECTION – headers always visible ===== */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <h5 className="mb-0">{t("tokenOverview.topTokenHolders")}</h5>
            <div style={{ width: "300px" }}>
              <input
                type="text"
                className="form-control"
                placeholder={t("tokenOverview.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>{t("tokenOverview.name")}</th>
                  <th>{t("tokenOverview.email")}</th>
                  <th>{t("tokenOverview.tokens")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2" />
                      {t("tokenOverview.loading")}
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="text-center text-danger py-4">
                      {t("tokenOverview.errorLoading") || "Failed to load data"}
                      <button className="btn btn-sm btn-link ms-2" onClick={fetchData}>
                        {t("tokenOverview.retry") || "Retry"}
                      </button>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      {search
                        ? t("tokenOverview.noSearchResults") || "No users match your search."
                        : t("tokenOverview.noDataFound")}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user.user_id}>
                      <td>{index + 1}</td>
                      <td>{user.full_name || "—"}</td>
                      <td>{user.email || "—"}</td>
                      <td>
                        <span className="badge bg-primary fs-6 px-3 py-2">
                          {user.tokens ?? 0}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenOverview;