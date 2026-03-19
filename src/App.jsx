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
import AiPromptManegement from "./pages/AiPromptManegement";
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

// Sidebar Context
export const SidebarContext = createContext();

export function useSidebar() {
  return useContext(SidebarContext);
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userDetails/:id"
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-user"
          element={
            <ProtectedRoute>
              <Adduser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route path="/add-category" element={<CategoryForm mode="create" />} />

        <Route
          path="/category-view/:id"
          element={<CategoryForm mode="view" />}
        />

        <Route
          path="/category-edit/:id"
          element={<CategoryForm mode="edit" />}
        />

        <Route
          path="/ai-prompt"
          element={
            <ProtectedRoute>
              <AiPrompts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-prompt"
          element={
            <ProtectedRoute>
              <AddPrompts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-prompt-manegement"
          element={
            <ProtectedRoute>
              <AiPromptManegement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/token-overview"
          element={
            <ProtectedRoute>
              <TokenOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/token-packages"
          element={
            <ProtectedRoute>
              <TokenPackages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/token-config"
          element={
            <ProtectedRoute>
              <TokenConfig />
            </ProtectedRoute>
          }
        />

        <Route
          path="/readings"
          element={
            <ProtectedRoute>
              <Readings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dreams"
          element={
            <ProtectedRoute>
              <Dreams />
            </ProtectedRoute>
          }
        />
        <Route path="/dream-details/:id" element={<DreamDetails />} />

        <Route path="/cards" element={<Cards />} />
        <Route path="/tarotCards" element={<TarotCards />} />

        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </SidebarContext.Provider>
  );
}

export default App;
