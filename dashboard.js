const player1 = document.querySelector('.player1name');
const player2 = document.querySelector('.player2name');
const avatar1 = document.querySelector('.avatar1name');
const avatar2 = document.querySelector('.avatar2name');
const statp1 = document.querySelectorAll('.statname1');
const statp2 = document.querySelectorAll('.statname2');
const btncerrarempate = document.querySelector('#btn-cerrar-empate')
const btnresetboard = document.querySelector('#btn-reset-board')
const arrStatGanadasP1 = document.querySelectorAll('.stat-ganadasP1')
const arrStatGanadasP2 = document.querySelectorAll('.stat-ganadasP2')
const arrStatEmpates = document.querySelectorAll('.stat-empates')
const btnSalirvictoria = document.querySelector('#btn-salir-victoria')
const btnReiniciarVictoria = document.querySelector('#btn-reiniciar-victoria')
const btnatras = document.querySelector('#btn-back')


// Array con las combinaciones ganadoras
const combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// FUNCION IA PARA JUGAR
function hacerMovimiento(indice) {
    const gameCell = document.querySelectorAll('.game-cell');

    let num_aleatorio = Number(Math.random().toString().substring(3, 4))
    if (num_aleatorio > 2) {
        num_aleatorio = 2
    }
    if (num_aleatorio === 0) {
        num_aleatorio = 1
    }


    setTimeout(() => {
        gameCell[indice].click();
    }, num_aleatorio * 1000)
}

function movimientoCPU() {
    const celdas = document.querySelectorAll('.game-cell');
    const vacias = [];

    celdas.forEach((celda, index) => {
        if (!celda.getAttribute('data-value')) {
            vacias.push(index);
        }
    });

    if (vacias.length > 0) {
        const indiceAleatorio = vacias[Math.floor(Math.random() * vacias.length)];
        // Hacer click o marcar la celda correspondiente
        hacerMovimiento(indiceAleatorio);
    }
}

// FUNCIION PARA OBTENER EL ESTADO ACTUAL DEL TABLERO
function getEstadoActual() {
    let resultado = [];
    const cells = document.querySelectorAll('.game-cell');

    cells.forEach(cell => resultado.push(cell.getAttribute('data-value')))

    return resultado;
}

// FUNCION PARA EVALUAR EL ESTADO ACTUAL DEL TABLERO
function evaluarEstadoActual(ficha) {
    const estadoactual = getEstadoActual();
    let puntaje = [];
    let hayganador = false;

    for (const combinacion of combinacionesGanadoras) {
        puntaje = [];

        combinacion.forEach(n => {
            if (estadoactual[n] === ficha) {
                puntaje.push(1);
            } else {
                puntaje.push(0);
            }
        });

        // Evaluar si hay ganador
        if (!puntaje.includes(0)) {
            const nameP1 = localStorage.getItem('player1') || 'Player 1';
            const nameP2 = localStorage.getItem('player2') || 'CPU';
            const winnerName = (ficha === 'x') ? nameP1 : nameP2;

            document.querySelector('.resultado-container-ganador').classList.remove('hidden');
            document.querySelector('.resultado-container-ganador .nombre-pj').innerText = winnerName;

            // También actualizamos el perdedor por si acaso
            const loserName = (ficha === 'x') ? nameP2 : nameP1;
            document.querySelector('.resultado-container-perdedor .nombre-pj').innerText = loserName;

            const ganadas = (ficha) === 'x' ? 'ganadasP1' : 'ganadasP2';
            localStorage.setItem(ganadas, (Number(localStorage.getItem(ganadas)) ?? 0) + 1);
            actualizarUI();
            hayganador = true;
            break;
        }
    }

    // Evaluar si hay empate
    if (!estadoactual.includes(null) && !hayganador) {
        document.querySelector('.empate-container').classList.remove('hidden');
        localStorage.setItem('empates', (Number(localStorage.getItem('empates')) ?? 0) + 1);
        actualizarUI();
    }
}


localStorage.setItem('turnoplayer1', "true");


// INICIALIZACION 
function actualizarUI() {
    const nombreP1 = localStorage.getItem('player1') || 'Player 1';
    const nombreP2 = localStorage.getItem('player2') || 'CPU';

    player1.innerText = nombreP1;
    avatar1.innerText = nombreP1.slice(0, 2).toUpperCase();

    player2.innerText = nombreP2;
    avatar2.innerText = nombreP2.slice(0, 2).toUpperCase();

    statp1.forEach(el => {
        el.innerText = nombreP1.slice(0, 2).toUpperCase();
    });
    statp2.forEach(el => {
        el.innerText = nombreP2.slice(0, 2).toUpperCase();
    });

    arrStatGanadasP1.forEach(stat => {
        stat.innerText = (localStorage.getItem("ganadasP1") ?? 0) + ' GANADAS';
    });

    arrStatGanadasP2.forEach(stat => {
        stat.innerText = (localStorage.getItem("ganadasP2") ?? 0) + ' GANADAS';
    });

    arrStatEmpates.forEach(stat => {
        stat.innerText = (localStorage.getItem("empates") ?? 0) + ' EMPATES';
    });
}

actualizarUI()



// EVENTOS
const cells = document.querySelectorAll('.game-cell');

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const turnoDePlayer1 = localStorage.getItem('turnoplayer1') === "true"

        if (turnoDePlayer1) {
            avatar1.classList.add('avatarname-disable')
            avatar2.classList.remove('avatarname-disable')
            cell.querySelector('.x').style.display = 'block';
            cell.style.pointerEvents = "none";
            localStorage.setItem('turnoplayer1', "false");
            cell.setAttribute('data-value', 'x');
            evaluarEstadoActual('x')
            movimientoCPU();
        } else {
            cell.querySelector('.o').style.display = 'block';
            avatar1.classList.remove('avatarname-disable')
            avatar2.classList.add('avatarname-disable')
            cell.style.pointerEvents = "none";
            localStorage.setItem('turnoplayer1', "true")
            cell.setAttribute('data-value', 'o');
            evaluarEstadoActual('o')
        }

    })
})

// EVENTOS DE LOS BOTONES

// Boton Cerrar Empate
btncerrarempate.addEventListener('click', () => {
    document.querySelector('.empate-container').classList.add('hidden');
})

// Boton Reset Board
btnresetboard.addEventListener('click', () => {
    window.location.reload()
})

// Boton Reiniciar Victoria
btnReiniciarVictoria.addEventListener('click', () => {
    window.location.reload()
})

// Boton Salir Victoria
btnSalirvictoria.addEventListener('click', () => {
    window.location.href = 'selectmode.html'
})

// Boton Atras
btnatras.addEventListener('click', () => {
    window.location.href = 'selectmode.html'
})