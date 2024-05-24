window.onload = function() {
    // Obter o UID e o valor da mensalidade do link
    var urlParams = new URLSearchParams(window.location.search);
    var uidCriptografado = urlParams.get('uid');
    var valorMensalidadeCriptografado = urlParams.get('valor');

    // Descriptografar o UID e o valor da mensalidade
    var uid = atob(uidCriptografado);
    var valorMensalidade = atob(valorMensalidadeCriptografado);

    // Preencher o campo de UID em um campo oculto para ser enviado com os dados do aluno
    document.getElementById('alunoId').value = uid;

    // Preencher o valor da mensalidade diretamente no formulário
    document.getElementById('valorMensalidade').textContent = 'Valor: ' + valorMensalidade;

    // Preencher as escolas do usuário no dropdown
    const escolasRef = firebase.database().ref('users/' + uid + '/escolas');
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
};

function salvarAluno() {
    // Obter os dados do formulário
    var uid = document.getElementById('alunoId').value; // UID do usuário logado
    var nomeAluno = document.getElementById('nomeAluno').value;
    var idadeAluno = document.getElementById('idadeAluno').value;
    var dataVencimento = document.getElementById('dataVencimento').value;
    var periodoAluno = document.getElementById('periodoAluno').value;
    var nomeResponsavel = document.getElementById('nomeResponsavel').value;
    var telefoneUm = document.getElementById('telefoneUm').value;
    var telefoneDois = document.getElementById('telefoneDois').value;
    var emailResponsavel = document.getElementById('emailResponsavel').value;
    var ruaAluno = document.getElementById('ruaAluno').value;
    var numeroRuaAluno = document.getElementById('numeroRuaAluno').value;
    var valorMensalidade = parseFloat(document.getElementById('valorMensalidade').textContent.split(':')[1].trim()); // Convertendo para número

    // Definir o ID do aluno conforme o padrão
    var alunoId = 'idAluno' + Date.now(); // Aqui estou usando o timestamp atual para criar o ID, você pode ajustar conforme necessário

    // Salvar os dados no banco de dados
    var alunoRef = firebase.database().ref('users/' + uid + '/alunos');
    var novoAlunoRef = alunoRef.child(alunoId); // Usar o ID definido
    novoAlunoRef.set({
        nomeCompleto: nomeAluno,
        idade: idadeAluno,
        dataVencimento: dataVencimento,
        periodo: periodoAluno,
        valor: valorMensalidade, // Agora é um número
        responsavel: {
            nomeCompleto: nomeResponsavel,
            telefoneUm: telefoneUm,
            telefoneDois: telefoneDois,
            email: emailResponsavel
        },
        endereco: {
            ruaResidencia: ruaAluno,
            numeroRua: numeroRuaAluno
        }
    }).then(() => {
        // Limpar os campos do formulário após salvar
        document.getElementById('formAluno').reset();
        // Exibir mensagem de sucesso usando o SweetAlert2
        Swal.fire({
            title: 'Sucesso!',
            text: 'Aluno salvo com sucesso!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
        });
    }).catch((error) => {
        // Exibir mensagem de erro usando o SweetAlert2
        Swal.fire({
            title: 'Erro!',
            text: 'Erro ao salvar aluno. Verifique o console para mais detalhes.',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
        });
        console.error('Erro ao salvar aluno: ', error);
    });
}


