import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import { BsSun, BsMoon, BsArrowRightCircle } from "react-icons/bs";
import TypewriterEffect from "../TypewriterEffect";
import Footer from "../Footer/Footer";
import logo from "../../../public/icon.svg";
import interestsList from "../../data/interests.json";
import "../Register/Register.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // Paso actual del formulario
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState(""); // Estado para manejar errores
  const [isRegistered, setIsRegistered] = useState(false); // Estado para manejar registro exitoso
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  // Validar la contraseña
  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Manejar el cambio de paso
  const handleContinue = (e) => {
    e.preventDefault();
    if (validatePassword(password)) {
      setStep(2); // Ir al paso 2 (selección de intereses)
      setError(""); // Limpiar el mensaje de error al avanzar
    }
  };

  // Manejar la selección de intereses
  const handleInterestClick = (interest) => {
    if (selectedInterests.includes(interest.name)) {
      // Si ya está seleccionado, quitarlo
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest.name)
      );
    } else {
      // Si no está seleccionado, agregarlo
      setSelectedInterests([...selectedInterests, interest.name]);
    }
  };

  // Manejar el registro final
  const handleRegister = async (e) => {
    e.preventDefault();
    // Verificar que se hayan seleccionado al menos 3 intereses
    if (selectedInterests.length < 3) {
      setError("Por favor, selecciona al menos 3 temas de interés.");
      return;
    }

    // Preparar los datos para enviar al backend
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      interests: selectedInterests.map((name) =>
        interestsList.find((interest) => interest.name === name).englishName
      ),
    };

    try {
      // Enviar los datos al backend
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to register");
      }
      // Registro exitoso
      setIsRegistered(true);
      setError(""); // Limpiar el mensaje de error
    } catch (error) {
      setError(error.message); // Mostrar el error en la interfaz
    }
  };

  // Regresar al paso 1
  const handleBack = () => {
    setStep(1);
    setError(""); // Limpiar el mensaje de error al regresar
  };

  return (
    <div className={`register-container ${darkMode ? "dark-mode" : ""}`}>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? <BsSun /> : <BsMoon />}
      </button>
      <img src={logo} alt="logo wise" className="icon-logo"/>
      <h1 className="company-title abril-fatface-regular" style={{ marginTop: "0px", marginBottom: "0px" }}>
        wise
      </h1>
      <h2>Crea una Cuenta</h2>
      {isRegistered ? (
        // Mensaje de éxito después del registro
        <div className="success-message">
          <h2>¡Bienvenido!</h2>
          <p>
            Has completado con éxito el registro en nuestros servicios. Comienza a explorar y aprovechar todas las
            funcionalidades que tenemos para ti
          </p>
          <button onClick={() => navigate("/")}>Inicia Sesión</button>
        </div>
      ) : step === 1 ? (
        // Paso 1: Información básica
        <div>
          <form onSubmit={handleContinue}>
            <input
              type="text"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <button className="submit" type="submit">Continuar <BsArrowRightCircle />  </button>
          </form>
          <p>
            ¿Ya tienes una cuenta? <a href="/">Inicia sesión aquí</a>.
          </p>
        </div>
      ) : (
        // Paso 2: Selección de intereses
        <form onSubmit={handleRegister}>
          <h2>Selecciona tus intereses <br /> Al menos 3 opciones:</h2>
          <div className="interests-grid">
            {interestsList.map((interest) => (
              <div
                key={interest.id}
                className={`interest-card ${selectedInterests.includes(interest.name) ? "selected" : ""}`}
                onClick={() => handleInterestClick(interest)}
              >
                <span role="img" aria-label={interest.name}>
                  {interest.emoji}
                </span>
                <p>
                  {interest.name} <br />
                  ({interest.englishName})
                </p>
              </div>
            ))}
          </div>
          {/* Mensaje de error si no se seleccionan suficientes intereses */}
          {error && <p className="error-message">{error}</p>}
          <div className="button-group">
            <button type="button" onClick={handleBack} className="back-button">
              Regresar
            </button>
            <button type="submit">
              Registrarse
            </button>
          </div>
        </form>
      )}
      <TypewriterEffect />
      <Footer />
    </div>
  );
};

export default Register;