import { createContext, useContext, useState } from "react";
import { mockProjects } from "../data/marketData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(mockProjects);

  function login(email, password) {
    if (email && password) {
      setCurrentUser({ name: "Guillermo Ibáñez", role: "Project Director", email });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  function logout() {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveView("dashboard");
    setSelectedProject(null);
  }

  function addProject(project) {
    const newProject = {
      name: project.name,
      location: project.location,
      id: `proj-${Date.now()}`,
      status: "bidding",
      progress: 0,
      bids: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
      type: "Alta complejidad",
      budget: 0,
      m2: 0,
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activeView,
        setActiveView,
        selectedProject,
        setSelectedProject,
        projects,
        addProject,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
