function verificarUsuario() {
  // Verificar se há um usuário autenticado
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      // Usuário está autenticado, recuperar seus dados do banco de dados
      firebase.database().ref('users/' + user.uid).once('value')
        .then((snapshot) => {
          // Verificar se há dados do usuário
          if (snapshot.exists()) {

            // Recuperar os dados do usuário
            const userData = snapshot.val();
            
            // Exibir os dados do usuário na página
            document.getElementById('nomeUsuario').textContent = userData.displayName;
            document.getElementById('emailUsuario').textContent = userData.email;
            document.getElementById('fotoUsuario').src = userData.photoURL;
            
            // Exibir o número do PIX do usuário, se estiver disponível
            if (userData.Pix) {
              document.getElementById('numeroPixExibicao').textContent = `${userData.Pix}`;
            }
            
            // Determinar o nome do plano de assinatura com base no número de registros
            let subscriptionName;
            if (userData.registros >= 500) {
              subscriptionName = 'Plano Diamante / 500 registros de alunos';
            } else if (userData.registros >= 250) {
              subscriptionName = 'Plano Platina / 250 registros de alunos';
            } else if (userData.registros >= 100) {
              subscriptionName = 'Plano Ouro  / 100 registros de alunos';
            } else if (userData.registros >= 50) {
              subscriptionName = 'Plano Prata / 50 Registros de alunos';
            } else {
              subscriptionName = 'Plano Grátis / 5 Registros de alunos';
            }
            document.getElementById('assinaturaUsuario').textContent = subscriptionName;

            // Adicionar botão se a assinatura for acima de 5 registros
            if (userData.registros > 5) {
              const botaoUpgrade = document.createElement('button');
              botaoUpgrade.textContent = 'Gerenciar/Cancelar assinatura';
              botaoUpgrade.addEventListener('click', function() {
                window.location.href = 'https://billing.stripe.com/p/login/bIY6qt8T5azGaR2aEE';
              });
              
              // Inserir o botão no local desejado
              const localBotaoUpgrade = document.getElementById('localBotaoUpgrade');
              console.log("Elemento localBotaoUpgrade:", localBotaoUpgrade);
              localBotaoUpgrade.appendChild(botaoUpgrade);
            } else if (userData.registros === 5) {
              const botaoOutraAcao = document.createElement('button');
              botaoOutraAcao.textContent = 'Assinar';
              botaoOutraAcao.addEventListener('click', function() {
                // Adicione a ação desejada para 5 registros
                window.location.href = 'assinatura.html';
              });
        
              // Inserir o botão no local desejado
              const localBotaoUpgrade = document.getElementById('localBotaoUpgrade');
              console.log("Elemento localBotaoUpgrade:", localBotaoUpgrade);
              localBotaoUpgrade.appendChild(botaoOutraAcao);
            }

            // Adicione aqui outros dados do usuário que deseja exibir
          } else {
            console.error("Dados do usuário não encontrados");
          }
        })
        .catch((error) => {
          console.error("Erro ao recuperar dados do usuário:", error);
        });
    } else {
      console.error("Nenhum usuário autenticado encontrado");
    }
  });
}

// Função para fazer logout
function logout() {
  firebase.auth().signOut().then(() => {
    // Redirecionar para a página de login após logout
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("Erro durante o logout:", error);
  });
}

///////////////////////////////////////////////////////////////////////////////


// Chamar a função para verificar o usuário quando a página carregar
window.onload = function() {
  verificarUsuario();
};

////////////////////////////////////////////////////////////////////////////////