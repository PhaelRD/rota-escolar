function criarConvite() {
    const userId = firebase.auth().currentUser.uid;

    // Obter o número máximo permitido de registros do banco de dados
    firebase.database().ref('users/' + userId + '/registros').once('value')
        .then((snapshot) => {
            const numeroMaximoRegistros = snapshot.val();

            // Obter o número de alunos registrados pelo usuário
            firebase.database().ref('users/' + userId + '/alunos').once('value')
                .then((snapshot) => {
                    const numeroAlunosRegistrados = snapshot.numChildren();

                    if (numeroAlunosRegistrados >= numeroMaximoRegistros) {
                        // Exibir mensagem de erro se o limite máximo de registros for atingido
                        Swal.fire('Limite máximo atingido!', 'Você já atingiu o limite máximo de registros de alunos.', 'error');
                    } else {
                        // O número máximo de registros ainda não foi atingido, então pode gerar o convite
                        gerarConvite();
                    }
                })
                .catch((error) => {
                    console.error('Erro ao obter número de alunos registrados: ', error);
                });
        })
        .catch((error) => {
            console.error('Erro ao obter número máximo de registros: ', error);
        });
}

function gerarConvite() {
    // Obtenha o valor da mensalidade do formulário
    var valorMensalidade = document.getElementById("valorMensalidade").value;

    // Simples criptografia - apenas para ilustração, não é seguro!
    var userId = firebase.auth().currentUser.uid; // Obter o ID do usuário atual
    var uidCriptografado = btoa(userId); // Criptografar o ID do usuário
    var valorMensalidadeCriptografado = btoa(valorMensalidade); // Criptografar o valor da mensalidade

    // Construir o link do convite
    var linkConvite = "https://movelcompleto.web.app/convite.html?uid=" + uidCriptografado + "&valor=" + valorMensalidadeCriptografado;

    // Crie a mensagem do pop-up
    var mensagem = "Link do convite: <a href='" + linkConvite + "' target='_blank'>" + linkConvite + "</a>";

    // Utilize o SweetAlert2 para exibir a mensagem
    Swal.fire({
        title: 'Convite Criado!',
        html: mensagem,
        icon: 'success',
        showCloseButton: true,  // Mostra o botão de fechar
        showConfirmButton: false,  // Oculta o botão de confirmar
        customClass: {
            closeButton: 'swal2-styled',  // Estiliza o botão de fechar
        },
        footer: '<button id="copyButton" class="swal2-styled">Copiar Link</button>',  // Adiciona um botão no rodapé
        didRender: () => {
            // Adiciona um listener de clique ao botão de cópia
            document.getElementById('copyButton').addEventListener('click', function () {
                // Cria um elemento de input para copiar o texto
                var input = document.createElement('input');
                input.value = linkConvite;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);

                // Exibe uma mensagem de sucesso
                Swal.fire({
                    title: 'Link Copiado!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            });
        }
    });
}
