import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getDreamsApi, deleteDreamApi } from "../api/DreamsAPI";

const Dreams = () => {
  const { t } = useTranslation();
  const [dreams, setDreams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      const res = await getDreamsApi();
      setDreams(res?.data?.dreams || []);
    } catch (error) {
      console.error("Error fetching dreams:", error);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm(t("dreams.deleteConfirm"))) return;

    try {
      await deleteDreamApi(id);
      fetchDreams(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ View
  const handleView = (id) => {
    navigate(`/dream-details/${id}`);
  };

  return (
   <main className="container-fluid mt-0">
          <div className="card">
            <div className="card-body">

              <h5 className="mb-3">{t("dreams.title")}</h5>

              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>{t("dreams.index")}</th>
                      <th>{t("dreams.user")}</th>
                      <th>{t("dreams.email")}</th>
                      <th>{t("dreams.question")}</th>
                      {/* <th>Preview</th> */}
                      <th>{t("dreams.date")}</th>
                      <th>{t("dreams.actions")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dreams.length > 0 ? (
                      dreams.map((dream, index) => (
                        <tr key={dream.id}>
                          <td>{index + 1}</td>
                          <td>{dream.user_name}</td>
                          <td>{dream.user_email}</td>

                          {/* Question */}
                          <td style={{ maxWidth: "200px" }}>
                            {dream.question.slice(0, 50)}...
                          </td>

                          {/* Preview */}
                          {/* <td style={{ maxWidth: "250px" }}>
                            {dream.result_preview.slice(0, 60)}...
                          </td> */}

                          <td>
                            {new Date(dream.created_at).toLocaleString()}
                          </td>

                          {/* ACTIONS */}
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => handleView(dream.id)}
                              >
                                {t("dreams.view")}
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(dream.id)}
                              >
                                {t("dreams.delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          {t("dreams.noDreamsFound")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </main>
  );
};

export default Dreams;