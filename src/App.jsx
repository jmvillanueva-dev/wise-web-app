import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext.jsx";
import { ThemeProvider } from "./ThemeContext"
import PrivateRoute from "./components/PrivateRoute.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import ReadingPanel from "./components/ReadingPanel/ReadingPanel.jsx";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/reading" element={<ReadingPanel />} />
            </Route>
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
    
  );
}

export default App;