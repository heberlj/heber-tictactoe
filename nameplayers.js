
const inputP1 = document.querySelector('#player1-input');
const inputP2 = document.querySelector('#player2-input');
const btnStart = document.querySelector('#btn-start');
const isInput2Present = inputP2 != null;

// FUNCION PARA HABILITAR EL BOTON DE START
function enablebtn() {

    let validado = false;

    if (isInput2Present) {
        validado = inputP1.value.length > 2 && inputP2.value.length > 2;
    } else {
        validado = inputP1.value.length > 2
    }

    if (validado) {
        btnStart.classList.remove('disable')
    } else {
        btnStart.classList.add('disable')
    }
}

// EVENTOS QUE LLAMAN A LA FUNCION ENABLEBTN
inputP1.addEventListener('keyup', enablebtn)
inputP2?.addEventListener('keyup', enablebtn)

// EVENTO QUE GUARDA LOS DATOS EN LOCALSTORAGE
btnStart.addEventListener('click', () => {
    localStorage.setItem('player1', inputP1.value)

    if (isInput2Present) {
        localStorage.setItem('player2', inputP2.value)
    } else {
        localStorage.removeItem('player2');
    }
})

// INICIALIZAR 
localStorage.removeItem('player1');
localStorage.removeItem('player2');
localStorage.removeItem('turnoplayer1');
localStorage.removeItem('ganadasP1');
localStorage.removeItem('ganadasP2');
localStorage.removeItem('empates');

