let visivel = false

function mostrarSenha() {
    document.getElementById('login-password').type = 'text'
    input.type = visivel ? "password" : "text"
    document.getElementById("olho").src = visivel
        ? "https://cdn0.iconfinder.com/data/icons/ui-icons-pack/100/ui-icon-pack-14-512.png"
        : "https://cdn-icons-png.flaticon.com/512/159/159604.png";
    visivel = !visivel
}

function ocultarSenha() {
    if (visivel) return
    document.getElementById('login-password').type = 'password';
}