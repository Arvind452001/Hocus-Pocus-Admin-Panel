import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createPromptApi, getPromptsApi, updatePromptApi } from "../api/Api";

const AiPrompts = () => {
  const { t } = useTranslation();
  const [prompts, setPrompts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    template: `You are a mystical tarot reader.

User Question:
{question}

Selected Cards:
{cards}

Provide a detailed spiritual interpretation and guidance.`,
  });

  const [loading, setLoading] = useState(false);

  /* ================= FETCH PROMPTS ================= */

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await getPromptsApi();

      const data = res?.data?.prompts || [];

      setPrompts(data);

      if (data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          category: data[0].id,
        }));
      }
    } catch (error) {
      console.error("Prompt fetch failed", error);
    }
  };

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= EDIT PROMPT ================= */

  const handleEdit = (prompt) => {
    setEditingId(prompt.id);

    setFormData({
      category: prompt.id,
      name: prompt.name,
      template: prompt.template || "",
    });
  };

  /* ================= SUBMIT FORM ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        category_id: formData.category,
        name: formData.name,
        template: formData.template,
      };

      if (editingId) {
        await updatePromptApi(editingId, payload);

        alert(t("aiPrompts.updatedSuccess"));
      } else {
        await createPromptApi(payload);

        alert(t("aiPrompts.createdSuccess"));
      }

      setEditingId(null);

      setFormData({
        category: prompts[0]?.id || "",
        name: "",
        template: "",
      });

      fetchPrompts();
    } catch (error) {
      console.error("Prompt save failed", error);
      alert(t("aiPrompts.failed"));
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL EDIT ================= */

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      category: prompts[0]?.id || "",
      name: "",
      template: "",
    });
  };

  return (
    <main className="container-fluid">
      <div
        className="page"
        style={{ maxWidth: "1100px", margin: "auto", padding: "0px" }}
      >
        <h3 className="mb-4">{t("aiPrompts.title")}</h3>

        {/* ================= PROMPT FORM ================= */}

        <div
          className="card p-4"
          style={{
            border: "none",
            borderRadius: "14px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            marginBottom: "25px",
          }}
        >
          <h5 className="mb-3">
            {editingId ? t("aiPrompts.editPrompt") : t("aiPrompts.createPrompt")}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* CATEGORY */}

              <div className="col-md-6">
                <label className="form-label">{t("aiPrompts.category")}</label>

                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {prompts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PROMPT NAME */}

              <div className="col-md-6">
                <label className="form-label">{t("aiPrompts.promptName")}</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder={t("aiPrompts.namePlaceholder")}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* TEMPLATE */}

              <div className="col-12">
                <label className="form-label">{t("aiPrompts.template")}</label>

                <textarea
                  className="form-control"
                  rows="8"
                  name="template"
                  style={{ fontFamily: "monospace" }}
                  value={formData.template}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-3">
              <button
                className="btn"
                type="submit"
                style={{ backgroundColor: "#bd00da", color: "#fff" }}
                disabled={loading}
              >
                <i className="bi bi-save"></i>

                {loading
                  ? " " + t("aiPrompts.saving")
                  : editingId
                    ? " " + t("aiPrompts.update")
                    : " " + t("aiPrompts.save")}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={handleCancelEdit}
                >
                  {t("aiPrompts.cancel")}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ================= PROMPT TABLE ================= */}

        <div
          className="card p-3"
          style={{
            border: "none",
            borderRadius: "14px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <h5 className="mb-3">{t("aiPrompts.tableTitle")}</h5>

          <table className="table align-middle">
            <thead>
              <tr>
                <th>{t("aiPrompts.id")}</th>
                <th>{t("aiPrompts.name")}</th>
                <th>{t("aiPrompts.editable")}</th>
                <th>{t("aiPrompts.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {prompts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>

                  <td>{p.name}</td>

                  <td>
                    {p.editable ? (
                      <span className="badge bg-success">{t("aiPrompts.editable")}</span>
                    ) : (
                      <span className="badge bg-secondary">{t("aiPrompts.locked")}</span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(p)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AiPrompts;
