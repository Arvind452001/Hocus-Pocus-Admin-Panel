import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getReadingByIdApi } from "../api/Api";

const ReadingDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const res = await getReadingByIdApi(id);
        // console.log(res)
        setData(res.data.reading);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReading();
  }, [id]);

  if (!data) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div
      className="py-0"
     
    >
      <div className="container">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">

            {/* HEADER */}
            <h3 className="text-primary fw-bold">
              {data.category_name}
            </h3>
            <p className="text-muted">
              {new Date(data.created_at).toLocaleString()}
            </p>

            {/* USER */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="p-2 bg-light rounded">
                  <strong>{t("readingDetails.name")}</strong> {data.user_name}
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-2 bg-light rounded">
                  <strong>{t("readingDetails.email")}</strong> {data.user_email}
                </div>
              </div>
            </div>

            {/* QUESTION */}
            <div className="alert alert-warning">
              <strong>{t("readingDetails.question")}</strong>
              <p className="mb-0 mt-2">{data.question}</p>
            </div>

            {/* RESULT */}
            <div
              className="bg-light p-3 rounded"
              style={{
                whiteSpace: "pre-line",
                lineHeight: "1.7",
              }}
            >
              {data.result}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingDetails;