import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { deleteCategoryApi, getCategoriesApi } from "../api/Api";

const Categories = () => {

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {

    try {

      const res = await getCategoriesApi();

      setCategories(res?.data?.categories || []);

    } catch (error) {

      console.error("Categories fetch failed", error);

    } finally {

      setLoading(false);

    }

  };

  /* ================= DELETE CATEGORY ================= */

  const handleDeleteCategory = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {

      await deleteCategoryApi(id);

      setCategories(prev => prev.filter(cat => cat.id !== id));

    } catch (error) {

      console.error("Delete failed", error);

    }

  };

  /* ================= FILTER + LIMIT ================= */

  const filteredData = categories
    .filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, entries);

  return (

    <div className="admin-app">

      <Sidebar />

      <div className="content">

        <Header title="Categories" />

        <main className="container-fluid">

          <div className="page-section">

            <div className="card">

              <div className="card-body">

                {/* HEADER */}

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h5 className="mb-0">Categories</h5>

                  <Link
                    to="/add-category"
                    className="btn"
                    style={{ backgroundColor: "#bd00da", color: "#fff" }}
                  >
                    New Category
                  </Link>

                </div>

                {/* SEARCH + LIMIT */}

                <div className="d-flex justify-content-between mb-3">

                  <div>

                    <select
                      className="form-select"
                      style={{ width: "120px" }}
                      value={entries}
                      onChange={(e) => setEntries(Number(e.target.value))}
                    >

                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>

                    </select>

                    <small className="ms-2">entries per page</small>

                  </div>

                  <div>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      style={{ width: "220px" }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                  </div>

                </div>

                {/* TABLE */}

                <div className="table-responsive">

                  <table className="table datatable">

                    <thead>

                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Subtitle</th>
                        <th>Token Cost</th>
                        <th>Free Daily</th>
                        <th>Readings</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>

                    </thead>

                    <tbody>

                      {/* LOADING */}

                      {loading && (

                        <tr>
                          <td colSpan="8" className="text-center">
                            Loading...
                          </td>
                        </tr>

                      )}

                      {/* DATA */}

                      {!loading && filteredData.map((cat) => (

                        <tr key={cat.id}>

                          <td>{cat.id}</td>

                          <td>{cat.name}</td>

                          <td>{cat.subtitle}</td>

                          <td>

                            <span className="badge bg-primary">
                              {cat.token_cost}
                            </span>

                          </td>

                          <td>

                            {cat.is_free_daily ? "Yes" : "No"}

                          </td>

                          <td>

                            <span className="badge bg-info">
                              {cat.reading_count}
                            </span>

                          </td>

                          <td>

                            {cat.is_active ? (

                              <span className="badge bg-success">
                                Active
                              </span>

                            ) : (

                              <span className="badge bg-warning text-dark">
                                Disabled
                              </span>

                            )}

                          </td>

                          <td>

                            <Link
                              to={`/category-view/${cat.id}`}
                              className="btn btn-sm btn-outline-primary me-1"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>

                            <Link
                              to={`/category-edit/${cat.id}`}
                              className="btn btn-sm btn-outline-success me-1"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>

                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <i className="bi bi-trash"></i>
                            </button>

                          </td>

                        </tr>

                      ))}

                      {/* EMPTY */}

                      {!loading && filteredData.length === 0 && (

                        <tr>
                          <td colSpan="8" className="text-center text-muted">
                            No categories found
                          </td>
                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>

  );

};

export default Categories;