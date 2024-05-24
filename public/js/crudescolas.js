// Função para adicionar/editar escola
function salvarEscola() {
    // Obtenha o ID do usuário atualmente logado
    const userId = firebase.auth().currentUser.uid;

    const escolaId = document.getElementById('escolaId').value;
    const nomeEscola = document.getElementById('nomeEscola').value;
    const ruaEscola = document.getElementById('ruaEscola').value;
    const numeroRua = document.getElementById('numeroRua').value;
    const contatoEscola = document.getElementById('contatoEscola').value;

    const novaEscola = {
        nomeEscola: nomeEscola,
        ruaEscola: ruaEscola,
        numeroRua: parseInt(numeroRua),
        contatoEscola: contatoEscola
    };

    if (escolaId) {
        firebase.database().ref('users/' + userId + '/escolas/' + escolaId).update(novaEscola)
            .then(() => {
                Swal.fire('Sucesso!', 'Escola atualizada com sucesso!', 'success');
                resetFormulario();
            })
            .catch((error) => {
                console.error('Erro ao atualizar escola: ', error);
            });
    } else {
        const idEscola = "idEscola" + Date.now();
        firebase.database().ref('users/' + userId + '/escolas/' + idEscola).set(novaEscola)
            .then(() => {
                Swal.fire('Sucesso!', 'Escola adicionada com sucesso!', 'success');
                resetFormulario();
            })
            .catch((error) => {
                console.error('Erro ao adicionar escola: ', error);
            });
    }
}

// Função para excluir escola e dados associados
function excluirEscola(escolaId) {
    const userId = firebase.auth().currentUser.uid;
    Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação excluirá a escola e todos os dados associados. Esta ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar',
        dangerMode: true,
    }).then((result) => {
        if (result.isConfirmed) {
            const escolaRef = firebase.database().ref('users/' + userId + '/escolas/' + escolaId);

            escolaRef.remove()
                .then(() => {
                    Swal.fire('Sucesso!', 'Escola excluída com sucesso!', 'success');
                })
                .catch((error) => {
                    console.error('Erro ao excluir escola: ', error);
                });
        }
    });
}

// Função para preencher o formulário com os dados da escola para edição
function editarEscola(escolaId, nome, rua, numero, contato) {
    document.getElementById('escolaId').value = escolaId;
    document.getElementById('nomeEscola').value = nome;
    document.getElementById('ruaEscola').value = rua;
    document.getElementById('numeroRua').value = numero;
    document.getElementById('contatoEscola').value = contato;
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const userId = user.uid;
        const escolasRef = firebase.database().ref('users/' + userId + '/escolas');

        escolasRef.on('value', (snapshot) => {
            const listaEscolas = document.getElementById('listaEscolas');
            listaEscolas.innerHTML = '';

            snapshot.forEach((childSnapshot) => {
                const escola = childSnapshot.val();
                const escolaId = childSnapshot.key;

                // Criar a div da escola
                const escolaDiv = document.createElement('div');
                escolaDiv.classList.add('escola-item');
                escolaDiv.classList.add('card'); // Adiciona estilo de cartão

                escolaDiv.innerHTML = `
                    <div class="card-header" onclick="toggleDetalhesEscola(this)">
                        <p class="nome-clicavel"><strong>Nome:</strong> ${escola.nomeEscola} <span class="seta-icone">&#9660;</span></p>
                    </div>
                    <div class="detalhes-escola" style="display: none;">
                        <div class="card-body">
                            <p><strong>Endereço:</strong> ${escola.ruaEscola}, ${escola.numeroRua}</p>
                            <p><strong>Contato:</strong> ${escola.contatoEscola}</p>
                            <button class="btn editar-btn" onclick="editarEscola('${escolaId}', '${escola.nomeEscola}', '${escola.ruaEscola}', '${escola.numeroRua}', '${escola.contatoEscola}')">Editar</button>
                            <button class="btn excluir-btn" onclick="excluirEscola('${escolaId}')">Excluir</button>
                        </div>
                    </div>
                `;

                listaEscolas.appendChild(escolaDiv);
            });
        });
    }
});

// Função para alternar a visibilidade dos detalhes da escola e modificar o ícone da seta
function toggleDetalhesEscola(element) {
    const detalhesEscola = element.nextElementSibling;
    const setaIcone = element.querySelector('.seta-icone');
    if (detalhesEscola.style.display === 'none') {
        detalhesEscola.style.display = 'block';
        setaIcone.innerHTML = '&#9650;'; // Altera o ícone para a seta para cima
    } else {
        detalhesEscola.style.display = 'none';
        setaIcone.innerHTML = '&#9660;'; // Altera o ícone para a seta para baixo
    }
}

// Função para limpar o formulário
function resetFormulario() {
    document.getElementById('formEscola').reset();
    document.getElementById('escolaId').value = '';
}
