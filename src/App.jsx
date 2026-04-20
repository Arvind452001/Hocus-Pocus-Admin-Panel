import { useState, createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Support from "./pages/Support";
import Readings from "./pages/Readings";
import Adduser from "./pages/Adduser";
import AiPromptManagement from "./pages/AiPromptManegement";
import AiPrompts from "./pages/AiPrompts";
import AddPrompts from "./pages/AddPrompts";
import UserDetails from "./pages/UserDetails";
import CategoryForm from "./pages/CategoryForm";
import TokenOverview from "./pages/TokenOverview";
import TokenConfig from "./pages/TokenConfig";
import TokenPackages from "./pages/TokenPackages";
import Dreams from "./pages/Dreams";
import DreamDetails from "./pages/DreamDetails";
import Cards from "./pages/Cards";
import TarotCards from "./pages/TarotCards";
import Layout from "./layout.jsx/Layout";
import CreateCard from "./pages/CreateCard";
import KatinaCards from "./pages/KatinaCards";
import ReadingDetails from "./pages/ReadingDetails";
import ProfilePage from "./pages/ProfilePage";
import BroadcastNotification from "./pages/BroadcastNotification";
import ContactMessages from "./pages/ContactMessages";

// Sidebar Context
export const SidebarContext = createContext();

export function useSidebar() {
  return useContext(SidebarContext);
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev); // ✅ improved
  };

  return (
    <SidebarContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      <Routes>

        {/* ✅ Public Route (Login only) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* ✅ All Protected Routes wrapped with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/userDetails/:id" element={<UserDetails />} />
          <Route path="/add-user" element={<Adduser />} />

          <Route path="/categories" element={<Categories />} />
          <Route path="/add-category" element={<CategoryForm mode="create" />} />
          <Route path="/category-view/:id" element={<CategoryForm mode="view" />} />
          <Route path="/category-edit/:id" element={<CategoryForm mode="edit" />} />

          <Route path="/ai-prompt" element={<AiPrompts />} />
          <Route path="/add-prompt" element={<AddPrompts />} />
          <Route path="/ai-prompt-management" element={<AiPromptManagement />} />

          <Route path="/token-overview" element={<TokenOverview />} />
          <Route path="/token-packages" element={<TokenPackages />} />
          <Route path="/token-config" element={<TokenConfig />} />

          <Route path="/readings" element={<Readings />} />
          <Route path="/readingDetails/:id" element={<ReadingDetails />} />
          <Route path="/support" element={<Support />} />

          <Route path="/dreams" element={<Dreams />} />
          <Route path="/dream-details/:id" element={<DreamDetails />} />

          <Route path="/cards" element={<Cards />} />
          <Route path="/createCard" element={<CreateCard />} />
          <Route path="/TarotCards" element={<TarotCards />} />
          <Route path="/katinaCards" element={<KatinaCards />} />
          <Route path="/broadcast-notification" element={<BroadcastNotification />} />
          <Route path="/broadcast-notification/:id" element={<BroadcastNotification />} />
          <Route path="/Contact-Messages" element={<ContactMessages />} />
        </Route>

        {/* ✅ Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </SidebarContext.Provider>
  );
}

export default App;