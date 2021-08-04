importScripts("https://www.gstatic.com/firebasejs/7.21.1/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/7.21.1/firebase-messaging.js")



// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAOxtWR_beXMiVVLUfN3dNvhM2b41XPDKQ",
  authDomain: "aca-inc.firebaseapp.com",
  databaseURL: "https://aca-inc.firebaseio.com",
  projectId: "aca-inc",
  storageBucket: "aca-inc.appspot.com",
  messagingSenderId: "554324027588",
  appId: "1:554324027588:web:d8dc00920a30ee13294191"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging();
// messaging.requestPermission().then(() => {
//   console.log()
//   return messaging.getToken()
// }).then(token => {
//   console.log(token)
// }).catch(err => {
//   console.log("error: ", err)
// })
