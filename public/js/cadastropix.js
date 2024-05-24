// Função para salvar o número do PIX no banco de dados Firebase
function salvarNumeroPIX() {
    const numeroPix = document.getElementById('numeroPix').value;
    const userId = firebase.auth().currentUser.uid;

    // Referência para o nó "Pix" do usuário no banco de dados Firebase
    const pixRef = firebase.database().ref(`users/${userId}/Pix`);

    // Salva o número do PIX no banco de dados
    pixRef.set(numeroPix)
        .then(() => {
            // Número do PIX salvo com sucesso
            Swal.fire({
                icon: 'success',
                title: 'Número do PIX salvo com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });

        })
        .catch((error) => {
            console.error('Erro ao salvar número do PIX:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao salvar o número do PIX. Por favor, tente novamente.',
            });
        });
}

/////////////////////////////////////////////


// Obter elementos necessários
var modal = document.getElementById("myModal");
var btn = document.getElementById("abrirModal");
var span = document.getElementsByClassName("close")[0];

// Quando o botão for clicado, abrir o modal
btn.onclick = function() {
  modal.style.display = "block";
}

// Quando clicar no botão de fechar, fechar o modal
span.onclick = function() {
  modal.style.display = "none";
}

// Quando clicar fora do modal, fechar o modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
