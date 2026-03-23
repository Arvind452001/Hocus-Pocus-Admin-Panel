import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/apiConfig";
 
const CreateCard = () => {
  const [form, setForm] = useState({
    category_id: 1,
    name: "",
    meaning: "",
    keywords: "",
    upright_meaning: "",
    reversed_meaning: "",
    description: "",
    file: null,
  });

  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, file }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // ✅ REQUIRED
      formData.append("category_id", Number(form.category_id));
      formData.append("name", form.name);
      formData.append("meaning", form.meaning);

      // ✅ OPTIONAL
      formData.append("keywords", form.keywords || "");
      formData.append("upright_meaning", form.upright_meaning || "");
      formData.append("reversed_meaning", form.reversed_meaning || "");
      formData.append("description", form.description || "");

      // ✅ IMAGE
      if (form.file) {
        formData.append("image", form.file);
      } else {
        alert("Image required");
        return;
      }

      // 🔥 DEBUG
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      const res = await axios.post(
        `${BASE_URL}/admin/card`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer YOUR_TOKEN_HERE",
          },
        }
      );

      // console.log("SUCCESS ✅", res.data);
      alert("Card Created Successfully");

    } catch (error) {
      // console.log("ERROR ❌", error.response?.data || error);
      alert("Error creating card");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h4>Create Card</h4>

        <form onSubmit={handleSubmit}>
          {/* Category */}
          <div className="mb-3">
            <label>Category ID</label>
            <input
              type="number"
              className="form-control"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
            />
          </div>

          {/* Name */}
          <div className="mb-3">
            <label>Name *</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Meaning */}
          <div className="mb-3">
            <label>Meaning *</label>
            <textarea
              className="form-control"
              name="meaning"
              value={form.meaning}
              onChange={handleChange}
            />
          </div>

          {/* Keywords */}
          <div className="mb-3">
            <label>Keywords</label>
            <input
              type="text"
              className="form-control"
              name="keywords"
              value={form.keywords}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Image */}
          <div className="mb-3">
            <label>Upload Image *</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFile}
            />
          </div>

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{ width: 100, marginBottom: 10 }}
            />
          )}

          <div className="d-flex justify-content-end">
  <button className="btn btn-primary">Create Card</button>
</div>
        </form>
      </div>
    </div>
  );
};

export default CreateCard;