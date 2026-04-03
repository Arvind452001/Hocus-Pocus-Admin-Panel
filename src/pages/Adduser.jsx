import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Adduser = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    token: "",
    status: "Active",
    photo: null
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="container-fluid">
      <div className="page-section">
        <div className="card">
          <div className="card-body">

            <h5 className="mb-4">{t("addUser.title")}</h5>

            <form onSubmit={handleSubmit}>
              <div className="row">

                {/* Photo Upload */}
                <div className="col-md-3 text-center mb-4">
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      background: "#f0f0f0",
                      borderRadius: "10px",
                      margin: "0 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden"
                    }}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <i className="bi bi-image" style={{ fontSize: "48px", color: "#ccc" }}></i>
                    )}
                  </div>

                  <div className="mt-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhoto}
                      style={{ display: "none" }}
                      id="photoInput"
                    />

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => document.getElementById("photoInput").click()}
                    >
                      {t("addUser.uploadPhoto")}
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="col-md-9">
                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {t("addUser.fullName")} *
                      </label>

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder={t("addUser.namePlaceholder")}
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {t("addUser.email")} *
                      </label>

                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder={t("addUser.emailPlaceholder")}
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {t("addUser.token")}
                      </label>

                      <input
                        type="number"
                        name="token"
                        className="form-control"
                        placeholder={t("addUser.tokenPlaceholder")}
                        value={formData.token}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {t("addUser.status")}
                      </label>

                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option>{t("addUser.active")}</option>
                        <option>{t("addUser.pending")}</option>
                        <option>{t("addUser.blocked")}</option>
                      </select>
                    </div>

                  </div>
                </div>

              </div>

              <hr />

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-circle"></i>{" "}
                  {t("addUser.addUserBtn")}
                </button>

                <button type="button" className="btn btn-outline-secondary">
                  {t("addUser.cancel")}
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Adduser;