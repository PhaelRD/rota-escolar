function adicionarGasto() {
    const userId = firebase.auth().currentUser.uid; // Obtém o ID do usuário atual
    const mesAno = document.getElementById('mesAno').value;
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);

    if (mesAno && descricao && valor) {
        const novoGastoRef = firebase.database().ref(`users/${userId}/Gastos/${mesAno}`).push(); // Adiciona o nó do usuário ao caminho
        novoGastoRef.set({
            descricao: descricao,
            valor: valor
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Gasto adicionado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            // Limpar os campos do formulário após adicionar o gasto
            document.getElementById('descricao').value = '';
            document.getElementById('valor').value = '';
        }).catch((error) => {
            console.error('Erro ao adicionar gasto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao adicionar o gasto. Por favor, tente novamente.',
            });
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Por favor, preencha todos os campos.',
        });
    }
}

// Função para navegar para outra página
function navegarPara(url) {
    window.location.href = url;
}

function calcularTotalMensalidades() {
    const userId = firebase.auth().currentUser.uid; // Obtém o ID do usuário atual
    // Referência para o nó "Alunos" do usuário no banco de dados do Firebase
    const alunosRef = firebase.database().ref(`users/${userId}/alunos`);

    // Variável para armazenar o total das mensalidades
    let totalMensalidades = 0;

    // Recupera os dados dos alunos
    alunosRef.once('value', function(snapshot) {
        // Itera sobre cada aluno
        snapshot.forEach(function(childSnapshot) {
            // Recupera o valor do aluno atual e verifica se é um número
            const valorMensalidade = parseFloat(childSnapshot.child('valor').val());
            if (!isNaN(valorMensalidade)) {
                // Soma o valor ao total de mensalidades
                totalMensalidades += valorMensalidade;
            }
        });

        // Atualiza o elemento HTML com o valor total das mensalidades
        document.getElementById('valorTotalMensalidades').textContent = totalMensalidades.toFixed(2);
    });
}

function calcularResumo() {
    const userId = firebase.auth().currentUser.uid; // Obtém o ID do usuário atual
    const mesAnoSelecionado = document.getElementById('selecionarMesAno').value;
    
    if (mesAnoSelecionado) {
        // Referência para o nó de gastos do usuário no mês e ano selecionados
        const gastosRef = firebase.database().ref(`users/${userId}/Gastos/${mesAnoSelecionado}`);

        // Variáveis para armazenar o total das mensalidades e dos gastos
        let totalMensalidades = 0;
        let totalGastos = 0;

        // Limpa a lista de gastos antes de atualizá-la
        const listaGastos = document.getElementById('listaGastos');
        listaGastos.innerHTML = '';

        // Recupera os dados dos gastos
        gastosRef.once('value', function(snapshot) {
            // Itera sobre cada gasto
            snapshot.forEach(function(childSnapshot) {
                // Recupera os dados do gasto
                const gastoKey = childSnapshot.key; // Chave do gasto
                const descricao = childSnapshot.child('descricao').val();
                const valor = parseFloat(childSnapshot.child('valor').val());

                // Cria um elemento <li> para exibir o gasto na lista
                const listItem = document.createElement('li');
                listItem.textContent = `${descricao}: R$ ${valor.toFixed(2)}`;

                // Cria um botão de exclusão
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.classList.add('delete-button'); // Adiciona a classe CSS
                deleteButton.onclick = function() {
                    excluirGasto(userId, mesAnoSelecionado, gastoKey);
                };

                // Adiciona o botão de exclusão ao item da lista
                listItem.appendChild(deleteButton);

                // Adiciona o elemento à lista de gastos
                listaGastos.appendChild(listItem);

                // Soma o valor ao total de gastos
                totalGastos += valor;
            });

            // Atualiza o elemento HTML com o valor total dos gastos
            document.getElementById('valorTotalGastos').textContent = totalGastos.toFixed(2);

            // Referência para o nó "Alunos" do usuário no banco de dados do Firebase
            const alunosRef = firebase.database().ref(`users/${userId}/alunos`);

            // Recupera os dados dos alunos
            alunosRef.once('value', function(alunosSnapshot) {
                // Itera sobre cada aluno
                alunosSnapshot.forEach(function(alunoSnapshot) {
                    // Recupera o valor da mensalidade do aluno atual e verifica se é um número
                    const valorMensalidade = parseFloat(alunoSnapshot.child('valor').val());
                    if (!isNaN(valorMensalidade)) {
                        // Soma o valor ao total das mensalidades
                        totalMensalidades += valorMensalidade;
                    }
                });

                // Atualiza o elemento HTML com o valor total das mensalidades
                document.getElementById('valorTotalMensalidades').textContent = totalMensalidades.toFixed(2);

                // Calcula e exibe a diferença entre as mensalidades e os gastos
                const diferenca = totalMensalidades - totalGastos;
                document.getElementById('diferenca').textContent = diferenca.toFixed(2);
            });
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Por favor, selecione o mês e o ano.',
        });
    }
}

function excluirGasto(userId, mesAno, gastoKey) {
    // Referência para o gasto a ser excluído
    const gastoRef = firebase.database().ref(`users/${userId}/Gastos/${mesAno}/${gastoKey}`);

    // Remove o gasto do banco de dados
    gastoRef.remove().then(() => {
        // Gasto removido com sucesso
        // Recalcula o resumo após a exclusão do gasto
        calcularResumo();
        Swal.fire({
            icon: 'success',
            title: 'Gasto excluído com sucesso!',
            showConfirmButton: false,
            timer: 1500
        });
    }).catch((error) => {
        // Erro ao tentar remover o gasto
        console.error('Erro ao excluir gasto:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao excluir o gasto. Por favor, tente novamente.',
        });
    });
}
