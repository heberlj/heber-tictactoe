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

// Crear un puntero falso con CSS
const pointer = document.createElement('div');
pointer.className = 'fake-cursor';
pointer.style.position = 'absolute';
pointer.style.width = '24px';
pointer.style.height = '24px';
pointer.style.borderRadius = '50%';
pointer.style.backgroundColor = 'rgba(255, 69, 0, 0.6)'; // Naranja semi-transparente
pointer.style.border = '2px solid rgb(255, 69, 0)';
pointer.style.boxShadow = '0 0 10px rgba(255, 69, 0, 0.8)';
pointer.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)'; // Deslizamiento suave
pointer.style.zIndex = '9999';
pointer.style.pointerEvents = 'none';
pointer.style.opacity = '0'; // Oculto por defecto
pointer.style.transform = 'scale(1)';
document.body.appendChild(pointer);

// FUNCION IA PARA JUGAR
function hacerMovimiento(indice) {
    const gameCell = document.querySelectorAll('.game-cell');
    const cell = gameCell[indice];
    const badgeP2 = document.querySelector('.playerbadgep2');

    // Determinar retraso de "pensamiento" de la CPU (entre 1 y 2 segundos de forma segura)
    const num_aleatorio = Math.random() + 1;

    setTimeout(() => {
        // 1. Posicionar el puntero en el badge del CPU
        if (badgeP2) {
            const badgePos = badgeP2.getBoundingClientRect();
            pointer.style.left = `${badgePos.left + window.scrollX + (badgePos.width / 2) - 12}px`;
            pointer.style.top = `${badgePos.top + window.scrollY + (badgePos.height / 2) - 12}px`;
        }

        // 2. Mostrar puntero
        pointer.style.opacity = '1';
        pointer.style.transform = 'scale(1.2)';

        // 3. Deslizar al centro de la celda seleccionada
        setTimeout(() => {
            const cellPos = cell.getBoundingClientRect();
            pointer.style.left = `${cellPos.left + window.scrollX + (cellPos.width / 2) - 12}px`;
            pointer.style.top = `${cellPos.top + window.scrollY + (cellPos.height / 2) - 12}px`;
            pointer.style.transform = 'scale(1)';

            // 4. Ejecutar el click después de deslizarse (600ms)
            setTimeout(() => {
                pointer.style.transform = 'scale(0.7)'; // Efecto presionar click

                setTimeout(() => {
                    cell.click();
                    pointer.style.transform = 'scale(1)';

                    // Desvanecer puntero
                    setTimeout(() => {
                        pointer.style.opacity = '0';
                    }, 200);
                }, 150);
            }, 600);
        }, 200);

    }, num_aleatorio * 1000);
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
            const nombreGanador = (ficha === 'x') ? nameP1 : nameP2;

            setTimeout(() => {
                document.querySelector('.resultado-container-ganador').classList.remove('hidden');
                document.querySelector('.resultado-container-ganador .nombre-pj').innerText = nombreGanador;
            }, 1000)

            // actualiza rperdedor
            const nombrePerdedor = (ficha === 'x') ? nameP2 : nameP1;
            document.querySelector('.resultado-container-perdedor .nombre-pj').innerText = nombrePerdedor;

            const ganadas = (ficha) === 'x' ? 'ganadasP1' : 'ganadasP2';
            localStorage.setItem(ganadas, (Number(localStorage.getItem(ganadas)) ?? 0) + 1);
            actualizarUI();
            localStorage.setItem('juego-terminado', 'true');
            hayganador = true;
            break;
        }
    }

    // Evaluar si hay empate
    if (!estadoactual.includes(null) && !hayganador) {
        document.querySelector('.empate-container').classList.remove('hidden');
        localStorage.setItem('empates', (Number(localStorage.getItem('empates')) ?? 0) + 1);
        actualizarUI();
        localStorage.setItem('juego-terminado', 'true');
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

    localStorage.setItem('juego-terminado', 'false');
}

actualizarUI()



// EVENTOS
const cells = document.querySelectorAll('.game-cell');

// click en celdas
cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
        const turnoDePlayer1 = localStorage.getItem('turnoplayer1') === "true"

        if (turnoDePlayer1) {
            avatar1.classList.add('avatarname-disable')
            avatar2.classList.remove('avatarname-disable')
            cell.querySelector('.x').style.display = 'block';
            cell.style.pointerEvents = "none";
            localStorage.setItem('turnoplayer1', "false");
            cell.setAttribute('data-value', 'x');
            evaluarEstadoActual('x');

            const juegoTerminado = localStorage.getItem('juego-terminado') === 'true'

            if (!localStorage.getItem('player2') && !juegoTerminado) {
                movimientoCPU();
            }
        } else {
            // Permitir el click si es programático (CPU) o si es manual en modo PVP (Jugador vs Jugador)
            if (!e.isTrusted || localStorage.getItem('player2')) {
                cell.querySelector('.o').style.display = 'block';
                avatar1.classList.remove('avatarname-disable')
                avatar2.classList.add('avatarname-disable')
                cell.style.pointerEvents = "none";
                localStorage.setItem('turnoplayer1', "true")
                cell.setAttribute('data-value', 'o');
                evaluarEstadoActual('o')
            }
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
    localStorage.setItem('juego-terminado', 'false');
    window.location.reload()
})

// Boton Reiniciar Victoria
btnReiniciarVictoria.addEventListener('click', () => {
    localStorage.setItem('juego-terminado', 'false');
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