import React from "react";
import { useTranslation } from "react-i18next";

const Loader = ({ fullScreen = false, text }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center ${
        fullScreen ? "vh-100" : "py-5"
      }`}
    >
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-2 mb-0">
        {text || t("tokenOverview.loading")}
      </p>
    </div>
  );
};

export default Loader;