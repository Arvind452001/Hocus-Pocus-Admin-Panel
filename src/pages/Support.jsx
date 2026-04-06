import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// ✅ Dummy API
const submitSupportApi = (data) => {

  return Promise.resolve({ success: true });
};

const Support = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert(t("support.fillRequired"));
      return;
    }

    try {
      setLoading(true);
      const res = await submitSupportApi(formData);
      // console.log(res);
      alert(t("support.requestSuccess"));

      // reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert(t("support.requestError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <main className="container-fluid">
        <div className="page-section">
          <div className="card">
            <div className="card-body">
              {/* Styles */}
              <style>{`
                  .badge-popular{
                    background:#ffc107;
                    color:#000;
                  }
                  .badge-active{
                    background:#198754;
                  }
                  .badge-inactive{
                    background:#dc3545;
                  }
                `}</style>

              <div className="d-flex border-bottom justify-content-between align-items-center mb-3 pb-3">
                <h5 className="mb-0">{t("support.title")}</h5>
              </div>

              <div className="container">
                <p className="mb-3 fw-bold">{t("support.queryHeading")}</p>

                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-0">
                        <label className="form-label">{t("support.yourName")}</label>
                        <input
                          className="form-control"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">{t("support.email")}</label>
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">{t("support.subject")}</label>
                        <input
                          className="form-control"
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">{t("support.message")}</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <button
                        className="btn btn-primary w-100"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? t("support.submitting") : t("support.submitBtn")}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;
