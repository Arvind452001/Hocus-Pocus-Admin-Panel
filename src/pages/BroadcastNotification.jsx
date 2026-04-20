import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  sendBroadcastNotification,
  sendToMultipleUsers,
  sendToUser,
} from "../api/notificationsApi";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BroadcastNotification = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    title_tr: "",
    body_tr: "",
    notification_type: "",
    data: "",
    save_to_db: true,
    only_with_tokens: false,
  });
  const { id } = useParams(); // 👈 get id
  const { t } = useTranslation();
  const location = useLocation();
  const userIds = location.state?.userIds || [];
  console.log("Received userIds:", userIds); // ✅ debug log

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let parsedData = {};

    try {
      const userData = formData.data ? JSON.parse(formData.data) : {};

      parsedData = {
        additionalProp1: userData,
      };
    } catch (e) {
      alert(t("notification.invalidJson"));
      return;
    }

    try {
      const payload = {
        title: formData.title,
        body: formData.body,
        title_tr: formData.title_tr,
        body_tr: formData.body_tr,
        notification_type: formData.notification_type,
        data: parsedData,
        save_to_db: formData.save_to_db,
        only_with_tokens: formData.only_with_tokens,
      };

      let res;

      // ✅ CASE 1: Multiple users selected
      if (userIds.length > 0) {
        setLoading(true);
        res = await sendToMultipleUsers({
          ...payload,
          user_ids: userIds, // 👈 array भेजो
        });
        setLoading(false);
        alert(t("notification.successMultiple"));
      }

      // ✅ CASE 2: Single user (params id)
      else if (id) {
        setLoading(true);
        res = await sendToUser({
          ...payload,
          user_id: id,
        });
        setLoading(false);
        alert(t("notification.successSingle"));
      }

      // ✅ CASE 3: Broadcast
      else {
        setLoading(true);
        res = await sendBroadcastNotification(payload);
        setLoading(false);
        alert(t("notification.successBroadcast"));
      }

      console.log(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(t("notification.error"));
    }
  };

  return (
    <div className="container mt-4">
      <h3>
        {userIds.length > 0
          ? t("notification.headingMultiple", { count: userIds.length })
          : id
            ? t("notification.headingSingle")
            : t("notification.headingBroadcast")}
      </h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder={t("notification.title")}
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        {/* Body */}
        <textarea
          name="body"
          placeholder={t("notification.body")}
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        {/* Translated Title */}
        <input
          type="text"
          name="title_tr"
          placeholder={t("notification.titleTranslated")}
          className="form-control mb-3"
          onChange={handleChange}
        />

        {/* Translated Body */}
        <textarea
          name="body_tr"
          placeholder={t("notification.bodyTranslated")}
          className="form-control mb-3"
          onChange={handleChange}
        />

        {/* Notification Type */}
        <select
          name="notification_type"
          className="form-control mb-3"
          onChange={handleChange}
        >
          <option value="">{t("notification.selectType")}</option>
          <option value="info">{t("notification.typeInfo")}</option>
          <option value="alert">{t("notification.typeAlert")}</option>
          <option value="promo">{t("notification.typePromo")}</option>
        </select>

        {/* Extra JSON Data */}
        <textarea
          name="data"
          placeholder={`${t("notification.extraData")} (${t("notification.extraDataExample")})`}
          className="form-control mb-3"
          onChange={handleChange}
        />
        {/* Checkboxes */}
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

        {/* Submit */}

        <button className="btn btn-primary w-100" disabled={loading}>
          {userIds.length > 0
            ? `Send to ${userIds.length} users 🚀`
            : id
              ? t("notification.sendUser")
              : t("notification.sendBroadcast")}
        </button>
      </form>
    </div>
  );
};

export default BroadcastNotification;
