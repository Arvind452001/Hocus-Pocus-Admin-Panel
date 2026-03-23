import React, { useState } from "react";

const AiPromptManegement = () => {

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);

  const prompts = [
    { id:1, name:"Tarot Reading Prompt", category:"Tarot Reading", updated:"2026-03-07"},
    { id:2, name:"Dream Interpretation Prompt", category:"Dream Interpretation", updated:"2026-03-05"},
    { id:3, name:"Coffee Reading Prompt", category:"Coffee Reading", updated:"2026-03-04"},
    { id:4, name:"Fortune Prediction Prompt", category:"Fortune Prediction", updated:"2026-03-03"}
  ];

  const filteredData = prompts
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, entries);

  return (
    <main className="container-fluid">
          <div className="page-section">
            <div className="card">
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Prompt Templates</h5>

                  <a href="/add-prompt" className="btn btn-primary">
                    New Prompt
                  </a>
                </div>

                {/* FILTER + SEARCH */}
                <div className="d-flex justify-content-between mb-3">

                  {/* Entries Filter */}
                  <div className="d-flex align-items-center gap-2">

                    <i className="bi bi-funnel"></i>

                    <select
                      className="form-select"
                      style={{ width: "90px" }}
                      value={entries}
                      onChange={(e) => setEntries(e.target.value)}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>

                    <span>entries</span>

                  </div>

                  {/* Search */}
                  <div style={{ position: "relative" }}>

                    <i
                      className="bi bi-search"
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "10px",
                        color: "#888"
                      }}
                    ></i>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      style={{ paddingLeft: "32px", width: "220px" }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                  </div>

                </div>

                <div className="table-responsive">
                  <table className="table datatable">

                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Prompt Name</th>
                        <th>Category</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredData.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.category}</td>
                          <td>{p.updated}</td>

                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </button>{" "}
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}

                    </tbody>

                  </table>
                </div>

              </div>
            </div>
          </div>
        </main>
  );
};

export default AiPromptManegement;