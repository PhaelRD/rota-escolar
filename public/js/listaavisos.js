// Função para verificar e exibir avisos de pagamento dos alunos do usuário logado
function verificarAvisosPagamentoUsuarioLogado() {
    const listaAvisosPagamento = document.getElementById('listaAvisosPagamento');
    listaAvisosPagamento.innerHTML = ''; // Limpa a lista antes de recarregar

    // Verificar se há um usuário autenticado
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Usuário está autenticado, obter sua ID
            const userId = user.uid;

            // Obtém a data atual em UTC
            const dataAtualUTC = new Date().toUTCString();
            const dataAtual = new Date(dataAtualUTC);

            const diaAtual = dataAtual.getUTCDate();
            const mesAtual = dataAtual.getUTCMonth() + 1; // Os meses em JavaScript são baseados em zero
            const anoAtual = dataAtual.getUTCFullYear();

            // Obter os alunos do usuário logado
            firebase.database().ref('users/' + userId + '/alunos').once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const aluno = childSnapshot.val();
                    const alunoId = childSnapshot.key;

                    // Verificar se o pagamento para o mês atual ou meses anteriores está pendente ou atrasado
                    const mesInicioCobranca = obterMesInicioCobranca(aluno.dataVencimento);

                    for (let i = mesInicioCobranca; i <= mesAtual; i++) {
                        const chavePagamento = `${i}-${anoAtual}`;
                        firebase.database().ref('users/' + userId + '/pagamentos/' + alunoId + '/' + chavePagamento).once('value', (pagamentoSnapshot) => {
                            const pagamento = pagamentoSnapshot.val();

                            if (!pagamento) {
                                // Verificar se o pagamento está atrasado
                                const diaVencimento = new Date(aluno.dataVencimento).getUTCDate();
                                const mesVencimento = new Date(aluno.dataVencimento).getUTCMonth() + 1;
                                if (i < mesAtual || (i === mesAtual && diaAtual > diaVencimento)) {
                                    // Pagamento está atrasado
                                    const listItem = criarItemAviso(aluno, i, anoAtual, true);
                                    listaAvisosPagamento.appendChild(listItem);
                                } else {
                                    // Pagamento está pendente
                                    const listItem = criarItemAviso(aluno, i, anoAtual, false);
                                    listaAvisosPagamento.appendChild(listItem);
                                }
                            }
                        });
                    }
                });
            });
        } else {
            console.error("Nenhum usuário autenticado encontrado");
        }
    });
}

// Função auxiliar para criar um item de aviso de pagamento
function criarItemAviso(aluno, mes, ano, atrasado) {
    const listItem = document.createElement('div');
    listItem.classList.add('card');

    const diaVencimento = new Date(aluno.dataVencimento).getUTCDate();
    const statusPagamento = atrasado ? 'atrasado' : 'pendente';
    const corStatus = atrasado ? 'red' : 'yellow';

    listItem.innerHTML = `
        <div class="card-header">Aviso de Pagamento</div>
        <div class="card-body">
            <p>O pagamento para <strong>${aluno.nomeCompleto}</strong> no mês <strong>${mes}/${ano}</strong>, que vence dia <strong>${diaVencimento}</strong>, está <span style="color:${corStatus};"><strong>${statusPagamento}</strong></span>!</p>
            <p>Valor: <strong>R$ ${aluno.valor.toFixed(2)}</strong></p>
        </div>
        <div class="card-footer">
            <button class="pago-btn">Pago</button>
            <button class="cobrar-btn">Cobrar por WhatsApp</button>
        </div>
    `;

    const pagoButton = listItem.querySelector('.pago-btn');
    pagoButton.onclick = () => registrarPagamentoUsuarioLogado(aluno.id, mes, ano);

    const cobrarButton = listItem.querySelector('.cobrar-btn');
    cobrarButton.onclick = () => enviarCobrancaWhatsAppUsuarioLogado(aluno.id, aluno.valor);

    // Adicionar o card à lista e ativar a animação
    document.getElementById('listaAvisosPagamento').appendChild(listItem);
    setTimeout(() => listItem.classList.add('visible'), 10); // Timeout para permitir a renderização

    return listItem;
}




// Função para obter o mês de início da cobrança com base na data de vencimento
function obterMesInicioCobranca(dataVencimento) {
    const data = new Date(dataVencimento);
    return data.getUTCMonth() + 1; // Os meses em JavaScript são baseados em zero
}

// Função para registrar pagamento
function registrarPagamentoUsuarioLogado(alunoId, mes, ano) {
    // Verificar se há um usuário autenticado
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Usuário está autenticado, obter sua ID
            const userId = user.uid;

            // Adicionar pagamento ao Firebase do usuário logado
            const chavePagamento = `${mes}-${ano}`;
            firebase.database().ref('users/' + userId + '/pagamentos/' + alunoId + '/' + chavePagamento).set({
                pago: true
            });

            // Atualizar a lista de avisos
            verificarAvisosPagamentoUsuarioLogado();
        } else {
            console.error("Nenhum usuário autenticado encontrado");
        }
    });
}


// Função para enviar cobrança via WhatsApp para o usuário logado
function enviarCobrancaWhatsAppUsuarioLogado(alunoId, valorMensalidade) {
    // Verificar se há um usuário autenticado
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Usuário está autenticado, obter sua ID
            const userId = user.uid;

            // Obter o número de telefone e nome do responsável do aluno do usuário logado
            firebase.database().ref('users/' + userId + '/alunos/' + alunoId + '/responsavel').once('value', (responsavelSnapshot) => {
                const responsavel = responsavelSnapshot.val();
                if (responsavel && responsavel.telefoneUm) {
                    const telefoneResponsavel = responsavel.telefoneUm;

                    // Obter o nome do aluno do usuário logado
                    firebase.database().ref('users/' + userId + '/alunos/' + alunoId + '/nomeCompleto').once('value', (alunoNomeSnapshot) => {
                        const nomeAluno = alunoNomeSnapshot.val();

                        // Verificar se há uma chave PIX registrada para o usuário logado
                        firebase.database().ref('users/' + userId + '/Pix').once('value', (pixSnapshot) => {
                            const chavePix = pixSnapshot.val();
                            let mensagem;

                            if (chavePix) {
                                // Construir a mensagem de cobrança com valor da mensalidade, nome do aluno e informações de PIX
                                mensagem = `Olá responsável pelo aluno ${nomeAluno}, a mensalidade do mês está pendente. O valor é R$ ${valorMensalidade.toFixed(2)}. Por favor, faça o pagamento via PIX para a chave: ${chavePix} e mande o comprovante. Obrigada!`;

                                // Abrir uma nova janela do WhatsApp Web com a mensagem de cobrança
                                window.open(`https://web.whatsapp.com/send?phone=${telefoneResponsavel}&text=${encodeURIComponent(mensagem)}`);
                            } else {
                                // Exibir aviso usando SweetAlert
                                Swal.fire({
                                    title: 'Aviso',
                                    text: 'Você ainda não registrou uma chave PIX. Por favor, registre uma para facilitar o pagamento.',
                                    icon: 'warning',
                                    confirmButtonText: 'Entendi'
                                });
                            }
                        });
                    });
                } else {
                    console.error("Número de telefone do responsável não encontrado");
                }
            });
        } else {
            console.error("Nenhum usuário autenticado encontrado");
        }
    });
}



// Função para obter o mês de início da cobrança com base na data de vencimento
function obterMesInicioCobranca(dataVencimento) {
    const data = new Date(dataVencimento);
    return data.getMonth() + 1; // Os meses em JavaScript são baseados em zero
}

// Função para registrar pagamento
function registrarPagamentoUsuarioLogado(alunoId, mes, ano) {
    // Verificar se há um usuário autenticado
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Usuário está autenticado, obter sua ID
            const userId = user.uid;

            // Adicionar pagamento ao Firebase do usuário logado
            const chavePagamento = `${mes}-${ano}`;
            firebase.database().ref('users/' + userId + '/pagamentos/' + alunoId + '/' + chavePagamento).set({
                pago: true
            });

            // Atualizar a lista de avisos
            verificarAvisosPagamentoUsuarioLogado();
        } else {
            console.error("Nenhum usuário autenticado encontrado");
        }
    });
}


// Chamar a função para verificar e exibir avisos de pagamento ao carregar a página
verificarAvisosPagamentoUsuarioLogado();
