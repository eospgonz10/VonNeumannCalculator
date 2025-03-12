// src/memory.js
// import React from "react";
// import styled from "styled-components";
import "./Mcontainer.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const MContainer = ({ vector, content, content1 }) => {
  const [iluminarDirecciones, setIluminarDirecciones] = useState(false);
  const [iluminarDatos, setIluminarDatos] = useState(false);
  const [imageSrc, setImageSrc] = useState("public/proceso_memoria_8.png");

  useEffect(() => {
    // Iluminar el elemento <p> cuando cambie el contenido
    setIluminarDirecciones(true);
    const timer = setTimeout(() => setIluminarDirecciones(false), 3000); // Remover la clase después de 1 segundo
    return () => clearTimeout(timer);
  }, [content]);
  useEffect(() => {
    // Iluminar el elemento <p> cuando cambie el contenido
    setIluminarDatos(true);
    const timer = setTimeout(() => setIluminarDatos(false), 3000); // Remover la clase después de 1 segundo
    return () => clearTimeout(timer);
  }, [content1]);
  useEffect(() => {
    // Actualizar la imagen cuando cambie el contenido
    setImageSrc(`public/proceso_memoria_${content ? content : 0}.png`);
  }, [content]);

  MContainer.propTypes = {
    vector: PropTypes.array.isRequired,
    content: PropTypes.string.isRequired,
    content1: PropTypes.string.isRequired,
  };
  return (
    // <MemoryContainer>
    <div className="memory-container">
      <h4>MEMORIA</h4>

      <div className="content">
        <div className="dir">
          <p>
            R. direcciones: <br />
          </p>
          <p className={`data ${iluminarDirecciones ? "iluminar" : ""}`}>
            {content}
          </p>
          <img src={imageSrc} alt="" width={90} height={312} />
        </div>
        <table>
          <thead>
            <tr>
              <th>Índice</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {vector.map((dato, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{dato}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="datos">
          <p>
            R. datos: <br />
          </p>
          <p className={`data ${iluminarDatos ? "iluminar" : ""}`}>
            {content1}
          </p>
          <img
            src={`public/proceso_memoria_${content ? content : 8}_.png`}
            alt=""
            width={90}
            height={305}
          />
        </div>
      </div>
    </div>

    // </MemoryContainer>
  );
};

export default MContainer;
