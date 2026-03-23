import React, { useState } from "react";

const AddPrompts = () => {
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
              <h5 className="mb-4">Add New Prompt</h5>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Category</label>

                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option>Tarot Reading</option>
                      <option>Dream Interpretation</option>
                      <option>Coffee Reading</option>
                      <option>Fortune Prediction</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Prompt Name</label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Example: Tarot Reading Prompt"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Prompt Template</label>

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
                  <i className="bi bi-save"></i> Save Prompt
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
