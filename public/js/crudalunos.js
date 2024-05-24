// Preencher o dropdown de escolas
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;
        const escolasRef = firebase.database().ref('users/' + userId + '/escolas');
        const escolaSelect = document.getElementById('escolaSelect');

        escolasRef.on('value', (snapshot) => {
            escolaSelect.innerHTML = ''; // Limpa o dropdown
            snapshot.forEach((childSnapshot) => {
                const escola = childSnapshot.val();
                const option = document.createElement('option');
                option.value = childSnapshot.key;
                option.textContent = escola.nomeEscola;
                escolaSelect.appendChild(option);
            });
        });
    }
});

function salvarAluno() {
    const userId = firebase.auth().currentUser.uid;

    const alunoId = document.getElementById('alunoId').value;
    const escolaId = document.getElementById('escolaSelect').value;
    const nomeAluno = document.getElementById('nomeAluno').value;
    const idadeAluno = document.getElementById('idadeAluno').value;
    const dataVencimento = document.getElementById('dataVencimento').value;
    const valorAluno = document.getElementById('valorAluno').value;
    const periodoAluno = document.getElementById('periodoAluno').value;
    const nomeResponsavel = document.getElementById('nomeResponsavel').value;
    const telefoneUm = document.getElementById('telefoneUm').value;
    const telefoneDois = document.getElementById('telefoneDois').value;
    const emailResponsavel = document.getElementById('emailResponsavel').value;
    const ruaAluno = document.getElementById('ruaAluno').value;
    const numeroRuaAluno = document.getElementById('numeroRuaAluno').value;

    const novoAluno = {
        Escola_idEscola: escolaId,
        nomeCompleto: nomeAluno,
        idade: parseInt(idadeAluno),
        dataVencimento: dataVencimento,
        valor: parseFloat(valorAluno),
        periodo: periodoAluno
    };

    const novoResponsavel = {
        nomeCompleto: nomeResponsavel,
        telefoneUm: telefoneUm,
        telefoneDois: telefoneDois,
        email: emailResponsavel
    };

    const novoEndereco = {
        ruaResidencia: ruaAluno,
        numeroRua: parseInt(numeroRuaAluno)
    };

    if (alunoId) {
        // Verificar se o aluno a ser editado já existe no banco de dados
        firebase.database().ref('users/' + userId + '/alunos/' + alunoId).once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // Aluno existe, permitir a edição
                    firebase.database().ref('users/' + userId + '/alunos/' + alunoId).update(novoAluno)
                        .then(() => {
                            Swal.fire('Sucesso!', 'Aluno atualizado com sucesso!', 'success');
                            resetFormularioAluno();
                        })
                        .catch((error) => {
                            console.error('Erro ao atualizar aluno: ', error);
                        });

                    // Atualizar dados do responsável
                    firebase.database().ref('users/' + userId + '/alunos/' + alunoId + '/responsavel').update(novoResponsavel);

                    // Atualizar dados do endereço
                    firebase.database().ref('users/' + userId + '/alunos/' + alunoId + '/endereco').update(novoEndereco);
                } else {
                    // Aluno não existe, exibir mensagem de erro
                    Swal.fire('Erro!', 'O aluno a ser editado não existe no banco de dados.', 'error');
                }
            })
            .catch((error) => {
                console.error('Erro ao verificar se o aluno existe: ', error);
            });
    } else {
        // Adicionar novo aluno
        firebase.database().ref('users/' + userId + '/alunos').once('value')
            .then((snapshot) => {
                const numeroAlunosRegistrados = snapshot.numChildren();
                firebase.database().ref('users/' + userId + '/registros').once('value')
                    .then((snapshot) => {
                        const numeroMaximoRegistros = snapshot.val();
                        if (numeroAlunosRegistrados >= numeroMaximoRegistros) {
                            // Exibir mensagem de erro se o limite máximo de registros for atingido
                            Swal.fire('Limite máximo atingido!', 'Você já atingiu o limite máximo de registros de alunos.', 'error');
                        } else {
                            // Continuar com a adição do aluno
                            const idAluno = "idAluno" + Date.now();
                            firebase.database().ref('users/' + userId + '/alunos/' + idAluno).set(novoAluno)
                                .then(() => {
                                    Swal.fire('Sucesso!', 'Aluno adicionado com sucesso!', 'success');
                                    resetFormularioAluno();
                                })
                                .catch((error) => {
                                    console.error('Erro ao adicionar aluno: ', error);
                                });

                            // Adicionar dados do responsável
                            firebase.database().ref('users/' + userId + '/alunos/' + idAluno + '/responsavel').set(novoResponsavel);

                            // Adicionar dados do endereço
                            firebase.database().ref('users/' + userId + '/alunos/' + idAluno + '/endereco').set(novoEndereco);
                        }
                    })
                    .catch((error) => {
                        console.error('Erro ao obter número máximo de registros: ', error);
                    });
            })
            .catch((error) => {
                console.error('Erro ao obter número de alunos registrados: ', error);
            });
    }
}


// Função para excluir aluno
function excluirAluno(alunoId) {
    const userId = firebase.auth().currentUser.uid;

    Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação excluirá o aluno e todos os dados associados. Esta ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar',
        dangerMode: true,
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.database().ref('users/' + userId + '/alunos/' + alunoId).remove()
                .then(() => {
                    Swal.fire('Sucesso!', 'Aluno excluído com sucesso!', 'success');
                })
                .catch((error) => {
                    console.error('Erro ao excluir aluno: ', error);
                });
        }
    });
}

// Função para preencher o formulário com os dados do aluno para edição
function editarAluno(alunoId, escolaId, nome, idade, dataVencimento, valor, periodo) {
    // Definindo os valores dos campos do formulário
    document.getElementById('alunoId').value = alunoId;
    document.getElementById('escolaSelect').value = escolaId;
    document.getElementById('nomeAluno').value = nome;
    document.getElementById('idadeAluno').value = idade;
    document.getElementById('dataVencimento').value = dataVencimento;
    document.getElementById('valorAluno').value = valor;
    document.getElementById('periodoAluno').value = periodo;

    // Preenchendo os dados do responsável
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId + '/alunos/' + alunoId + '/responsavel').once('value', (snapshot) => {
        const responsavel = snapshot.val();
        if (responsavel) {
            document.getElementById('nomeResponsavel').value = responsavel.nomeCompleto;
            document.getElementById('telefoneUm').value = responsavel.telefoneUm;
            document.getElementById('telefoneDois').value = responsavel.telefoneDois;
            document.getElementById('emailResponsavel').value = responsavel.email;
        }
    });

    // Preenchendo os dados do endereço
    firebase.database().ref('users/' + userId + '/alunos/' + alunoId + '/endereco').once('value', (snapshot) => {
        const endereco = snapshot.val();
        if (endereco) {
            document.getElementById('ruaAluno').value = endereco.ruaResidencia;
            document.getElementById('numeroRuaAluno').value = endereco.numeroRua;
        }
    });

    // Rolando para o topo da página
    window.scrollTo(0, 0);
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const userId = user.uid;
        const alunosRef = firebase.database().ref('users/' + userId + '/alunos');
        const escolasRef = firebase.database().ref('users/' + userId + '/escolas');

        // Armazenar dados das escolas em um objeto
        const escolasData = {};

        // Carregar dados das escolas
        escolasRef.once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const escola = childSnapshot.val();
                escolasData[childSnapshot.key] = escola;
            });

            // Carregar dados dos alunos
            alunosRef.once('value', (snapshot) => {
                const listaAlunos = document.getElementById('listaAlunos');
                listaAlunos.innerHTML = '';

                snapshot.forEach((childSnapshot) => {
                    const aluno = childSnapshot.val();
                    const alunoId = childSnapshot.key;

                    // Obter o nome da escola associada ao aluno a partir dos dados armazenados
                    const escola = escolasData[aluno.Escola_idEscola];

                    // Criar a div do aluno
                    const alunoDiv = document.createElement('div');
                    alunoDiv.classList.add('aluno-item');

                    // Adicionando estilos sugeridos
                    alunoDiv.classList.add('card'); // Classe para definir um estilo de cartão
                    alunoDiv.innerHTML = `
                        <div class="card-header" onclick="toggleDetalhesAluno(this)">
                            <p class="nome-clicavel"><strong>Nome:</strong> ${aluno.nomeCompleto} <span class="seta-icone">&#9660;</span></p>
                        </div>
                        <div class="detalhes-aluno" style="display: none;">
                            <div class="card-body">
                                <p><strong>Escola:</strong> ${escola.nomeEscola}</p>
                                <p><strong>Idade:</strong> ${aluno.idade}</p>
                                <p><strong>Data de Vencimento:</strong> ${aluno.dataVencimento}</p>
                                <p><strong>Valor:</strong> ${aluno.valor}</p>
                                <p><strong>Período:</strong> ${aluno.periodo || 'N/A'}</p>
                                <p><strong>Endereço:</strong> ${aluno.endereco.ruaResidencia}, ${aluno.endereco.numeroRua}</p>
                                <p><strong>Responsável:</strong> ${aluno.responsavel.nomeCompleto}</p>
                                <p><strong>Email do Responsável:</strong> ${aluno.responsavel.email}</p>
                                <p><strong>Telefone do Responsável:</strong> ${aluno.responsavel.telefoneUm}</p>
                                <p><strong>Outro Telefone do Responsável:</strong> ${aluno.responsavel.telefoneDois || 'N/A'}</p>
                                <button class="btn editar-btn" onclick="editarAluno('${alunoId}', '${aluno.Escola_idEscola}', '${aluno.nomeCompleto}', '${aluno.idade}', '${aluno.dataVencimento}', '${aluno.valor}', '${aluno.periodo || ''}')">Editar</button>
                                <button class="btn excluir-btn" onclick="excluirAluno('${alunoId}')">Excluir</button>
                            </div>
                        </div>
                    `;

                    listaAlunos.appendChild(alunoDiv);
                });
            });
        });
    }
});




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


function resetFormularioAluno() {
    // Limpar os valores dos campos do formulário
    document.getElementById('alunoId').value = '';
    document.getElementById('escolaSelect').value = '';
    document.getElementById('nomeAluno').value = '';
    document.getElementById('idadeAluno').value = '';
    document.getElementById('dataVencimento').value = '';
    document.getElementById('valorAluno').value = '';
    document.getElementById('periodoAluno').value = '';
    document.getElementById('nomeResponsavel').value = '';
    document.getElementById('telefoneUm').value = '';
    document.getElementById('telefoneDois').value = '';
    document.getElementById('emailResponsavel').value = '';
    document.getElementById('ruaAluno').value = '';
    document.getElementById('numeroRuaAluno').value = '';
}

