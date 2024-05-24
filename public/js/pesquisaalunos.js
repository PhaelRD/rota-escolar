function pesquisarAlunos() {
    const termoPesquisa = document.getElementById('barraPesquisa').value.toLowerCase();
    const listaAlunos = document.getElementById('listaAlunos');
    listaAlunos.innerHTML = '';

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const userId = user.uid;
            const alunosRef = firebase.database().ref('users/' + userId + '/alunos');

            alunosRef.once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const aluno = childSnapshot.val();
                    const nomeAluno = aluno.nomeCompleto.toLowerCase(); // Convertendo para minúsculas para pesquisa

                    // Verificando se o nome do aluno contém o termo de pesquisa
                    if (nomeAluno.includes(termoPesquisa)) {
                        const alunoItem = document.createElement('div');
                        alunoItem.classList.add('aluno-item'); // Adicionando a classe aluno-item

                        // Adicionando o nome do aluno com um ícone de seta para baixo
                        alunoItem.classList.add('card'); // Classe para definir um estilo de cartão

                        alunoItem.innerHTML = `
                            <p class="nome-clicavel" onmouseover="changeCursor(this)" onmouseout="resetCursor(this)" onclick="toggleDetalhesAluno(this)"><strong>Nome:</strong> ${aluno.nomeCompleto} <span class="seta-icone">&#9660;</span></p>
                            <div class="detalhes-aluno" style="display: none;">
                                <p><strong>Idade:</strong> ${aluno.idade}</p>
                                <p><strong>Data de Vencimento:</strong> ${aluno.dataVencimento}</p>
                                <p><strong>Valor:</strong> ${aluno.valor}</p>
                                <p><strong>Período:</strong> ${aluno.periodo || 'N/A'}</p>
                                <p><strong>Endereço:</strong> ${aluno.endereco.ruaResidencia}, ${aluno.endereco.numeroRua}</p>
                                <p><strong>Responsável:</strong> ${aluno.responsavel.nomeCompleto}</p>
                                <p><strong>Email do Responsável:</strong> ${aluno.responsavel.email}</p>
                                <p><strong>Telefone do Responsável:</strong> ${aluno.responsavel.telefoneUm}</p>
                                <p><strong>Outro Telefone do Responsável:</strong> ${aluno.responsavel.telefoneDois || 'N/A'}</p>
                                <button class="editar-btn" onclick="editarAluno('${childSnapshot.key}', '${aluno.Escola_idEscola}', '${aluno.nomeCompleto}', '${aluno.idade}', '${aluno.dataVencimento}', '${aluno.valor}', '${aluno.periodo || ''}')">Editar</button>
                                <button class="excluir-btn" onclick="excluirAluno('${childSnapshot.key}')">Excluir</button>
                            </div>
                        `;
                        listaAlunos.appendChild(alunoItem);
                    }
                });
            });
        }
    });
}

// Função para alternar a visibilidade dos detalhes do aluno e modificar o ícone da seta
function toggleDetalhesAluno(element) {
    const detalhesAluno = element.nextElementSibling;
    const setaIcone = element.querySelector('.seta-icone');
    if (detalhesAluno.style.display === 'none') {
        detalhesAluno.style.display = 'block';
        setaIcone.innerHTML = '&#9650;'; // Altera o ícone para a seta para cima
    } else {
        detalhesAluno.style.display = 'none';
        setaIcone.innerHTML = '&#9660;'; // Altera o ícone para a seta para baixo
    }
}

// Função para alterar o cursor do mouse quando passar sobre o nome
function changeCursor(element) {
    element.style.cursor = 'pointer';
}

// Função para redefinir o cursor do mouse quando não estiver mais sobre o nome
function resetCursor(element) {
    element.style.cursor = 'auto';
}
