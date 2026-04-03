import { NavLink } from "react-router-dom";
import { useSidebar } from "../App";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Sidebar() {
  const { sidebarCollapsed } = useSidebar();
  const [tokenOpen, setTokenOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  // ✅ i18n hook
  const { t } = useTranslation();

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
        {/* Dashboard */}
        <NavLink to="/dashboard" className="nav-link d-flex align-items-center">
          <i className="bi bi-speedometer2"></i>
          <span className="nav-text">{t("sideBar.dashboard")}</span>
        </NavLink>

        {/* Users */}
        <NavLink to="/users" className="nav-link d-flex align-items-center">
          <i className="bi bi-people"></i>
          <span className="nav-text">{t("sideBar.users")}</span>
        </NavLink>

        {/* Categories */}
        <NavLink
          to="/categories"
          className="nav-link d-flex align-items-center"
        >
          <i className="bi bi-folder"></i>
          <span className="nav-text">{t("sideBar.categories")}</span>
        </NavLink>

        {/* AI Prompt */}
        <NavLink to="/ai-prompt" className="nav-link d-flex align-items-center">
          <i className="bi bi-chat-left-text"></i>
          <span className="nav-text">{t("sideBar.aiPrompt")}</span>
        </NavLink>

        {/* TOKEN DROPDOWN */}
        <div className="nav-item">
          <div
            className="nav-link d-flex align-items-center justify-content-between"
            style={{ cursor: "pointer" }}
            onClick={() => setTokenOpen(!tokenOpen)}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-coin"></i>
              <span className="nav-text ms-2">
                {t("sideBar.tokenSettings")}
              </span>
            </div>

            <i
              className={`bi ${
                tokenOpen ? "bi-chevron-up" : "bi-chevron-down"
              }`}
              style={{
                transition: "transform 0.3s",
                transform: tokenOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            ></i>
          </div>

          {/* Dropdown */}
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
                {t("sideBar.tokenOverview")}
              </NavLink>

              <NavLink
                to="/token-packages"
                className="nav-link d-flex align-items-center"
              >
                <i className="bi bi-box-seam me-2"></i>
                {t("sideBar.tokenPackage")}
              </NavLink>

              <NavLink
                to="/token-config"
                className="nav-link d-flex align-items-center"
              >
                <i className="bi bi-gear me-2"></i>
                {t("sideBar.tokenConfig")}
              </NavLink>
            </div>
          </div>
        </div>

        {/* Readings */}
        <NavLink to="/readings" className="nav-link d-flex align-items-center">
          <i className="bi bi-journal"></i>
          <span className="nav-text">{t("sideBar.readings")}</span>
        </NavLink>

        {/* Tarot Cards */}
        <NavLink
          to="/tarotCards"
          className="nav-link d-flex align-items-center"
        >
          <i className="bi bi-stars me-2"></i>
          <span className="nav-text">{t("sideBar.tarotCards")}</span>
        </NavLink>

        {/* Katina Cards */}
        <NavLink
          to="/katinaCards"
          className="nav-link d-flex align-items-center"
        >
          <i className="bi bi-gem me-2"></i>
          <span className="nav-text">{t("sideBar.katinaCards")}</span>
        </NavLink>

        {/* Dreams */}
        <NavLink to="/dreams" className="nav-link d-flex align-items-center">
          <i className="bi bi-moon-stars me-2"></i>
          <span className="nav-text">{t("sideBar.dreams")}</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;