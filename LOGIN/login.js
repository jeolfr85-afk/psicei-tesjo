btnLogin.addEventListener("click", async (event) => {
    event.preventDefault();
  
    if (username.value.trim() === "" || password.value.trim() === "") {
      mostrarMensaje("Completa todos los campos", "error");
      return;
    }
  
    btnLogin.disabled = true;
  
    const form = new FormData();
    form.append("usuario", username.value);
    form.append("password", password.value);
  
    try {
      const response = await fetch("login.php", {
        method: "POST",
        body: form,
      });
  
      const json = await response.json();
  
      if (!json || json.error) {
        mostrarMensaje(json.error || "Usuario o contraseña incorrectos.", "error");
        btnLogin.disabled = false;
        return;
      }
  
      // Guardar datos si quieres
      sessionStorage.setItem("user", JSON.stringify(json));
  
      mostrarMensaje("Inicio de sesión exitoso", "success");
      setTimeout(() => {
        window.location.href = "login.php";
      }, 1000);
  
    } catch (error) {
      console.error("Error en la solicitud:", error);
      mostrarMensaje("Error de conexión con el servidor", "error");
    } finally {
      btnLogin.disabled = false;
    }
  });
  