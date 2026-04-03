import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { getUserDetailsApi, makeAdminApi, removeAdminApi } from "../api/Api";
import {
  addTokensApi,
  deductTokensApi,
  extendTokenExpiryApi,
  resetTokensApi,
} from "../api/TokenAPIs";
import { useTranslation } from "react-i18next";

const UserDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState(1);
  const [days, setDays] = useState(1);

   const { t } = useTranslation(); 
  useEffect(() => {
    fetchUser();
  }, []);

  const handleAdminToggle = async () => {
    try {
      if (user.is_admin) {
        await removeAdminApi(user.id);
      } else {
        await makeAdminApi(user.id);
      }

      // update UI instantly
      setData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          is_admin: !prev.user.is_admin,
        },
      }));
    } catch (error) {
      console.error("Admin update failed", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await getUserDetailsApi(id);
      setData(res?.data);
    } catch (error) {
      console.error("User fetch failed", error);
    }
  };

  if (!data) return <div>{t("userDetails.loading")}</div>;

  const { user, token_info, profile, settings, activity } = data;

  const handleTokenAction = async (type) => {
    try {
      let res;

      if (type === "add") {
        res = await addTokensApi(id, amount);
      } else {
        res = await deductTokensApi(id, amount);
      }

      console.log("Success", res.data);

      // update UI
      setData((prev) => ({
        ...prev,
        token_info: {
          ...prev.token_info,
          balance:
            type === "add"
              ? prev.token_info.balance + Number(amount)
              : prev.token_info.balance - Number(amount),
        },
      }));
    } catch (err) {
      console.log("Error", err?.response?.data || err.message);
    }
  };

  const handleResetTokens = async () => {
    try {
      await resetTokensApi(id);

      // UI update
      setData((prev) => ({
        ...prev,
        token_info: {
          ...prev.token_info,
          // balance: 0,
        },
      }));
      fetchUser();
      alert("Token Reset Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleExtendExpiry = async () => {
    try {
      await extendTokenExpiryApi(id, days);

      // optional: refetch for correct expiry
      fetchUser();
      alert("Extended Expiry Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="container-fluid mr-4">
      {/* ================= PROFILE HEADER ================= */}

      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-3">
          <img
            src={
              profile?.profile_picture
                ? `https://python.aitechnotech.in/hocuspocus${profile.profile_picture}`
                : "https://i.pravatar.cc/70"
            }
            alt="user"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <div>
            <h5 className="mb-1">{user.full_name}</h5>

            <div className="text-muted">{user.email}</div>

            <div className="mt-1">
              {user.is_verified && (
                <span className="badge bg-success me-2">{t("userDetails.verified")}</span>
              )}

              {user.is_active ? (
                <span className="badge bg-primary me-2">{t("userDetails.active")}</span>
              ) : (
                <span className="badge bg-danger">{t("userDetails.inactive")}</span>
              )}

              {user.is_admin && <span className="badge bg-dark">{t("userDetails.admin")}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ================= ROLE & PERMISSIONS ================= */}

      <div className="card mb-3">
        <div className="card-body">
          <h6 className="mb-3">{t("userDetails.rolePermissions")}</h6>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{t("userDetails.adminAccess")}</strong>

              <p className="text-muted mb-0">
                {t("userDetails.adminAccessDesc")}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <p className=" mb-0">{t("userDetails.createAdmin")}</p>

              <input
                className="form-check-input m-0"
                type="checkbox"
                checked={user.is_admin}
                onChange={handleAdminToggle}
              />
            </div>
          </div>
        </div>
      </div>
      {/* ================= BASIC INFO ================= */}

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-3">{t("userDetails.basicInfo")}</h6>

              <p>
                <strong><strong>{t("userDetails.gender")}:</strong></strong> {user.gender}
              </p>
              <p>
                <strong>{t("userDetails.dob")}:</strong> {user.date_of_birth}
              </p>
              <p>
                <strong>{t("userDetails.zodiac")}:</strong> {user.zodiac_sign}
              </p>
              <p>
                <strong>{t("userDetails.relationship")}:</strong> {user.relationship_status}
              </p>
              <p>
                <strong>{t("userDetails.joined")}:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* ================= TOKEN INFO ================= */}

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-3">{t("userDetails.tokenInfo")}</h6>

              {/* ===== BALANCE + RESET ===== */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0">
                  <strong>{t("userDetails.balance")}:</strong> {token_info.balance}
                </p>

                <button
                  className="btn btn-outline-danger"
                  onClick={handleResetTokens}
                >
                  🔄 {t("userDetails.resetTokens")}
                </button>
              </div>

              {/* ===== ADD / REMOVE ===== */}
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="d-flex gap-2 mb-3">
                <button
                  className="btn btn-success w-50"
                  onClick={() => handleTokenAction("add")}
                >
                  ➕ {t("userDetails.add")}
                </button>

                <button
                  className="btn btn-danger w-50"
                  onClick={() => handleTokenAction("deduct")}
                >
                  ➖ {t("userDetails.remove")}
                </button>
              </div>

              {/* ===== EXTEND EXPIRY ===== */}
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control w-75"
                  placeholder="Enter days"
                  value={days}
                  min={1}
                  onChange={(e) => setDays(e.target.value)}
                />

                <button
                  className="btn btn-primary w-25"
                  onClick={handleExtendExpiry}
                >
                  {t("userDetails.extend")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SETTINGS ================= */}

      <div className="card mb-3">
        <div className="card-body">
          <h6 className="mb-3">{t("userDetails.userSettings")}</h6>

          <p>
            <strong>{t("userDetails.language")}:</strong> {settings.language}
          </p>

          <p>
            <strong>{t("userDetails.notifications")}:</strong>
            {settings.notifications_enabled ? " " + t("userDetails.enabled") : " " + t("userDetails.disabled")}
          </p>

          <p>
            <strong>{t("userDetails.sound")}:</strong>
            {settings.sound_enabled ? " " + t("userDetails.enabled") : " " + t("userDetails.disabled")}
          </p>
        </div>
      </div>

      {/* ================= ACTIVITY ================= */}

      {/* <div className="row g-3 mb-3">

<div className="col-md-4">

<div className="card text-center p-3">
<h6>Total Readings</h6>
<h3>{activity.total_readings}</h3>
</div>

</div>

<div className="col-md-4">

<div className="card text-center p-3">
<h6>Total Dreams</h6>
<h3>{activity.total_dreams}</h3>
</div>

</div>

</div> */}

      {/* ================= READINGS BY CATEGORY ================= */}

      <div className="card mb-3">
        <div className="card-body">
          <h6 className="mb-3">{t("userDetails.readingsByCategory")}</h6>

          <ul className="list-group">
            {activity.readings_by_category.map((c, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between"
              >
                {c.category}
                <span className="badge bg-primary">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= RECENT READINGS ================= */}

      <div className="card">
        <div className="card-body">
          <h6 className="mb-3">{t("userDetails.recentReadings")}</h6>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                 <th>{t("userDetails.id")}</th>
<th>{t("userDetails.question")}</th>
<th>{t("userDetails.date")}</th>
                </tr>
              </thead>

              <tbody>
                {activity.recent_readings.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.question}</td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserDetails;
