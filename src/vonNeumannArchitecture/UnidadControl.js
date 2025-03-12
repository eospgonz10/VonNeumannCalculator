export class UnidadControl {
  constructor() {
    this.decodificador = "";
    this.contadorPrograma = 0;
    this.registroInstrucciones = 0;
  }
  decode() {
    const tupla = {};
    const opCode = this.registroInstrucciones.slice(0, 4);
    if (opCode == "0000") {
      tupla["opNombre"] = "+";
    }
    if (opCode == "0011") {
      tupla["opNombre"] = "^";
    }
    if (opCode == "0111") {
      tupla["opNombre"] = "...";
    }
    if (opCode == "0110") {
      tupla["opNombre"] = "S";
    }
    tupla["operando"] = this.registroInstrucciones.slice(4, 8);
    return tupla;
  }
}
