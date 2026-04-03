import React, { useEffect, useState } from "react";
import {
  blockUserApi,
  deleteUserApi,
  getUsersApi,
  unblockUserApi,
} from "../api/Api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Users = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ✅ NEW STATES
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // console.log("users", users);
    const { t } = useTranslation(); 
  const navigate = useNavigate();
  /* ================= FETCH USERS ================= */
  // console.log("user",users)
  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getUsersApi({
        page,
        limit,
        sort_by: "newest",
      });

      console.log(res?.data?.users);

      const data = res?.data?.users || [];
      setUsers(data);
    } catch (err) {
      console.error("Users fetch failed", err);

      // ✅ ERROR HANDLING
      if (!err.response) {
        setError("🚫 Server Down. Please try again later.");
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.detail ||
            "Something went wrong",
        );
      }

      setUsers([]); // clear data
    } finally {
      setLoading(false);
    }
  };
  //////////////========Toggle==========//////////////
  const handleToggleUser = async (user) => {
    try {
      if (user.blocked) {
        await unblockUserApi(user.id);
      } else {
        await blockUserApi(user.id);
      }

      // update only this user
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, blocked: !u.blocked } : u,
        ),
      );
    } catch (error) {
      console.error("User status update failed", error);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      await deleteUserApi(id);

      // refresh users list
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };
  /* ================= FILTER USERS ================= */

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "All" ||
      (statusFilter === "Active" && user.is_active) ||
      (statusFilter === "Blocked" && !user.is_active);

    return searchMatch && statusMatch;
  });
  console.log("filteredUsers", filteredUsers);
  return (
    <div className="">
      <main className="container-fluid mr-4">
        <div className="page-section">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">{t("users.users")}</h5>

                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("users.searchUser")}
                    style={{ width: "200px" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <select
                    className="form-select"
                    style={{ width: "100px" }}
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>

                  <select
                    className="form-select"
                    style={{ width: "100px" }}
                    value={page}
                    onChange={(e) => setPage(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((p) => (
                      <option key={p} value={p}>
                        {t("users.page")} {p}
                      </option>
                    ))}
                  </select>

                  <a
                    href="/add-user"
                    className="btn"
                    style={{ backgroundColor: "#bd00da", color: "#fff" }}
                  >
                    {t("users.addUser")}
                  </a>
                </div>
              </div>

              {/* ================= USERS TABLE ================= */}

              <div className="table-responsive">
                <table className="table datatable">
                  <thead>
                    <tr>
                      <th>{t("users.user")}</th>
                      <th>{t("users.email")}</th>
                      <th>{t("users.tokens")}</th>
                      <th>{t("users.status")}</th>
                      <th>{t("users.actions")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* ✅ LOADING */}
                    {loading && (
                      <tr>
                        <td colSpan="5" className="text-center">
                          <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                              <span className="sr-only"></span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* ❌ ERROR */}
                    {!loading && error && (
                      <tr>
                        <td colSpan="5" className="text-center text-danger">
                          {error}
                        </td>
                      </tr>
                    )}

                    {/* ⚠️ NO DATA */}
                    {!loading && !error && filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          {t("users.noUsersFound")}
                        </td>
                      </tr>
                    )}

                    {/* ✅ DATA */}
                    {!loading &&
                      !error &&
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-cell d-flex align-items-center gap-2">
                              <img
                                src={`https://python.aitechnotech.in/hocuspocus${user.profile_picture}`}
                                alt=""
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />

                              <div className="fw-semibold">
                                {user.full_name}
                              </div>
                            </div>
                          </td>

                          <td>{user.email}</td>

                          <td>
                            <span className="badge bg-primary">
                              {user.token_balance || 0}
                            </span>
                          </td>

                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className={`badge ${
                                  user.blocked ? "bg-danger" : "bg-success"
                                }`}
                              >
                                {user.blocked ? "Blocked" : "Active"}
                              </span>

                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={!user.blocked}
                                  onChange={() => handleToggleUser(user)}
                                />
                              </div>
                            </div>
                          </td>

                          <td>
                            <button
                              onClick={() =>
                                navigate(`/userDetails/${user.id}`)
                              }
                              className="btn btn-sm btn-success me-2"
                            >
                              <i className="bi bi-eye-fill"></i>
                            </button>

                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Users;
