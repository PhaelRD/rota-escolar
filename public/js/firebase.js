
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6319GvCgqQl9rP5rgkPHLTYnY-UDGUPA",
  authDomain: "movelcompleto.firebaseapp.com",
  projectId: "movelcompleto",
  storageBucket: "movelcompleto.appspot.com",
  messagingSenderId: "496619670035",
  appId: "1:496619670035:web:45ad3310ed02a5ba710de6",
  measurementId: "G-647G279NEP"
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