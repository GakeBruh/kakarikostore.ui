import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout, validateToken } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!validateToken()) {
        clearInterval(interval);
      }
    }, 60000);

    validateToken();

    return () => clearInterval(interval);
  }, [validateToken]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-purple-700 text-white fixed top-0 left-0 right-0 z-40 shadow">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold select-none">
            <span className="text-yellow-400">K</span>akarikoStore
          </div>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-8 font-semibold">
            <li>
              <button
                className="hover:text-yellow-400 transition"
                onClick={() => navigate("/dashboard")}
              >
                Inicio
              </button>
            </li>
            <li>
              <button
                className="hover:text-yellow-400 transition"
                onClick={() => navigate("/catalog-types")}
              >
                Tipos de Catálogos
              </button>
            </li>
            <li>
              <button
                className="hover:text-yellow-400 transition"
                onClick={() => navigate("/catalogs")}
              >
                Catálogos
              </button>
            </li>
            <li>
              <button
                className="hover:text-yellow-400 transition"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col justify-between h-6 w-8"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block h-0.5 w-full bg-white rounded transition-transform ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-full bg-white rounded transition-opacity ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block h-0.5 w-full bg-white rounded transition-transform ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <ul className="md:hidden bg-indigo-700 px-4 py-4 flex flex-col gap-3">
            <li>
              <button
                className="text-white hover:text-yellow-400 transition"
                onClick={() => {
                  navigate("/dashboard");
                  setMenuOpen(false);
                }}
              >
                Inicio
              </button>
            </li>
            <li>
              <button
                className="text-white hover:text-yellow-400 transition"
                onClick={() => {
                  navigate("/catalog-types");
                  setMenuOpen(false);
                }}
              >
                Tipos
              </button>
            </li>
            <li>
              <button
                className="text-white hover:text-yellow-400 transition"
                onClick={() => {
                  navigate("/catalogs");
                  setMenuOpen(false);
                }}
              >
                Catálogos
              </button>
            </li>
            <li>
              <button
                className="text-white hover:text-yellow-400 transition"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-grow pt-20 max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
