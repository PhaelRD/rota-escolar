// Função para login com Google
function googleLogin() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((result) => {
      // Login com Google bem-sucedido
      const user = result.user;
      console.log("Usuário autenticado com Google:", user);

      // Verificar se o usuário já existe no banco de dados
      firebase.database().ref('users/' + user.uid).once('value')
        .then((snapshot) => {
          if (!snapshot.exists()) {
            // O usuário não existe no banco de dados, criar novo registro
            firebase.database().ref('users/' + user.uid).set({
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              registros: 5 
              // Outros dados do usuário que você deseja armazenar
            })
            .then(() => {
              console.log("Novo usuário registrado no banco de dados");
            })
            .catch((error) => {
              console.error("Erro ao registrar novo usuário no banco de dados:", error);
            });
          }

          // Redirecionar para a página de usuário após o login
          window.location.href = "usuario.html";
        })
        .catch((error) => {
          console.error("Erro ao verificar usuário no banco de dados:", error);
        });
    })
    .catch((error) => {
      // Ocorreu um erro durante o login com Google
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Erro durante o login com Google:", errorMessage);
    });
}
