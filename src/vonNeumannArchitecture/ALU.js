export class Alu {
  constructor() {
    this.acumulador = 0;
    this.registroEntrada = 0;
  }
  suma() {
    const sumDecimal =
      parseInt(this.acumulador, 2) + parseInt(this.registroEntrada, 2);
    this.acumulador = Number(sumDecimal).toString(2);

    return this.acumulador;
  }

  potencia() {
    const expDecimal = Math.pow(
      parseInt(this.acumulador, 2),
      parseInt(this.registroEntrada, 2)
    );
    this.acumulador = Number(expDecimal).toString(2);
    return this.acumulador;
  }

  save() {
    return this.acumulador;
  }
  finalizar() {
    alert('fin del programa')
  }

}
