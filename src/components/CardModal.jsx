import React, { useEffect, useState } from "react";

const CardModal = ({ show, onClose, mode, selectedData, onSubmit }) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const [form, setForm] = useState({
    name: "",
    turkish_name: "",
    card_number: "",
    arcana: "Major",
    suit: "",
    element: "",
    meaning: "",
    keywords: "",
    upright_meaning: "",
    reversed_meaning: "",
    file: null,
  });

  // ✅ Set data for edit + view
  useEffect(() => {
    if (selectedData) {
      setForm({
        name: selectedData.name || "",
        turkish_name: selectedData.turkish_name || "",
        card_number: selectedData.card_number || "",
        arcana: selectedData.arcana || "Major",
        suit: selectedData.suit || "",
        element: selectedData.element || "",
        meaning: selectedData.meaning || "",
        keywords: selectedData.keywords || "",
        upright_meaning: selectedData.upright_meaning || "",
        reversed_meaning: selectedData.reversed_meaning || "",
        file: null,
      });
    } else {
      setForm({
        name: "",
        turkish_name: "",
        card_number: "",
        arcana: "Major",
        suit: "",
        element: "",
        meaning: "",
        keywords: "",
        upright_meaning: "",
        reversed_meaning: "",
        file: null,
      });
    }
  }, [selectedData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  if (!show) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 1040,
        }}
      />

      {/* MODAL */}
      <div className="modal d-block" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="fw-bold">
                {isAdd && "Add Card"}
                {isEdit && "Edit Card"}
                {isView && "View Card"}
              </h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              <div className="row">

                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={isView}
                  />
                </div>

                {/* Turkish Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Turkish Name</label>
                  <input
                    className="form-control"
                    name="turkish_name"
                    value={form.turkish_name}
                    onChange={handleChange}
                    disabled={isView}
                  />
                </div>

                {/* Card Number */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    className="form-control"
                    name="card_number"
                    value={form.card_number}
                    onChange={handleChange}
                    disabled={isView}
                  />
                </div>

                {/* Arcana */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Arcana</label>
                  <select
                    className="form-select"
                    name="arcana"
                    value={form.arcana}
                    onChange={handleChange}
                    disabled={isView}
                  >
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>

                {/* Suit */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Suit</label>
                  <input
                    className="form-control"
                    name="suit"
                    value={form.suit}
                    onChange={handleChange}
                    disabled={isView}
                  />
                </div>

                {/* Element */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Element</label>
                  <input
                    className="form-control"
                    name="element"
                    value={form.element}
                    onChange={handleChange}
                    disabled={isView}
                  />
                </div>

                {/* Keywords */}
                <div className="col-md-8 mb-3">
                  <label className="form-label">Keywords</label>
                  <input
                    className="form-control"
                    name="keywords"
                    value={form.keywords}
                    onChange={handleChange}
                    disabled={isView}
                  />
                </div>

                {/* Meaning */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Meaning</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="meaning"
                    value={form.meaning}
                    onChange={handleChange}
                    disabled={isView}
                  />
                </div>

                {/* Upright */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Upright Meaning</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="upright_meaning"
                    value={form.upright_meaning}
                    onChange={handleChange}
                    disabled={isView}
                  />
                </div>

                {/* Reversed */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Reversed Meaning</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="reversed_meaning"
                    value={form.reversed_meaning}
                    onChange={handleChange}
                    disabled={isView}
                  />
                </div>

                {/* File Upload */}
                {!isView && (
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Upload Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFile}
                    />
                  </div>
                )}

              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>

              {!isView && (
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {isAdd ? "Save" : "Update"}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CardModal;