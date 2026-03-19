import React, { useEffect, useState } from "react";

const CardModal = ({ show, onClose, mode, selectedData, onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    type: "TAROT",
    status: "Active",
    image: "",
    file: null,
  });

  useEffect(() => {
    if (selectedData && mode === "edit") {
      setForm({
        title: selectedData.title || "",
        type: selectedData.type || "TAROT",
        status: selectedData.status || "Active",
        image: selectedData.image || "",
        file: null,
      });
    } else {
      setForm({
        title: "",
        type: "TAROT",
        status: "Active",
        image: "",
        file: null,
      });
    }
  }, [selectedData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFile = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  if (!show) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 1040,
        }}
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="modal d-block" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{ borderRadius: "12px", border: "none" }}
          >
            <div className="modal-header py-3 px-4">
              <h5 className="fw-bold">
                {mode === "add" ? "Add Card" : "Edit Card"}
              </h5>

              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body p-4">
              {/* Title */}
              <div className="mb-3">
                <label className="form-label small">Card Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                {/* Type */}
                <div className="col-md-6 mb-3">
                  <label className="form-label small">System Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="TAROT">Tarot</option>
                    <option value="KATINA">Katina</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label small">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Disabled</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={handleChange}
                />
              </div>

              {/* File */}
              <input
                type="file"
                className="form-control"
                onChange={handleFile}
              />
            </div>

            <div className="modal-footer bg-light">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>

              <button className="btn btn-primary" onClick={handleSubmit}>
                {mode === "add" ? "Save" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardModal;