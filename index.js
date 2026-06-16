console.clear();
console.log("Hello world");


function mostrarPantalla(nombrePantalla) {
    document.querySelectorAll(".pantalla").style.display = "none";
    document.querySelector(nombrePantalla).style.display = "block";
}