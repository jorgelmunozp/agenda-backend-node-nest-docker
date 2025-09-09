interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    username: string;
    password: string;
  };
}

const form = document.getElementById("login-form") as HTMLFormElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const payload: LoginRequest = {
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

    const data: LoginResponse = await response.json();
    alert(`Login exitoso, bienvenido ${data.user.username}`);
  } catch (error) {
    console.error("Error en el login:", error);
    alert("No se pudo iniciar sesión");
  }
});
