import { NavLink } from "react-router-dom";
import { useSidebar } from "../App";
import { useState, useRef, useEffect } from "react";

function Sidebar() {
  const { sidebarCollapsed } = useSidebar();
  const [tokenOpen, setTokenOpen] = useState(false);
  const contentRef = useRef(null);

  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (tokenOpen) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [tokenOpen]);

  return (
    <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div
        className="sidebar-header"
        style={{
          background: "white",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src="/assets/images/logo.png"
          className="logo"
          alt="logo"
          style={{ width: "150px" }}
        />
      </div>

      <nav className="p-3">
        <NavLink to="/dashboard" className="nav-link d-flex align-items-center">
          <i className="bi bi-speedometer2"></i>
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink to="/users" className="nav-link d-flex align-items-center">
          <i className="bi bi-people"></i>
          <span className="nav-text">Users</span>
        </NavLink>

        <NavLink
          to="/categories"
          className="nav-link d-flex align-items-center"
        >
          <i className="bi bi-folder"></i>
          <span className="nav-text">Categories</span>
        </NavLink>

        <NavLink to="/ai-prompt" className="nav-link d-flex align-items-center">
          <i className="bi bi-chat-left-text"></i>
          <span className="nav-text">AI Prompt</span>
        </NavLink>

        {/* ✅ TOKEN DROPDOWN */}
        <div className="nav-item">
          <div
            className="nav-link d-flex align-items-center justify-content-between"
            style={{ cursor: "pointer" }}
            onClick={() => setTokenOpen(!tokenOpen)}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-coin"></i>
              <span className="nav-text ms-2">Token Settings</span>
            </div>
            <i
              className={`bi ${tokenOpen ? "bi-chevron-up" : "bi-chevron-down"}`}
              style={{
                transition: "transform 0.3s",
                transform: tokenOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            ></i>
          </div>

          {/* Smooth Dropdown */}
          <div
            ref={contentRef}
            style={{
              maxHeight: height,
              overflow: "hidden",
              transition: "max-height 0.3s ease",
            }}
          >
            <div className="ms-4 mt-2">
              <NavLink
                to="/token-overview"
                className="nav-link d-flex align-items-center"
              >
                <i className="bi bi-bar-chart-line me-2"></i>
                Token Overview
              </NavLink>

              <NavLink
                to="/token-packages"
                className="nav-link d-flex align-items-center"
              >
                <i className="bi bi-box-seam me-2"></i>
                Token Package
              </NavLink>

              <NavLink
                to="/token-config"
                className="nav-link d-flex align-items-center"
              >
                <i className="bi bi-gear me-2"></i>
                Token Config
              </NavLink>
            </div>
          </div>
        </div>

        <NavLink to="/readings" className="nav-link d-flex align-items-center">
          <i className="bi bi-journal"></i>
          <span className="nav-text">Readings</span>
        </NavLink>

        {/* <NavLink to="/support" className="nav-link d-flex align-items-center">
          <i className="bi bi-life-preserver"></i>
          <span className="nav-text">Support</span>
        </NavLink> */}

        <NavLink to="/dreams" className="nav-link d-flex align-items-center">
          <i className="bi bi-moon-stars me-2"></i>
          <span className="nav-text">Dreams</span>
        </NavLink>

      {/* <NavLink to="/cards" className="nav-link d-flex align-items-center">
  <i className="bi bi-collection me-2"></i>
  <span className="nav-text">Cards</span>
</NavLink> */}

<NavLink to="/tarotCards" className="nav-link d-flex align-items-center">
  <i className="bi bi-stars me-2"></i>
  <span className="nav-text">Tarot Cards</span>
</NavLink>

<NavLink to="/katinaCards" className="nav-link d-flex align-items-center">
  <i className="bi bi-gem me-2"></i>
  <span className="nav-text">Katina Cards</span>
</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
