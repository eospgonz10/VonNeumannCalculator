import { useState, useEffect } from "react";
import "./App.css";
import UControl from "./Components/UControl.jsx";
import MContainer from "./Components/Mcontainer.jsx";
import { Memoria } from "./vonNeumannArchitecture/memoria.js";
import { Alu } from "./vonNeumannArchitecture/ALU.js";
import AContainer from "./Components/AContainer.jsx";
import { UnidadControl } from "./vonNeumannArchitecture/UnidadControl.js";
//fetch decode and execute
function App() {
  // ((2 ^ 2) + 2) ^ 2 = 36
  const [unidadControl, setUnidadControl] = useState(new UnidadControl());
  const [memoria, setMemoria] = useState(new Memoria());
  const [alu, setAlu] = useState(new Alu());
  const [op, setOp] = useState({ opNombre: "..." });
  const [contador, setContador] = useState(0);
  const [siguiente, setSiguiente] = useState(true);
  const [vector, setvector] = useState([""]);
  useEffect(() => {
    document.title = "Arquitectura Von Neumann";
  }, []);

  useEffect(() => {
    setvector(memoria.contenido);
  }, []);

  useEffect(() => {
    console.log(`case ${contador}`);
    switch (contador) {
      //Actualiza el registro de direcciones de la memoria con el contador de programa de la unidad de control
      case 0:
        setMemoria(() => {
          return {
            ...memoria,
            registroDirecciones: unidadControl.contadorPrograma,
          };
        });
        setContador((contador + 1) % 8);
        break;

      case 1:
        setUnidadControl((prevObj) => {
          const nuevoObj = Object.create(Object.getPrototypeOf(prevObj));
          return Object.assign(nuevoObj, prevObj, {
            contadorPrograma: prevObj.contadorPrograma + 1,
          });
        });
        setContador((contador + 1) % 8);
        break;

      case 2:
        setMemoria(() => {
          return {
            ...memoria,
            registroDatos:
              memoria.contenido[parseInt(memoria.registroDirecciones)],
          };
        });
        setContador((contador + 1) % 8);
        break;

      case 3:
        setUnidadControl((prevObj) => {
          const nuevoObj = Object.create(Object.getPrototypeOf(prevObj));
          console.log(memoria.registroDatos);
          return Object.assign(nuevoObj, prevObj, {
            registroInstrucciones: memoria.registroDatos,
          });
        });
        setContador((contador + 1) % 8);
        break;

      case 4:
        setOp(() => {
          const andom = unidadControl.decode();
          setMemoria({
            ...memoria,
            registroDirecciones: parseInt(parseInt(andom.operando, 2)),
          });
          return andom;
        });
        setContador((contador + 1) % 8);
        break;

      //Se setea el registro de datos de la memoria con el operando buscado
      case 5:
        setMemoria({
          ...memoria,
          registroDatos: memoria.contenido[parseInt(op?.operando, 2)],
        });
        setContador((contador + 1) % 8);
        break;

      //Se le envia a la ALU el valor del  registro de datos de la memoria y la ALU
      //lo almacena en su registro de entrada
      case 6:
        setAlu((prevObj) => {
          const nuevoObj = Object.create(Object.getPrototypeOf(prevObj));
          return Object.assign(nuevoObj, prevObj, {
            registroEntrada: memoria.registroDatos,
          });
        });
        setContador((contador + 1) % 8);
        break;

      //Se realiza la operación indicada en la decodificación de la unidad de control
      //Y se almacena su resultado en el acumulador
      case 7:
        if (op?.opNombre == "+") {
          console.log(alu.suma());
        }
        if (op?.opNombre == "^") {
          console.log(alu.potencia());
        }
        if (op?.opNombre == "S") {
          let tpm = memoria.contenido;
          tpm[parseInt(op?.operando, 2)] = alu.acumulador;
          setMemoria({ ...memoria, contenido: tpm });
        }
        if (op?.opNombre == "...") {
          alert("Fin de la ejecución");
          break;
        }
        setContador((contador + 1) % 8);
        break;
    }
  }, [siguiente]);

  return (
    <div>
      <div className="memory">
        <MContainer
          vector={vector}
          content={`${memoria.registroDirecciones}`}
          content1={`${memoria.registroDatos}`}
        ></MContainer>
        <div className="buts">
          <button className="next" onClick={() => setSiguiente(!siguiente)}>
            {" "}
            Siguiente
          </button>
          <button className="restart" onClick={() => window.location.reload()}>
            {" "}
            Reiniciar
          </button>
        </div>

        <div className="casa"></div>
      </div>
      <div className="procesador">
        <UControl
          id="control"
          contadorPrograma={`${unidadControl.contadorPrograma}`}
          registroInstrucciones={`${unidadControl.registroInstrucciones}`}
          decodificador={`${op?.opNombre}`}
        ></UControl>
        <AContainer
          id="alu"
          acumulador={`${alu.acumulador}`}
          rEntrada={`${alu.registroEntrada}`}
        ></AContainer>
      </div>
    </div>
  );
}
export default App;
