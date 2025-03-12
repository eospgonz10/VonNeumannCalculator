import PropTypes from "prop-types";
import "./Alu.css";
import { useState, useEffect } from "react";

function AContainer({ acumulador, rEntrada }) {
  const [iluminarAcumulador, setIluminarAcumulador] = useState(false);
  const [iluminarREntrada, setIluminarREntrada] = useState(false);

  useEffect(() => {
    setIluminarAcumulador(true);
    const timer = setTimeout(() => setIluminarAcumulador(false), 3000);
    return () => clearTimeout(timer);
  }, [acumulador]);

  useEffect(() => {
    setIluminarREntrada(true);
    const timer = setTimeout(() => setIluminarREntrada(false), 3000);
    return () => clearTimeout(timer);
  }, [rEntrada]);

  AContainer.propTypes = {
    acumulador: PropTypes.number.isRequired,
    rEntrada: PropTypes.number.isRequired,
  };

  return (
    <div className="Alu">
      <h3>UNIDAD ARITMÉTICO-LÓGICA (ALU)</h3>
      <br />
      <img src="public\UnidadAritmeticologica.png" width={300} height={100} />
      <div className="content-alu">
        <div>
          <p>
            Acumulador: <br />
          </p>
          <p className={`data ${iluminarAcumulador ? "iluminar" : ""}`}>
            {acumulador}
          </p>
        </div>

        <div>
          <p>
            R. Entrada: <br />
          </p>
          <p className={`data ${iluminarREntrada ? "iluminar" : ""}`}>
            {rEntrada}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AContainer;
