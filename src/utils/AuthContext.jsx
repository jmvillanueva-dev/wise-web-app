import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Importar jwtDecode correctamente

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Estado para almacenar información del usuario

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtener el token del localStorage
    if (token) {
      try {
        // Decodificar el token para obtener la información del usuario
        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken.sub; // Suponemos que el email está en el campo "sub"
        setUser({ email: userEmail }); // Almacenar el email en el estado
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        logout(); // Si el token no es válido, cerrar sesión
      }
    }
  }, []);

  // Función para iniciar sesión
  const login = (token) => {
    localStorage.setItem("token", token); // Guardar el token en el localStorage
    try {
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken.sub; // Extraer el email del token
      setUser({ email: userEmail }); // Almacenar el email en el estado
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error decoding token during login:", error);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token"); // Eliminar el token del localStorage
    setUser(null); // Limpiar la información del usuario
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};