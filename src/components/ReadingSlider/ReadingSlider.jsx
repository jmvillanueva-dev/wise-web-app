import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../ReadingSlider/ReadingSlider.css";
import axios from "axios";

const ReadingSlider = ({ selectedLevel, interests, onReadingSelect }) => {
  const [readings, setReadings] = useState([]);

  // Efecto para cargar las lecturas cuando cambia el nivel o los intereses
  useEffect(() => {
    const fetchReadings = async () => {
      try {
        // Si no hay intereses, no hacer la solicitud
        if (interests.length === 0) {
          setReadings([]);
          return;
        }

        // Seleccionar un interés al azar
        const randomInterest = interests[Math.floor(Math.random() * interests.length)];

        // Realizar la solicitud GET para obtener las lecturas
        const response = await axios.get("/api/readings", {
          params: { level: selectedLevel, interest: randomInterest },
        });

        // Verificar si la respuesta contiene lecturas válidas
        if (response.data && Array.isArray(response.data)) {
          setReadings(response.data); // Asignar las lecturas
        } else {
          setReadings([]); // No hay lecturas disponibles
        }
      } catch (error) {
        console.error("Error fetching readings:", error);
        setReadings([]); // Manejar errores
        alert("Error al cargar las lecturas. Por favor, inténtalo de nuevo."); // Mostrar mensaje de error al usuario
      }
    };

    fetchReadings(); // Llamar a la función para cargar las lecturas
  }, [selectedLevel, interests]); // Dependencias: se ejecuta cuando cambia el nivel o los intereses

  return (
    <div className="reading-slider-container">
      <Swiper>
        {readings.length > 0 ? (
          readings.map((reading, index) => (
            <SwiperSlide key={index}>
              <div className="reading-content">
                <p>{reading.content}</p>
              </div>
              <div className="reading-question">
                <h3>{reading.question}</h3>
                {reading.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => alert(`Respuesta seleccionada: ${option}`)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onReadingSelect(reading._id)} // Pasar el ID de la lectura seleccionada
                className="select-reading-button"
              >
                Seleccionar lectura
              </button>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <p>No hay lecturas disponibles.</p>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default ReadingSlider;