import { AppProvider, useApp } from "./context/AppContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import Sidebar from "./components/Sidebar";

function AppShell() {
  const { isAuthenticated, activeView } = useApp();

  if (!isAuthenticated) {
    return <Login />;
  }

  const isProject = activeView === "project";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAFAFA" }}>
      <Sidebar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>
        {isProject ? <ProjectDetail /> : <Dashboard />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
