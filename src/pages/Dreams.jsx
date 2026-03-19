import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { getDreamsApi, deleteDreamApi } from "../api/DreamsAPI";

const Dreams = () => {
  const [dreams, setDreams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      const res = await getDreamsApi();
      setDreams(res?.data?.dreams || []);
    } catch (error) {
      console.error("Error fetching dreams:", error);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dream?")) return;

    try {
      await deleteDreamApi(id);
      fetchDreams(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ View
  const handleView = (id) => {
    navigate(`/dream-details/${id}`);
  };

  return (
    <div className="admin-app">
      <Sidebar />

      <div className="content">
        <Header title="Dreams" />

        <main className="container-fluid mt-0">
          <div className="card">
            <div className="card-body">

              <h5 className="mb-3">Dreams List</h5>

              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Question</th>
                      {/* <th>Preview</th> */}
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dreams.length > 0 ? (
                      dreams.map((dream, index) => (
                        <tr key={dream.id}>
                          <td>{index + 1}</td>
                          <td>{dream.user_name}</td>
                          <td>{dream.user_email}</td>

                          {/* Question */}
                          <td style={{ maxWidth: "200px" }}>
                            {dream.question.slice(0, 50)}...
                          </td>

                          {/* Preview */}
                          {/* <td style={{ maxWidth: "250px" }}>
                            {dream.result_preview.slice(0, 60)}...
                          </td> */}

                          <td>
                            {new Date(dream.created_at).toLocaleString()}
                          </td>

                          {/* ACTIONS */}
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => handleView(dream.id)}
                              >
                                View
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(dream.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No dreams found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dreams;