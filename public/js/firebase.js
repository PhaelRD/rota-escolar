
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
  
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const escolasRef = firebase.database().ref('escolas');
const alunosRef = firebase.database().ref('alunos');
// Referência para a coleção de gastos
const gastosRef = firebase.database().ref('Gastos');
// Referência para a lista de pagamentos
const pagamentosRef = firebase.database().ref('Pagamentos');
// Referência para a lista de responsáveis
const responsaveisRef = firebase.database().ref('Responsaveis');
const residenciasRef = firebase.database().ref('Residencias');
