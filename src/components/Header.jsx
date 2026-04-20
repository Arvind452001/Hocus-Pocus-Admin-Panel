import { useNavigate } from "react-router-dom";
import { useSidebar } from "../App";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { updateLanguageApi } from "../api/languageApi";

function Header({ title }) {
  const { toggleSidebar } = useSidebar();

  const navigate = useNavigate();

  // ✅ your existing hook
  const { t } = useTranslation();

  // ✅ ADD THIS (new)
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "tr" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  // ✅ Sign out handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // token remove
    navigate("/login"); // redirect
  };

  // ✅ Profile navigation
  const goToProfile = () => {
    navigate("/profile");
  };

  const handleLanguageChange = async (lang) => {
  try {
    // 1. update UI instantly
    i18n.changeLanguage(lang);

    // 2. save locally
    localStorage.setItem("lang", lang);

    // 3. backend update (FORM DATA)
    await updateLanguageApi(lang);

  } catch (error) {
    console.error("Language update failed", error);
  }
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

          <span style={{ fontSize: "18px", fontWeight: 600 }}>{title}</span>
        </div>

        {/* RIGHT */}
        <div className="dropdown d-flex align-items-center gap-2">
          {/* 🌍 LANGUAGE DROPDOWN */}
          {/* 🌍 LANGUAGE DROPDOWN */}
          <div className="dropdown">
            <button
              className="btn dropdown-toggle"
              data-bs-toggle="dropdown"
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                 background: "#EDE8E8",
                // background: "rgb(189, 0, 218)", // ✅ YOUR COLOR
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "500",
              }}
            >
              🌐 {i18n.language.toUpperCase()}
            </button>

            <ul
              className="dropdown-menu"
              style={{
                minWidth: "160px",
                borderRadius: "10px",
                padding: "6px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
            >
              {/* ENGLISH */}
              <li>
                <button
                  className="dropdown-item"
                  style={{
                    borderRadius: "6px",
                    background:
                      i18n.language === "en"
                        ? "rgb(189, 0, 218)"
                        : "transparent",
                    color: i18n.language === "en" ? "#fff" : "#000",
                  }}
                  onClick={() => handleLanguageChange("en")}
                >
                  🇬🇧 English
                </button>
              </li>

              {/* TURKISH */}
              <li>
                <button
                  className="dropdown-item"
                  style={{
                    borderRadius: "6px",
                    background:
                      i18n.language === "tr"
                        ? "rgb(189, 0, 218)"
                        : "transparent",
                    color: i18n.language === "tr" ? "#fff" : "#000",
                  }}
                  onClick={() => handleLanguageChange("tr")}
                >
                  🇹🇷 Turkish
                </button>
              </li>

              {/* Hindi */}
                <li>
                <button
                  className="dropdown-item"
                  style={{
                    borderRadius: "6px",
                    background:
                      i18n.language === "hi"
                        ? "rgb(189, 0, 218)"
                        : "transparent",
                    color: i18n.language === "hi" ? "#fff" : "#000",
                  }}
                  onClick={() => handleLanguageChange("hi")}
                >
                 Hindi
                </button>
              </li>
            </ul>
          </div>

          {/* 👤 EXISTING PROFILE DROPDOWN (UNCHANGED) */}
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
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
