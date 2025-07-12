const firebaseConfig = {
  apiKey: "AIzaSyAe9eUpiijk4rx2_DOD-6687PHkhTDXkIE",
  authDomain: "attendence-b36ed.firebaseapp.com",
  databaseURL: "https://attendence-b36ed-default-rtdb.firebaseio.com",
  projectId: "attendence-b36ed",
  storageBucket: "attendence-b36ed.appspot.com",
  messagingSenderId: "714626544107",
  appId: "1:714626544107:web:97c209e8937932f9cf69ae",
  measurementId: "G-2GMLE4QH6G"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
