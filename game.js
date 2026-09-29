const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");

const jugadorTexto = document.getElementById("jugador");
const maquinaTexto = document.getElementById("maquina");

let puntosJugador = 0;
let puntosMaquina = 0;

const palaJugador = {
    x: 20,
    y: 175,
    ancho: 12,
    alto: 100,
    velocidad: 6
};

const palaMaquina = {
    x: 768,
    y: 175,
    ancho: 12,
    alto: 100,
    velocidad: 4
};

const pelota = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radio: 8,
    velocidadX: 5,
    velocidadY: 3
};

let arriba = false;
let abajo = false;

document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "w") arriba = true;
    if (event.key.toLowerCase() === "s") abajo = true;
});

document.addEventListener("keyup", function(event) {
    if (event.key.toLowerCase() === "w") arriba = false;
    if (event.key.toLowerCase() === "s") abajo = false;
});

function moverJugador() {
    if (arriba && palaJugador.y > 0) {
        palaJugador.y -= palaJugador.velocidad;
    }

    if (abajo && palaJugador.y + palaJugador.alto < canvas.height) {
        palaJugador.y += palaJugador.velocidad;
    }
}

function moverMaquina() {
    const centro = palaMaquina.y + palaMaquina.alto / 2;

    if (pelota.y < centro - 10) palaMaquina.y -= palaMaquina.velocidad;
    if (pelota.y > centro + 10) palaMaquina.y += palaMaquina.velocidad;

    if (palaMaquina.y < 0) palaMaquina.y = 0;

    if (palaMaquina.y + palaMaquina.alto > canvas.height) {
        palaMaquina.y = canvas.height - palaMaquina.alto;
    }
}

function reiniciarPelota(direccion) {
    pelota.x = canvas.width / 2;
    pelota.y = canvas.height / 2;
    pelota.velocidadX = 5 * direccion;
    pelota.velocidadY = Math.random() > 0.5 ? 3 : -3;
}

function moverPelota() {
    pelota.x += pelota.velocidadX;
    pelota.y += pelota.velocidadY;

    if (
        pelota.y - pelota.radio <= 0 ||
        pelota.y + pelota.radio >= canvas.height
    ) {
        pelota.velocidadY *= -1;
    }

    if (
        pelota.x - pelota.radio <= palaJugador.x + palaJugador.ancho &&
        pelota.y >= palaJugador.y &&
        pelota.y <= palaJugador.y + palaJugador.alto &&
        pelota.velocidadX < 0
    ) {
        pelota.velocidadX *= -1;
    }

    if (
        pelota.x + pelota.radio >= palaMaquina.x &&
        pelota.y >= palaMaquina.y &&
        pelota.y <= palaMaquina.y + palaMaquina.alto &&
        pelota.velocidadX > 0
    ) {
        pelota.velocidadX *= -1;
    }

    if (pelota.x < 0) {
        puntosMaquina++;
        maquinaTexto.textContent = puntosMaquina;
        reiniciarPelota(1);
    }

    if (pelota.x > canvas.width) {
        puntosJugador++;
        jugadorTexto.textContent = puntosJugador;
        reiniciarPelota(-1);
    }
}

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    ctx.fillRect(
        palaJugador.x,
        palaJugador.y,
        palaJugador.ancho,
        palaJugador.alto
    );

    ctx.fillRect(
        palaMaquina.x,
        palaMaquina.y,
        palaMaquina.ancho,
        palaMaquina.alto
    );

    ctx.beginPath();
    ctx.arc(pelota.x, pelota.y, pelota.radio, 0, Math.PI * 2);
    ctx.fill();

    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "#555";
    ctx.stroke();
    ctx.setLineDash([]);
}

function actualizar() {
    moverJugador();
    moverMaquina();
    moverPelota();
    dibujar();

    requestAnimationFrame(actualizar);
}

actualizar();