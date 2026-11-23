import * as gestionPresupuesto from "./gestionPresupuesto.js";

function mostrarDatoEnId(idElemento, valor) {
  let elemento = document.getElementById(idElemento);
  elemento.textContent = valor;
}

function repintar() {
    mostrarDatoEnId("presupuesto", gestionPresupuesto.mostrarPresupuesto());

    mostrarDatoEnId(
        "gastos-totales",
        gestionPresupuesto.calcularTotalGastos().toFixed(2)
    );

    mostrarDatoEnId(
        "balance-total",
        gestionPresupuesto.calcularBalance().toFixed(2)
    );

    let listado = document.getElementById("listado-gastos-completo");
    listado.innerHTML = "";

    let listaGastos = gestionPresupuesto.listarGastos();

    for (let gasto of listaGastos) {
        mostrarGastoWeb("listado-gastos-completo", gasto);
    }
}

function actualizarPresupuestoWeb() {
    let nuevoPresupuesto = Number(prompt("Introduce el nuevo presupuesto:"));
    gestionPresupuesto.actualizarPresupuesto(nuevoPresupuesto);
    repintar();
}

let botonActualizar = document.getElementById("actualizarpresupuesto");
botonActualizar.addEventListener("click", actualizarPresupuestoWeb);

function nuevoGastoWeb() {
    let descripcion = prompt("Introduce la descripción del gasto:");
    let valor = Number(prompt("Introduce el valor del gasto:"));
    let fecha = prompt("Introduce la fecha (yyyy-mm-dd):");
    let etiquetas = prompt("Introduce las etiquetas separadas por comas:");

    let etiquetasArray = etiquetas.split(",");

    let gasto = new gestionPresupuesto.CrearGasto(
        descripcion,
        valor,
        fecha,
        ...etiquetasArray
    );

    gestionPresupuesto.anyadirGasto(gasto);
    repintar();
}

let botonAnyadir = document.getElementById("anyadirgasto");
botonAnyadir.addEventListener("click", nuevoGastoWeb);

function EditarHandle() {
  this.handleEvent = function() {

    let descripcion = prompt("Introduce la descripción:", this.gasto.descripcion);
    let valor = Number(prompt("Introduce el valor:", this.gasto.valor));
    let fecha = prompt("Introduce la fecha (yyyy-mm-dd):", new Date(this.gasto.fecha).toISOString().substring(0, 10));
    let etiquetas = prompt("Introduce las etiquetas separadas por comas:", this.gasto.etiquetas.join(","));

    let etiquetasArray = etiquetas.split(",");

    this.gasto.actualizarDescripcion(descripcion);
    this.valor.actualizarValor(valor);
    this.fecha.actualizarFecha(fecha);
    this.gasto.borrarEtiquetas(...this.gasto.etiquetas);
    this.gasto.anyadirEtiquetas(...etiquetasArray);

    repintar();
  };
}

function BorrarHandle() {
  this.handleEvent = function() {
    gestionPresupuesto.borrarGasto(this.gasto.id);
    repintar();
  }
}

function BorrarEtiquetasHandle() {
  this.handleEvent = function() {
    gestionPresupuesto.borrarEtiquetas(this.etiqueta);
    repintar();
  }
}

function mostrarGastoWeb(idElemento, gasto) {

  let elemento = document.getElementById(idElemento);

  let divGasto = document.createElement("div");
  divGasto.className = "gasto";

  let descripcion = document.createElement("div");
  descripcion.className = "gasto-descripcion";
  descripcion.textContent = gasto.descripcion;

  let fecha = document.createElement("div");
  fecha.className = "gasto-fecha";
  fecha.textContent = new Date(gasto.fecha).toLocaleString();

  let valor = document.createElement("div");
  valor.className = "gasto-valor";
  valor.textContent = gasto.valor;

  let etiquetas = document.createElement("div");
  etiquetas.className = "gasto-etiquetas";

  for (let etiqueta of gasto.etiquetas) {

    let span = document.createElement("span");
    span.className = "gasto-etiquetas-etiqueta";
    span.textContent = etiqueta;

    etiquetas.append(span);
  }

  divGasto.append(descripcion);
  divGasto.append(fecha);
  divGasto.append(valor);
  divGasto.append(etiquetas);

  elemento.append(divGasto);
}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {

  let elemento = document.getElementById(idElemento);

  let divAgrupacion = document.createElement("div");
  divAgrupacion.className = "agrupacion";

  let titulo = document.createElement("h1");

  if (periodo === "dia") {
    titulo.textContent = "Gastos agrupados por día";
  } else if (periodo === "mes") {
    titulo.textContent = "Gastos agrupados por mes";
  } else {
    titulo.textContent = "Gastos agrupados por año";
  }

  divAgrupacion.append(titulo);

  for (let clave in agrup) {

    let divDato = document.createElement("div");
    divDato.className = "agrupacion-dato";

    let spanClave = document.createElement("span");
    spanClave.className = "agrupacion-dato-clave";
    spanClave.textContent = clave + "      ||       ";

    let spanValor = document.createElement("span");
    spanValor.className = "agrupacion-dato-valor";
    spanValor.textContent = agrup[clave].toFixed(2) + " euros";

    divDato.append(spanClave);
    divDato.append(spanValor);

    divAgrupacion.append(divDato);
  }

  elemento.append(divAgrupacion);
}

export {
  mostrarDatoEnId,
  mostrarGastoWeb,
  mostrarGastosAgrupadosWeb
};