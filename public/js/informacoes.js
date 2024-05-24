// Função para obter e exibir informações importantes do usuário logado
function exibirInformacoesUsuarioLogado(userId) {
    // Referência para o nó de escolas do usuário no banco de dados do Firebase
    const escolasRef = firebase.database().ref(`users/${userId}/escolas`);

    // Referência para o nó de alunos do usuário no banco de dados do Firebase
    const alunosRef = firebase.database().ref(`users/${userId}/alunos`);

    // Número de escolas cadastradas
    escolasRef.once('value', (escolasSnapshot) => {
        const numeroEscolas = escolasSnapshot.numChildren();
        document.getElementById('infoEscolas').textContent = `Número de escolas cadastradas: ${numeroEscolas}`;
    });

    // Número de alunos cadastrados
    alunosRef.once('value', (alunosSnapshot) => {
        const numeroAlunos = alunosSnapshot.numChildren();
        document.getElementById('infoAlunos').textContent = `Número de alunos cadastrados: ${numeroAlunos}`;
    });

    // Valor recebido mensalmente
    calcularValorMensalidades(userId);

    // Número de alunos por período
    contarAlunosPorPeriodo(userId);
}

// Função para calcular o valor total das mensalidades do usuário logado
function calcularValorMensalidades(userId) {
    // Referência para o nó de alunos do usuário no banco de dados do Firebase
    const alunosRef = firebase.database().ref(`users/${userId}/alunos`);

    alunosRef.once('value', (alunosSnapshot) => {
        let valorTotal = 0;

        alunosSnapshot.forEach((alunoSnapshot) => {
            const aluno = alunoSnapshot.val();
            if (aluno.valor && aluno.valor > 0) {
                valorTotal += parseFloat(aluno.valor); // Convertendo para número
            }
        });

        document.getElementById('infoValor').textContent = `Valor recebido mensalmente: R$ ${valorTotal.toFixed(2)}`;
    });
}

// Função para contar o número de alunos por período do usuário logado
function contarAlunosPorPeriodo(userId) {
    // Referência para o nó de alunos do usuário no banco de dados do Firebase
    const alunosRef = firebase.database().ref(`users/${userId}/alunos`);

    alunosRef.once('value', (alunosSnapshot) => {
        let manha = 0;
        let tarde = 0;
        let integral = 0;

        alunosSnapshot.forEach((alunoSnapshot) => {
            const aluno = alunoSnapshot.val();
            if (aluno.periodo) {
                switch (aluno.periodo.toLowerCase()) {
                    case 'manha':
                        manha++;
                        break;
                    case 'tarde':
                        tarde++;
                        break;
                    case 'integral':
                        integral++;
                        break;
                    // Pode adicionar mais casos conforme necessário
                }
            }
        });

        document.getElementById('infoManha').textContent = `Alunos no período da manhã: ${manha}`;
        document.getElementById('infoTarde').textContent = `Alunos no período da tarde: ${tarde}`;
        document.getElementById('infoIntegral').textContent = `Alunos no período integral: ${integral}`;
    });
}

// Chamar a função para exibir informações ao carregar a página
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // O usuário está logado
        const userId = user.uid;
        exibirInformacoesUsuarioLogado(userId);
    } else {
        // O usuário não está logado
        console.log('Usuário não está logado.');
    }
});
