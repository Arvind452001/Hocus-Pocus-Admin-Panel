import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  sendBroadcastNotification,
  sendToMultipleUsers,
  sendToUser,
} from "../api/notificationsApi";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader"; // 👈 your loader

const BroadcastNotification = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    notification_type: "",
    save_to_db: true,
    only_with_tokens: false,
  });

  const { id } = useParams();
  const { t } = useTranslation();
  const location = useLocation();
  const userIds = location.state?.userIds || [];
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      title_tr: "",
      body_tr: "",
    };

    try {
      setLoading(true);

      if (userIds.length > 0) {
        await sendToMultipleUsers({
          ...payload,
          user_ids: userIds,
        });
        alert("Successfully sent to selected users");
      } else if (id) {
        await sendToUser({
          ...payload,
          user_id: id,
        });
        alert("Successfully sent to single user");
      } else {
        await sendBroadcastNotification(payload);
        alert("Successfully sent as broadcast");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(t("notification.error"));
    } finally {
      setLoading(false); // ✅ always run
    }
  };

  // ✅ FULL SCREEN LOADER
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loader text ={"Sending notification..."}/>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>
        {userIds.length > 0
          ? `Send to ${userIds.length} users`
          : id
          ? "Send to user"
          : "Broadcast Notification"}
      </h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <input
          type="text"
          name="title"
          placeholder={t("notification.title")}
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <textarea
          name="body"
          placeholder={t("notification.body")}
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <select
          name="notification_type"
          className="form-control mb-3"
          onChange={handleChange}
        >
          <option value="">{t("notification.selectType")}</option>
          <option value="info">Info</option>
          <option value="alert">Alert</option>
          <option value="promo">Promo</option>
        </select>

        <div className="form-check">
          <input
            type="checkbox"
            name="save_to_db"
            checked={formData.save_to_db}
            onChange={handleChange}
            className="form-check-input"
          />
          <label className="form-check-label">
            {t("notification.saveToDb")}
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="only_with_tokens"
            checked={formData.only_with_tokens}
            onChange={handleChange}
            className="form-check-input"
          />
          <label className="form-check-label">
            {t("notification.onlyWithTokens")}
          </label>
        </div>

        <button className="btn btn-primary w-100">
          {userIds.length > 0
            ? `Send to ${userIds.length} users 🚀`
            : id
            ? "Send to user"
            : "Send broadcast"}
        </button>
      </form>
    </div>
  );
};

export default BroadcastNotification;