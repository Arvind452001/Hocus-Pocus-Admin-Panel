import React, { useEffect, useState } from "react";
import { deleteReadingsApi, getReadingsApi } from "../api/Api";

const Readings = () => {
  const [readings, setReadings] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedReading, setSelectedReading] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ API Call
  useEffect(() => {
    fetchReadings();
  }, [page]);

  const fetchReadings = async () => {
    try {
      setLoading(true);
      const res = await getReadingsApi(page, limit);
      const data = res.data;

      const formatted = data.readings.map((item) => ({
        id: item.id,
        userId: item.user_id,
        name: item.user_name,
        email: item.user_email,
        category: item.category_name,
        question: item.question,
        createdAt: new Date(item.created_at).toLocaleString(),
      }));

      setReadings(formatted);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter
  const filteredData = readings.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.question.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // ✅ View
  const handleView = (item) => {
    setSelectedReading(item);
    setShowModal(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await deleteReadingsApi(id);
      fetchReadings();
      alert('Deleted successffully')

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
     <main className="container-fluid">
          <div className="page-section">
            <div className="card">
              <div className="card-body">

                {/* 🔍 Search + Filter */}
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <h5 className="mb-0">Readings</h5>

                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                      className="form-select"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Tarot Reading">Tarot Reading</option>
                      <option value="Coffee Reading">Coffee Reading</option>
                    </select>
                  </div>
                </div>

                {/* 📊 Table */}
                <div className="table-responsive">
                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Question</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : filteredData.length > 0 ? (
                        filteredData.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.question}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleView(item)}
                              >
                                <i className="bi bi-eye"></i>
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(item.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No data found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 🔢 Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <button
                    className="btn btn-outline-secondary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>

                  <span>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    className="btn btn-outline-secondary"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Modal */}
          {showModal && selectedReading && (
            <div
              className="modal fade show d-block"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setShowModal(false)}
            >
              <div
                className="modal-dialog modal-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">

                  <div className="modal-header">
                    <h5 className="modal-title">Reading Details</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <strong>ID:</strong> {selectedReading.id}
                      </div>

                      <div className="col-md-6">
                        <strong>User ID:</strong> {selectedReading.userId}
                      </div>

                      <div className="col-md-6">
                        <strong>Name:</strong> {selectedReading.name}
                      </div>

                      <div className="col-md-6">
                        <strong>Email:</strong> {selectedReading.email}
                      </div>

                      <div className="col-md-6">
                        <strong>Category:</strong> {selectedReading.category}
                      </div>

                      <div className="col-md-12">
                        <strong>Question:</strong>
                        <div className="border p-2 mt-1 rounded bg-light">
                          {selectedReading.question}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <strong>Created At:</strong> {selectedReading.createdAt}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </main>
    </div>
  );
};

export default Readings;