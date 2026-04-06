import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL_CARD } from "../config/apiConfig";
  import { useRef } from "react";
import { useTranslation } from "react-i18next";



const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL_CARD}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data.profile);
      setFormData(res.data.profile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= UPDATE PROFILE ================= */

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await axios.put(`${BASE_URL_CARD}/api/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully ✅");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const form = new FormData();
    form.append("file", file);

    try {
      await axios.post(`${BASE_URL_CARD}/api/profile/upload-picture`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOADING ================= */

  if (loading && !profile) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" />
      </div>
    );
  }

  if (!formData) return null;

  return (
   <div className="container mt-4">
  <div
    className="card p-4"
    style={{
      borderRadius: "12px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
    }}
  >
    {/* HEADER */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4 className="mb-0">{t("profile.title")}</h4>

      {/* STATUS (TOP RIGHT) */}
      <span
        className="badge"
        style={{
          background: formData.profile_completed ? "green" : "orange",
          padding: "6px 12px",
          fontSize: "12px",
        }}
      >
        {formData.profile_completed
  ? t("profile.profileCompleted")
  : t("profile.incomplete")}
      </span>
    </div>

    {/* IMAGE */}
<div
  className="mb-4"
  style={{
    display: "flex",
    justifyContent: "center",
  }}
>
  <div style={{ position: "relative", width: "100px", height: "100px" }}>
    
    {/* PROFILE IMAGE */}
    <img
      src={
        imagePreview ||
        (formData.profile_picture
          ? `${BASE_URL_CARD}${formData.profile_picture}`
          : `https://ui-avatars.com/api/?name=${formData.full_name}`)
      }
      alt="profile"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid rgb(189, 0, 218)",
      }}
    />

    {/* CAMERA ICON */}
    {editMode && (
      <>
        <div
          onClick={() => fileInputRef.current.click()}
          style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgb(189, 0, 218)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "2px solid #fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <i
            className="bi bi-camera-fill"
            style={{ color: "#fff", fontSize: "14px" }}
          ></i>
        </div>

        {/* HIDDEN INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </>
    )}
  </div>
</div>

    {/* FORM */}
    <div className="row g-3">
      <div className="col-md-6">
        <label>{t("profile.email")}</label>
        <input className="form-control" value={formData.email} disabled />
      </div>

      <div className="col-md-6">
        <label>{t("profile.fullName")}</label>
        <input
          name="full_name"
          className="form-control"
          value={formData.full_name || ""}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="col-md-6">
        <label>{t("profile.dateOfBirth")}</label>
        <input
          type="date"
          name="date_of_birth"
          className="form-control"
          value={(formData.date_of_birth || "").split("T")[0]}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="col-md-6">
        <label>{t("profile.zodiacSign")}</label>
        <input
          name="zodiac_sign"
          className="form-control"
          value={formData.zodiac_sign || ""}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="col-md-6">
        <label>{t("profile.gender")}</label>
        <select
          name="gender"
          className="form-select"
          value={formData.gender || ""}
          onChange={handleChange}
          disabled={!editMode}
        >
          <option value="male">{t("profile.male")}</option>
          <option value="female">{t("profile.female")}</option>
        </select>
      </div>

      <div className="col-md-6">
        <label>{t("profile.relationship")}</label>
        <select
          name="relationship_status"
          className="form-select"
          value={formData.relationship_status || ""}
          onChange={handleChange}
          disabled={!editMode}
        >
          <option value="single">{t("profile.single")}</option>
          <option value="married">{t("profile.married")}</option>
        </select>
      </div>
    </div>

    {/* BUTTON (BOTTOM RIGHT) */}
    <div className="d-flex justify-content-end mt-4">
      {!editMode ? (
        <button
          className="btn btn-md"
          style={{ background: "rgb(0, 62, 218)", color: "#fff" }}
          onClick={() => setEditMode(true)}
        >
          {t("profile.edit")}
        </button>
      ) : (
        <button
          className="btn btn-md"
          style={{ background: "rgb(189, 0, 218)", color: "#fff" }}
          onClick={handleUpdate}
        >
          {t("profile.save")}
        </button>
      )}
    </div>
  </div>
</div>
  );
};

export default ProfilePage;