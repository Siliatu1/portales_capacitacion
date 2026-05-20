import { useEffect, useState } from "react";

import Navbar from "../components/navbar";

import { useAuth } from "../../auth/hooks/useAuth";

import "../styles/panel.css";

const images = [
  "https://tb-static.uber.com/prod/image-proc/processed_images/71c679df669f9b72bc1229c36f93a612/c9252e6c6cd289c588c3381bc77b1dfc.jpeg",

  "https://www.las2orillas.co/wp-content/uploads/2025/01/crepes-waffles-1.jpg",

  "https://domicilios.crepesywaffles.com/static/img/social-shared.be6811424e84.jpg",

  "https://malleljardin.com.ec/wp-content/uploads/2024/05/crepes-waffles-malleljardin-1-1-738x1024.jpg",
];

export default function Panel({
  userData,
  onLogout,
}) {
  const { user } = useAuth();

  const [currentSlide, setCurrentSlide] =
    useState(0);

  // AUTO PLAY
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === images.length - 1
          ? 0
          : prev + 1
      );
    }, 4000);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar
        userData={userData}
        onLogout={onLogout}
      />

      <div className="admin-content">
        {/* HERO */}
        <div className="hero-panel">
          {/* TEXTO */}
          <div className="hero-info">
           
        

           <div className="hero-card">
             {user?.foto && (
                <img
                    src={user.foto}
                        alt="Perfil"
                     className="user-avatar"
               />
               )}

           <div className="hero-text">
               <h2>
                 BIENVENIDO A TU PANEL DE
                 CONTROL
                </h2>

            <p className="hero-description">
                  Gestiona las inscripciones y
                  asignaciones según tu perfil.
           </p>
           </div>
          </div>
          </div>

          {/* CARRUSEL */}
          <div className="hero-carousel">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`slide-${index}`}
                className={`carousel-image ${
                  currentSlide === index
                    ? "active"
                    : ""
                }`}
              />
            ))}

            {/* DOTS */}
            <div className="carousel-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${
                    currentSlide === index
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentSlide(index)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}