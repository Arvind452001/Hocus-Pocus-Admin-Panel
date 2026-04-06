import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getDreamByIdApi } from "../api/DreamsAPI";

const DreamDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [dream, setDream] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDream();
  }, []);

  const fetchDream = async () => {
    try {
      const res = await getDreamByIdApi(id);
      setDream(res?.data?.dream);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">{t("dreamDetails.loading")}</div>;
  if (!dream) return <div className="p-4">{t("dreamDetails.noDataFound")}</div>;

  return (
    <main className="container-fluid mt-0">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* MAIN CARD */}
          <div className="card shadow-sm">
            <div className="card-body p-1">
              {/* USER INFO */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1">{dream.user_name}</h5>
                  <small className="text-muted">{dream.user_email}</small>
                </div>

                <span className="badge bg-primary">
                  {new Date(dream.created_at).toLocaleString()}
                </span>
              </div>

              <hr />

              {/* QUESTION */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2">{t("dreamDetails.dreamQuestion")}</h6>

                <div className="p-3 bg-light rounded">{dream.question}</div>
              </div>

              {/* RESULT */}
              <div>
                <h6 className="fw-bold mb-2">{t("dreamDetails.interpretation")}</h6>

                <div
                  className="p-3 bg-light rounded"
                  style={{
                    whiteSpace: "pre-line",
                    lineHeight: "1.7",
                  }}
                >
                  {dream.result}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DreamDetails;
