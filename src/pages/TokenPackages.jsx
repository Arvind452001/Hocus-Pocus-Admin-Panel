import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import TokenPackageModal from "../components/TokenPackageModal";
import {
  getTokenPackagesApi,
  createTokenPackageApi,
  updateTokenPackageApi,
  deleteTokenPackageApi,
  setPopularPackageApi,
} from "../api/TokenAPIs";

const TokenPackages = () => {
  const { t } = useTranslation();

  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);

  // ✅ NEW STATE (dropdown)
  const [includeInactive, setIncludeInactive] = useState(false);

  // ✅ Language from localStorage
  const lang = localStorage.getItem("lang") || "en";
  const getLocalizedValue = (en, tr) => {
    return lang === "tr" ? tr : en;
  };

  useEffect(() => {
    fetchPackages();
  }, [includeInactive,lang]); // 👈 refetch on dropdown change

  const fetchPackages = async () => {
    try {
      const res = await getTokenPackagesApi({
        include_inactive: includeInactive,
        lang: lang,
      });

      console.log(res);
      setPackages(res.data.packages);
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (type, data = null) => {
    setMode(type);
    setSelected(data);
    setShowModal(true);
  };

  const handleSubmit = async (form) => {
    try {
      if (mode === "add") {
        await createTokenPackageApi(form);
      } else {
        await updateTokenPackageApi(selected.id, form);
      }

      setShowModal(false);
      fetchPackages();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("tokenPackages.deleteConfirm"))) return;

    try {
      await deleteTokenPackageApi(id);
      fetchPackages();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSetPopular = async (id) => {
    try {
      await setPopularPackageApi(id);
      fetchPackages();
      alert(t("tokenPackages.markedPopular"));
    } catch (err) {
      console.log(err?.response?.data || err.message);
    }
  };

  return (
    <div>
      <main className="container-fluid mt-4">
        <div className="card">
          <div className="card-body">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>{t("tokenPackages.title")}</h5>

              <div className="d-flex gap-2">
                {/* 🔽 Dropdown */}
                <select
                  className="form-select"
                  style={{ width: "200px" }}
                  value={includeInactive ? "true" : "false"}
                  onChange={(e) =>
                    setIncludeInactive(e.target.value === "true")
                  }
                >
                  <option value="false">Active Only</option>
                  <option value="true">Include Inactive</option>
                </select>

                {/* ➕ Add Button */}
                <button
                  className="btn btn-primary"
                  onClick={() => openModal("add")}
                >
                  {t("tokenPackages.addPackage")}
                </button>
              </div>
            </div>

            {/* TABLE */}
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>{t("tokenPackages.name")}</th>
                  <th>{t("tokenPackages.tokens")}</th>
                  <th>{t("tokenPackages.price")}</th>
                  <th>{t("tokenPackages.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>{getLocalizedValue(pkg.name, pkg.name_tr)}</td>

                    <td>{pkg.tokens}</td>

                    <td>{pkg.price}</td>

                    <td>
                      <div className="d-flex gap-2">
                        {/* View */}
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => openModal("view", pkg)}
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>

                        {/* Edit */}
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => openModal("edit", pkg)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {/* Delete */}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(pkg.id)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>

                        {/* Popular */}
                        <button
                          className={`btn btn-sm ${
                            pkg.is_popular
                              ? "btn-success"
                              : "btn-outline-warning"
                          }`}
                          onClick={() => handleSetPopular(pkg.id)}
                        >
                          <i className="bi bi-star-fill me-1"></i>
                          {pkg.is_popular
                            ? t("tokenPackages.popular")
                            : t("tokenPackages.makePopular")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL */}
      <TokenPackageModal
        show={showModal}
        onClose={() => setShowModal(false)}
        mode={mode}
        selectedData={selected}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TokenPackages;
