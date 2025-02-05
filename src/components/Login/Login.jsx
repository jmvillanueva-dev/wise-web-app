import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../utils/AuthContext"
import { useTheme } from "../../ThemeContext"
import { BsSun, BsMoon } from "react-icons/bs"
import TypewriterEffect from "../TypewriterEffect"
import Footer from "../Footer/Footer"

import "../Login/Login.css"
import { LuLogIn } from "react-icons/lu";
import logo from "../../../public/icon.svg"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useContext(AuthContext) // Usar la función login del contexto
  const { darkMode, toggleDarkMode } = useTheme()

  const handleLogin = async (e) => {
    e.preventDefault()

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      setError("Por favor, completa todos los campos.")
      return
    }

    try {
      // Realizar la solicitud POST al backend
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Error al iniciar sesión.")
      }

      // Obtener el token del backend
      const data = await response.json()
      const token = data.access_token // Acceder al token correcto

      if (!token || typeof token !== "string") {
        throw new Error("El servidor no devolvió un token válido.")
      }

      // Guardar el token y actualizar el estado de autenticación
      login(token)

      // Redirigir al panel de lectura
      navigate("/reading")
    } catch (error) {
      setError(error.message) // Mostrar el mensaje de error
    }
  }

  return (
    <div className={`login-container ${darkMode ? "dark-mode" : ""}`}>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? <BsSun /> : <BsMoon />}
      </button>
        <img src={logo} alt="logo wise" className="icon-logo" />
        <h1 className="company-title abril-fatface-regular" style={{
          "marginTop": "0px",
          "marginBottom": "0px"
        }}>wise</h1>
      <h2>Inciar Sesión</h2>
      {error && <p className="error-message">{error}</p>}
      <div>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="submit" type="submit">Acceder <LuLogIn /></button>
        </form>
        <p>
          ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>.
        </p>
      </div>
      <TypewriterEffect />
      <Footer />
    </div>
  )
}

export default Login

