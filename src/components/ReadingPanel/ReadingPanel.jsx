import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "../../utils/AuthContext";
import { useTheme } from "../../ThemeContext";
import Picker from "emoji-picker-react";
import he from "he";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import "./ReadingPanel.css";

// Importar íconos de react-icons
import { BsSun, BsMoon, BsCheckCircle, BsArrowRightCircle, BsSend, BsExclamationCircle, BsXCircle } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";  
import { FaUserGraduate } from "react-icons/fa6";
import { FaUserAstronaut } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8000";

const ReadingPanel = () => {
  const { logout, user } = React.useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [interests, setInterests] = useState([]);
  const [userInfo, setUserInfo] = useState({ userId: null, firstName: "", lastName: "" });
  const [reading, setReading] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [answered, setAnswered] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [readingsCompleted, setReadingsCompleted] = useState(0);
  const [showProgressMessage, setShowProgressMessage] = useState(false);
  const [readHistory, setReadHistory] = useState(new Set());
  const [prevLevel, setPrevLevel] = useState(selectedLevel);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const fetchComments = useCallback(async (readingId) => {
    try {
      const commentsResponse = await axios.get(`${API_BASE_URL}/comments/${readingId}`);
      const sortedComments = commentsResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(sortedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, []);

  const fetchReading = useCallback(async (userInterests) => {
    if (!userInterests.length) return;
  
    const randomInterest = userInterests[Math.floor(Math.random() * userInterests.length)];
    try {
      const readingsResponse = await axios.get(`${API_BASE_URL}/readings`, {
        params: { level: selectedLevel, interest: randomInterest },
      });
  
      if (Array.isArray(readingsResponse.data) && readingsResponse.data.length > 0) {
        const availableReadings = readingsResponse.data.filter((reading) => !readHistory.has(reading._id));
  
        if (availableReadings.length === 0) {
          setMessage({ text: "No hay más lecturas disponibles para este nivel e intereses.", type: "warning" });
          setReading(null);
          return;
        }
  
        // Seleccionar una lectura aleatoria
        const newReading = availableReadings[Math.floor(Math.random() * availableReadings.length)];
  
        setReadHistory((prevHistory) => new Set([...prevHistory, newReading._id]));
        setReading(newReading);
        setShuffledOptions([...newReading.options].sort(() => Math.random() - 0.5));
        setAnswered(false);
        setUserAnswer("");
        setMessage({ text: "", type: "" });
  
        fetchComments(newReading._id);
      } else {
        setReading(null);
      }
    } catch (error) {
      console.error("Error fetching readings:", error);
    }
  }, [selectedLevel, readHistory, fetchComments]);
  

  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      if (!user?.email) return;
      try {
        console.log("Fetching user info for:", user.email);
        const response = await axios.get(`${API_BASE_URL}/user/info?email=${user.email}`);
        if (!isMounted) return;
        console.log("User data response:", response.data);
        setInterests(response.data.interests || []); // Guardamos intereses sin llamar a fetchReading
        setUserInfo({
          userId: response.data.userId,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
        });
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (interests.length > 0 && (!reading || prevLevel !== selectedLevel)) {
      fetchReading(interests);
      setPrevLevel(selectedLevel); // Guardar el nivel anterior para comparación
    }
  }, [interests, selectedLevel, fetchReading]);
  

  const handleAnswer = () => {
    if (reading && userAnswer === reading.correct_answer) {
      setMessage({ text: "¡Correcto!", type: "success" });
      setAnswered(true);
      const newReadingsCompleted = readingsCompleted + 1;
      setReadingsCompleted(newReadingsCompleted);

      if (newReadingsCompleted === 3) {
        setShowProgressMessage(true); // Mostrar mensaje flotante
        setTimeout(() => setShowProgressMessage(false), 5000); // Ocultar después de 5 segundos
      }
    } else {
      setMessage({ text: "Incorrecto, intenta de nuevo.", type: "error" });
    }
  };


  const handleNextReading = () => {
    if (!answered) {
      setMessage({ text: "Debes responder a la pregunta antes de continuar.", type: "warning" });
      return;
    }
    
    // Reiniciar estado antes de cargar nueva lectura
    setUserAnswer("");
    setAnswered(false);
    setMessage({ text: "", type: "" });
  
    fetchReading(interests);
  };
  

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !reading || !userInfo.userId) return;
    try {
      const newComment = {
        readingId: reading._id,
        userId: userInfo.userId,
        content: comment,
        createdAt: new Date().toISOString(),
      };
      const response = await axios.post(`${API_BASE_URL}/comments`, newComment);
      setComments([
        { ...newComment, _id: response.data.comment_id, firstName: userInfo.firstName, lastName: userInfo.lastName },
        ...comments, // Agregar el nuevo comentario al principio de la lista
      ]);
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error.response ? error.response.data : error);
    }
  };

  const getMessageIcon = () => {
    switch (message.type) {
      case "success":
        return <BsCheckCircle />;
      case "error":
        return <BsXCircle />;
      case "warning":
        return <BsExclamationCircle />;
      default:
        return null;
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setComment((prevComment) => prevComment + emojiObject.emoji);
  };

  return (
    <>
      <div className={`container ${darkMode ? "dark-mode" : ""}`}>
        <div className="main-content">
          <header className="header">
            <div className="brand">
              <h1 className="abril-fatface-regular">wise</h1>
              <span>Learn English reading</span>
            </div>
            <div className="user-controls">
              <button onClick={toggleDarkMode}>
                {darkMode ? <BsSun /> : <BsMoon />}
              </button>
              <button className="button" onClick={logout}>
                <LuLogOut /> Logout
              </button>
            </div>
          </header>
          <section className="user-info">
            <div className="avatar"><FaUserGraduate /></div>
            <h2>
              Welcome, {userInfo.firstName} {userInfo.lastName}!
            </h2>
          </section>
          <section className="level-selector">
            {["beginner", "intermediate", "advanced"].map((level) => (
              <label key={level} className="level-option">
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={selectedLevel === level}
                  onChange={() => setSelectedLevel(level)}
                />
                <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
              </label>
            ))}
          </section>
          {/* Mensaje flotante */}
          {showProgressMessage && (
            <div className="floating-message success">
              <BsCheckCircle /> ¡Buen progreso! Has realizado 3 lecturas seguidas. <br /> Sigue así para mejorar aún más.
            </div>
          )}

          {/* Contador de lecturas */}
          <div className="reading-counter">
            Lecturas completadas: {readingsCompleted}
          </div>
          {reading ? (
            <section className="reading-section card">
              <p>Here’s your reading for today. Get ready!</p>
              <div className="abril-fatface-regular reading-content">{reading.content}</div>
              <h3 className="reading-question">{reading.question}</h3>
              <div className="options">
                {shuffledOptions.map((option, i) => (
                  <button key={i} className="button option-button" onClick={() => setUserAnswer(option)}>
                    {option}
                  </button>
                ))}
              </div>
              <button className="button validate-button" onClick={handleAnswer}>
                <BsCheckCircle /> Validate Answer
              </button>
              {message.text && (
                <div className={`message ${message.type}`}>
                  {getMessageIcon()} {message.text}
                </div>
              )}
              <button className="button next-button" onClick={handleNextReading}>
                <BsArrowRightCircle /> Next Reading
              </button>
            </section>
          ) : (
            <p className="no-reading">No readings available. Try another level or interest.</p>
          )}
          {/* Banner de encuesta */}
          <section className="survey-banner card">
            <h3>¡Tu opinión es importante!</h3>
            <p>Ayúdanos a mejorar la aplicación completando nuestra encuesta de satisfacción.</p>
            <button className="button">
              Ir a la encuesta
            </button>
          </section>
          <section className="comments-section card">
            <h3>Comments</h3>
            <div className="comment-input">
              <input
                type="text"
                placeholder="What do you think about this reading?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input"
              />
              {/*   */}
              <button onClick={handleCommentSubmit} className="button">
                <BsSend /> Post
              </button>
            </div>
            <div className="comments-list">
              {comments.map((c, index) => (
                <div key={index} className="comment">
                  <div className="suggested-user-avatar"><FaUserAstronaut /></div>
                  <div className="comment-content">
                    <strong>
                      {c.firstName} {c.lastName}
                    </strong>
                    <span className="comment-date">({new Date(c.createdAt).toLocaleString()})</span>
                    <p>{he.decode(c.content)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <Sidebar />
      </div>
      <Footer />
    </>
  );
};

export default ReadingPanel;