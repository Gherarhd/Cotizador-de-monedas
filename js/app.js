const criptoSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objCripto = {
  moneda: "",
  criptomoneda: "",
};

const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);
  criptoSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((consulta) => consulta.json())
    .then((respuesta) => obtenerCriptomonedas(respuesta.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

const selectCriptomonedas = (criptomonedas) => {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptoSelect.appendChild(option);
  });
};

function leerValor(e) {
  objCripto[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();
  const { moneda, criptomoneda } = objCripto;
  if (moneda === "" || criptomoneda === "") {
    imprimirAlerta("Ambos campos son obligatorios");

    return;
  }
  //consultar la API con los resultados
  consultarApi();
}

const imprimirAlerta = (mensaje) => {
  const existeError = document.querySelector(".error");

  if (!existeError) {
    const divMensaje = document.createElement("DIV");
    divMensaje.classList.add("error");
    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  return;
};

function consultarApi() {
  const { moneda, criptomoneda } = objCripto;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) =>
      mostrarCotizaccion(resultado.DISPLAY[criptomoneda][moneda])
    );
}

function mostrarCotizaccion(cotizacion) {
  const { criptomoneda } = objCripto;
  const { PRICE, FROMSYMBOL, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } =
    cotizacion;
  limpiarHTML(resultado);
  resultado.classList.add("resultadoCreate");

  const simbolo = document.createElement("h2");
  simbolo.innerHTML = `${criptomoneda} - ${FROMSYMBOL}`;

  const precio = document.createElement("P");
  precio.classList.add("precio");
  precio.innerHTML = `Precio actual : <span> ${PRICE} </span>`;

  const precioAlto = document.createElement("P");
  precioAlto.innerHTML = `El precio más alto del dia <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement("P");
  precioBajo.innerHTML = `El precio más bajo del dia <span>${LOWDAY}</span>`;

  const precioCambio = document.createElement("P");
  precioCambio.innerHTML = `Variación últimas 24 horas <span>${CHANGEPCT24HOUR} %</span>  `;

  const ultimaActualizacion = document.createElement("P");
  ultimaActualizacion.innerHTML = `Última actualización <span>${LASTUPDATE} </span>  `;

  resultado.appendChild(simbolo);
  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(precioCambio);
  resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

const mostrarSpinner = () => {
  limpiarHTML(resultado);
  const spinner = document.createElement("DIV");
  spinner.classList.add("sk-chase");
  spinner.innerHTML = ` 
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>`;
  resultado.classList.remove("resultadoCreate");
  resultado.appendChild(spinner);
};
