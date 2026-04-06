import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const AddPrompts = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    category: "Tarot Reading",
    name: "",
    template: `You are a mystical tarot reader.

User Question:
{question}

Selected Cards:
{cards}

Provide a detailed spiritual interpretation and guidance.`,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Prompt Data:", formData);
  };

  return (
    <div className="">
      <main className="container-fluid">
        <div className="page-section">
          <div className="card">
            <div className="card-body">
              <h5 className="mb-4">{t("addPrompts.title")}</h5>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">{t("addPrompts.category")}</label>

                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option>{t("addPrompts.tarotReading")}</option>
                      <option>{t("addPrompts.dreamInterpretation")}</option>
                      <option>{t("addPrompts.coffeeReading")}</option>
                      <option>{t("addPrompts.fortunePrediction")}</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">{t("addPrompts.promptName")}</label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("addPrompts.examplePlaceholder")}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">{t("addPrompts.promptTemplate")}</label>

                    <textarea
                      className="form-control"
                      rows="8"
                      name="template"
                      value={formData.template}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button className="btn btn-primary mt-3" type="submit">
                  <i className="bi bi-save"></i> {t("addPrompts.savePrompt")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddPrompts;
