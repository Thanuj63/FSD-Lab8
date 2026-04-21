import { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (via cookie)
  useEffect(() => {
    fetch("http://localhost:3000/dashboard", {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      });
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include"
    });

    setIsAuthenticated(false);
  };

  return (
    <div>
      <h1>Auth System</h1>

      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}

    </div>
  );
}

export default App;