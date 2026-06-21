const player1 = document.querySelector('.player1name');
const player2 = document.querySelector('.player2name');
const avatar1 = document.querySelector('.avatar1name');
const avatar2 = document.querySelector('.avatar2name');
const statname1 = document.querySelector('.statname1');
const statname2 = document.querySelector('.statname2');




localStorage.setItem('turnoplayer1', "true");


// INICIALIZACION 
player1.innerText = localStorage.getItem('player1')
avatar1.innerText = localStorage.getItem('player1').slice(0, 2).toUpperCase()
statname1.innerText = localStorage.getItem('player1').slice(0, 2).toUpperCase()
statname2.innerText = localStorage.getItem('player2').slice(0, 2).toUpperCase()

if (localStorage.getItem('player2')) {
    player2.innerText = localStorage.getItem('player2')
    avatar2.innerText = localStorage.getItem('player2').slice(0, 2).toUpperCase()
} else {
    player2.innerText = 'Computadora'
    avatar2.innerText = 'CPU'
}

// EVENTOS
const cells = document.querySelectorAll('.game-cell');

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const turnoActual = localStorage.getItem('turnoplayer1') === "true"

        if (turnoActual) {
            avatar1.classList.add('avatarname-disable')
            avatar2.classList.remove('avatarname-disable')
            cell.querySelector('.x').style.display = 'block';
            cell.style.pointerEvents = "none";
            localStorage.setItem('turnoplayer1', "false")
        } else {
            cell.querySelector('.o').style.display = 'block';
            avatar1.classList.remove('avatarname-disable')
            avatar2.classList.add('avatarname-disable')
            cell.style.pointerEvents = "none";
            localStorage.setItem('turnoplayer1', "true")
        }

    })
})
