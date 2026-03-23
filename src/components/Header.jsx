import { useNavigate } from "react-router-dom";
import { useSidebar } from "../App";

function Header({ title }) {
  const { toggleSidebar } = useSidebar();
  
  const navigate = useNavigate();

  // ✅ Sign out handler
  const handleLogout = () => {
    localStorage.removeItem("token");      // token remove
    navigate("/login"); // redirect
  };

  // ✅ Profile navigation
  const goToProfile = () => {
    navigate("/dashboard");
  };

  return (
    <header
      style={{
        width: "100%",
        marginBottom: "0px",
        background: "#fff",
        borderBottom: "1px solid rgba(0,0,0,.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 16px",
          height: "72px",
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>

          <span style={{ fontSize: "18px", fontWeight: 600 }}>
            {title}
          </span>
        </div>

        {/* RIGHT */}
        <div className="dropdown">
          <button
            className="btn btn-light dropdown-toggle"
            data-bs-toggle="dropdown"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#bd00da",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
              }}
            >
              A
            </div>
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" onClick={goToProfile}>
                Profile
              </button>
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
