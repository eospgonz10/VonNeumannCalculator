// src/Card.js
import styled from "styled-components";
import PropTypes from "prop-types";
import "./UControl.css";
import { useState, useEffect } from "react";

// Definir el componente de la tarjeta con estilos
const CardContainer = styled.div`
  background-color: white; /* Verde brillante */
  color: black;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
  padding: 20px;
  width: 500px;
  height: 250px;
  max-width: 500px;
  margin: 20px auto;
  text-align: center;
`;

const Card = ({ contadorPrograma, registroInstrucciones, decodificador }) => {
  const [iluminarContador, setIluminarContador] = useState(false);
  const [iluminarRegistro, setIluminarRegistro] = useState(false);

  useEffect(() => {
    setIluminarContador(true);
    const timer = setTimeout(() => setIluminarContador(false), 3000);
    return () => clearTimeout(timer);
  }, [contadorPrograma]);

  useEffect(() => {
    setIluminarRegistro(true);
    const timer = setTimeout(() => setIluminarRegistro(false), 3000);
    return () => clearTimeout(timer);
  }, [registroInstrucciones]);

  Card.propTypes = {
    contadorPrograma: PropTypes.number.isRequired,
    registroInstrucciones: PropTypes.number.isRequired,
    decodificador: PropTypes.string.isRequired,
  };

  return (
    <CardContainer>
      <h3>UNIDAD DE CONTROL</h3>
      <div className="separador">
        <div>
          <p className="decoder">{decodificador}</p>
          <p>Decodificador</p>
        </div>
        <div className="control">
          <p>Contador del programa:</p>
          <p className={`data ${iluminarContador ? "iluminar" : ""}`}>
            {contadorPrograma}
          </p>
          <p>Registro de instrucciones:</p>
          <p className={`data ${iluminarRegistro ? "iluminar" : ""}`}>
            {registroInstrucciones}
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default Card;
