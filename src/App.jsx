import { useState, useEffect } from "react";
import "./App.css";
import UControl from "./Components/UControl.jsx";
import UControl2 from "./Components/UControl2.jsx";
import MContainer from "./Components/Mcontainer.jsx";
import { Memoria } from "./vonNeumannArchitecture/memoria.js";
import { Alu } from "./vonNeumannArchitecture/ALU.js";
import AContainer from "./Components/AContainer.jsx";
import { UnidadControl } from "./vonNeumannArchitecture/UnidadControl.js";

function App() {
  // ((2 ^ 2) + 2) ^ 2 = 36
  const [unidadControl, setUnidadControl] = useState(new UnidadControl());
  const [memoria, setMemoria] = useState(new Memoria());
  const [alu, setAlu] = useState(new Alu());
  const [op, setOp] = useState({ opNombre: "..." });
  const [contador, setContador] = useState(0);
  const [siguiente, setSiguiente] = useState(true);
  const [vector, setvector] = useState([""]);


  //Segunda alu y UC
  const [unidadControl2, setUnidadControl2] = useState(new UnidadControl());
  const [alu2, setAlu2] = useState(new Alu());
  const [op2, setOp2] = useState({ opNombre: "..." });
  const [contador2, setContador2] = useState(0);
  
  // Variables para ejecución paralela
  const [pasoUC1, setPasoUC1] = useState(true);
  const [procesoTerminado, setProcesoTerminado] = useState(false);
  const [potenciaDetectada, setPotenciaDetectada] = useState(false);

  useEffect(() => {
    document.title = "Arquitectura Von Neumann";
  }, []);

  useEffect(() => {
    setvector(memoria.contenido);
  }, []);

  // useEffect para ejecutar ambas UCs en paralelo
  useEffect(() => {
    if (procesoTerminado) return;
    
    
    // Ejecutar ambas UCs en paralelo
    if (pasoUC1) {
      ejecutarCicloUC1();
    }
    
    // Ejecutar UC2 si está activada
    if (potenciaDetectada || contador2 > 0) {
      ejecutarCicloUC2();
    }
    
  }, [siguiente]);

  // Función para ejecutar un ciclo en la UC1
  const ejecutarCicloUC1 = () => {
    console.log(`UC1 case ${contador}`);
    switch (contador) {
      //Actualiza el registro de direcciones de la memoria con el contador de programa de la unidad de control
      case 0:
        setMemoria((prevMemoria) => {
          return {
            ...prevMemoria,
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
        setMemoria((prevMemoria) => {
          return {
            ...prevMemoria,
            registroDatos:
              prevMemoria.contenido[parseInt(prevMemoria.registroDirecciones)],
          };
        });
        setContador((contador + 1) % 8);
        break;

      case 3:
        setUnidadControl((prevObj) => {
          const nuevoObj = Object.create(Object.getPrototypeOf(prevObj));
          console.log("UC1 registroDatos:", memoria.registroDatos);
          return Object.assign(nuevoObj, prevObj, {
            registroInstrucciones: memoria.registroDatos,
          });
        });
        setContador((contador + 1) % 8);
        break;

      case 4:
        setOp(() => {
          const andom = unidadControl.decode();
          
          // Detectar si es una operación de potencia y activar UC2
          if (andom.opNombre === "^") {
            console.log("UC1: Símbolo de potencia detectado, activando UC2");
            setPotenciaDetectada(true);
            // Sincronizar con UC2 - también mostrar el símbolo en UC2
            setOp2({ opNombre: "^" });
          }
          
          setMemoria((prevMemoria) => ({
            ...prevMemoria,
            registroDirecciones: parseInt(parseInt(andom.operando, 2)),
          }));
          return andom;
        });
        setContador((contador + 1) % 8);
        break;

      //Se setea el registro de datos de la memoria con el operando buscado
      case 5:
        setMemoria((prevMemoria) => ({
          ...prevMemoria,
          registroDatos: prevMemoria.contenido[parseInt(op?.operando, 2)],
        }));
        setContador((contador + 1) % 8);
        break;

      //Se le envia a la ALU el valor del registro de datos de la memoria y la ALU
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
        if (op?.opNombre === "+") {
          console.log("UC1: Suma realizada", alu.suma());
        }
        if (op?.opNombre === "^") {
          console.log("UC1: Potencia realizada", alu.potencia());
        }
        if (op?.opNombre === "S") {
          let tpm = [...memoria.contenido];
          tpm[parseInt(op?.operando, 2)] = alu.acumulador;
          setMemoria((prevMemoria) => ({ 
            ...prevMemoria, 
            contenido: tpm 
          }));
          console.log("UC1: Almacenado valor", alu.acumulador, "en posición", parseInt(op?.operando, 2));
        }
        if (op?.opNombre === "...") {
          console.log("UC1: Fin de la ejecución");
          setPasoUC1(false);
          alert(`Fin de la ejecución. El resultado es: ${alu.acumulador}`); // Mostrar el banner cuando la ejecución finaliza
          // No mostramos alerta aquí, ya que ahora se maneja en el useEffect
          break;
        }
        setContador((contador + 1) % 8);
        break;
    }
  };

  // Función para ejecutar un ciclo en la UC2 (procesa la segunda parte del cálculo)
  const ejecutarCicloUC2 = () => {
    console.log(`UC2 case ${contador2}`);
    
    switch (contador2) {
      case 0:
        // Cuando se detecta potencia en UC1, UC2 comienza inmediatamente
        if (potenciaDetectada) {
          // UC2 trabaja con la dirección 2 (valor 2)
          setUnidadControl2((prevObj) => {
            const nuevoObj = Object.create(Object.getPrototypeOf(prevObj));
            return Object.assign(nuevoObj, prevObj, {
              contadorPrograma: 2, // Dirección del valor 2
              registroInstrucciones: memoria.registroDatos // Sincronizar con UC1
            });
          });
          // Ya sabemos que necesitaremos hacer una potencia al final, mantener el ^
          setOp2({ opNombre: "^" });
          setContador2((contador2 + 1) % 8);
        }
        break;

      case 1:
        // Cargar el valor 2 directamente de la memoria
        setAlu2((prevObj) => {
          const nuevoObj = Object.create(Object.getPrototypeOf(prevObj));
          // Inicializar con 2 (valor en posición 2 de la memoria)
          const valorInicial = memoria.contenido[2];
          console.log("UC2: Cargando valor inicial", valorInicial);
          return Object.assign(nuevoObj, prevObj, {
            acumulador: 0, 
            registroEntrada: valorInicial
          });
        });
        setOp2({ opNombre: "..." });
        setContador2((contador2 + 1) % 8);
        break;

      case 2:
        // Operación de suma directa: acumulador + registroEntrada (0 + 2 = 2)
        setAlu2((prevObj) => {
          const nuevoObj = Object.create(Object.getPrototypeOf(prevObj));
          return Object.assign(nuevoObj, prevObj, {
            acumulador: prevObj.acumulador + parseInt(prevObj.registroEntrada)
          });
        });
        console.log("UC2: Primera suma realizada");
        setOp2({ opNombre: "+" });
        setContador2((contador2 + 1) % 8);
        break;

      case 3:
        // Esperar a que UC1 haya calculado 2^2 y lo almacene en memoria (posición 4)
        if (op?.opNombre === "S" && parseInt(op?.operando, 2) === 4) {
          console.log("UC2: Detectado valor 2^2 en memoria");
          // Establecer decodificador a LOAD para indicar que vamos a cargar un valor
          setOp2({ opNombre: "..." });
          // Continuar con el siguiente paso
          setContador2((contador2 + 1) % 8);
        }
        break;

      case 4:
        // Cargar el resultado 2^2 (4) de la memoria y sumarlo a nuestro acumulador (2)
        setAlu2((prevObj) => {
          const nuevoObj = Object.create(Object.getPrototypeOf(prevObj));
          // Obtenemos el resultado de 2^2 de la memoria (posición 4)
          const valorPotencia = memoria.contenido[4]; 
          console.log("UC2: Cargando valor 2^2", valorPotencia);
          return Object.assign(nuevoObj, prevObj, {
            registroEntrada: valorPotencia
          });
        });
        setOp2({ opNombre: "+" });
        setContador2((contador2 + 1) % 8);
        break;

      case 5:
        // Realizar la suma: (2) + (4) = 6
        setAlu2((prevObj) => {
          const nuevoObj = Object.create(Object.getPrototypeOf(prevObj));
          const resultado = prevObj.acumulador + parseInt(prevObj.registroEntrada);
          console.log("UC2: Suma de 2 + 2^2 =", resultado);
          return Object.assign(nuevoObj, prevObj, {
            acumulador: resultado
          });
        });
        setOp2({ opNombre: "S" });
        setContador2((contador2 + 1) % 8);
        break;

      case 6:
        // Almacenar resultado parcial en memoria
        { const tmpArray = [...memoria.contenido];
        tmpArray[5] = alu2.acumulador;
        setMemoria((prevMemoria) => ({
          ...prevMemoria,
          contenido: tmpArray
        }));
        console.log("UC2: Almacenado (2^2)+2 =", alu2.acumulador, "en posición 5");
        // Ahora mostramos que vamos a realizar la potencia final
        setOp2({ opNombre: "^" });
        setContador2((contador2 + 1) % 8);
        break; }

        case 7:
          // Calcular resultado final: ((2^2)+2)^2 (elevar 6 al cuadrado)
          { setAlu2((prevObj) => {
            const nuevoObj = Object.create(Object.getPrototypeOf(prevObj));
            const resultado = Math.pow(prevObj.acumulador, 2);
            console.log("UC2: Potencia de ((2^2)+2)^2 =", resultado);
            return Object.assign(nuevoObj, prevObj, {
              acumulador: resultado
            });
          });
          
          // Almacenar el resultado final en la memoria
          const tmpMemoria = [...memoria.contenido];
          tmpMemoria[6] = alu2.acumulador;
          setMemoria((prevMemoria) => ({
            ...prevMemoria,
            contenido: tmpMemoria
          }));
          
          console.log("UC2: Resultado final almacenado:", alu2.acumulador);
          
          // Marcar que UC2 ha terminado
          setOp2({ opNombre: "S" });
        
          // Mostrar alerta si ambas UC han terminado
          if (!pasoUC1 && op2?.opNombre === "FIN") {
            alert("Fin de la ejecución");
          }
          
          
          // Resetear potenciaDetectada pero mantener contador2 en 0
          setPotenciaDetectada(false);
          setContador2(0);
          break; }
    }
  };

  return (
    <div>
      {/* Contenedor para UC y ALU */}
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
      <div className="procesador2">
        <UControl2
          id="control"
          contadorPrograma={`${unidadControl2.contadorPrograma}`}
          registroInstrucciones={`${unidadControl2.registroInstrucciones}`}
          decodificador={`${op2?.opNombre}`}
        ></UControl2>
        <AContainer
          id="alu2"
          acumulador={`${alu2.acumulador}`}
          rEntrada={`${alu2.registroEntrada}`}
        ></AContainer>
      </div>

      {/* Contenedor para Memoria y botones */}
      <div className="memory">
        <MContainer
          vector={vector}
          content={`${memoria.registroDirecciones}`}
          content1={`${memoria.registroDatos}`}
        ></MContainer>
        <div className="buts">
          <button 
            className="next" 
            onClick={() => setSiguiente(!siguiente)}
            disabled={procesoTerminado}
          >
            Siguiente
          </button>
          <button className="restart" onClick={() => window.location.reload()}>
            Reiniciar
          </button>
        </div>
      </div>
      
      
      {/* Indicador de estado */}
      <div style={{ textAlign: 'center', margin: '10px', padding: '10px', backgroundColor: '#e3edd2', borderRadius: '5px' }}>
        <h3>Estado de ejecución paralela</h3>
        <p>UC1: {pasoUC1 ? "En ejecución" : "Finalizado"} - Paso: {contador}</p>
        <p>UC2: {contador2 > 0 ? "En ejecución" : "Esperando/Finalizado"} - Paso: {contador2}</p>
        <p>Operación: ((2^2) + 2)^2 = 36</p>
      </div>
    </div>
  );
}
export default App;