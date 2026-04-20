// src/components/common/Loader.jsx

import React from "react";

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center ${
        fullScreen ? "vh-100" : "py-5"
      }`}
    >
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-2 mb-0">{text}</p>
    </div>
  );
};

export default Loader;