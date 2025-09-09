"use strict";
const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
        username: usernameInput.value,
        password: passwordInput.value,
    };
    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        const data = await response.json();
        alert(`Login exitoso, bienvenido ${data.user.username}`);
    }
    catch (error) {
        console.error("Error en el login:", error);
        alert("No se pudo iniciar sesión");
    }
});
//# sourceMappingURL=main.js.map