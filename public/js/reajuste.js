// Função para obter o valor do reajuste anual e aplicá-lo a todas as mensalidades
function aplicarReajuste() {
    // Verificar se há um usuário autenticado
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Usuário está autenticado, obter sua ID
            const userId = user.uid;
            
            // Obter o valor do reajuste do usuário
            const valorReajuste = parseFloat(document.getElementById('valorReajuste').value);
            
            // Validar se o valor do reajuste é um número válido
            if (isNaN(valorReajuste) || valorReajuste <= 0) {
                Swal.fire('Erro', 'Digite um valor válido para o reajuste.', 'error');
                return;
            }

            // Referenciar o banco de dados do usuário atual
            const alunosRef = firebase.database().ref('users/' + userId + '/alunos');

            // Atualizar o valor da parcela para todos os alunos
            alunosRef.once('value', (alunosSnapshot) => {
                alunosSnapshot.forEach((alunoSnapshot) => {
                    const alunoId = alunoSnapshot.key;
                    const aluno = alunoSnapshot.val();

                    // Verificar se o aluno tem um valor de mensalidade definido
                    if (aluno.valor && aluno.valor > 0) {
                        const novoValor = aluno.valor + valorReajuste;

                        // Atualizar o valor da mensalidade no Firebase
                        alunosRef.child(alunoId).update({
                            valor: novoValor
                        });
                    }
                });

                Swal.fire('Sucesso', 'Reajuste aplicado com sucesso para todas as mensalidades.', 'success');
            });
        } else {
            console.error("Nenhum usuário autenticado encontrado");
        }
    });
}
