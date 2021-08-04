// "use strict";


// const notificationButton = document.getElementById("enableNotifications");
// let swRegistration = null;

// initializeApp();

// function initializeApp() {
//   if ("serviceWorker" in navigator && "PushManager" in window) {
//     console.log("Service Worker and Push is supported");

//     //Register the service worker
//     navigator.serviceWorker
//       .register("../../sw.js")
//       .then((registration) => {
//         firebase.messaging().useServiceWorker(registration);
//       })
//       // .then(swReg => {
//       //   console.log("Service Worker is registered", swReg);

//       //   swRegistration = swReg;
//       //   initializeUi();
//       // })
//       .catch(error => {
//         console.error("Service Worker Error", error);
//       });
//   } else {
//     console.warn("Push messaging is not supported");
//     notificationButton.textContent = "Push Not Supported";
//   }
// }

// function initializeUi() {
//   notificationButton.addEventListener("click", () => {
//     displayNotification();
//   });
// }

// function displayNotification() {
//   if (window.Notification && Notification.permission === "granted") {
//     notification();
//   }
//   // If the user hasn't told if he wants to be notified or not
//   // Note: because of Chrome, we are not sure the permission property
//   // is set, therefore it's unsafe to check for the "default" value.
//   else if (window.Notification && Notification.permission !== "denied") {
//     Notification.requestPermission(status => {
//       if (status === "granted") {
//         notification();
//       } else {
//         alert("You denied or dismissed permissions to notifications.");
//       }
//     });
//   } else {
//     // If the user refuses to get notified
//     alert(
//       "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
//     );
//   }
// }

// function notification(options) {

//   swRegistration.showNotification("ACA Notification!", options);
// }

const setServiceID = async () => {
  var id = await acaServices.get().then(res => {
    var resID;
    res.forEach(elt => {
      resID = elt.id;
    })
    return resID;
  })
  return id;

}

const messaging = firebase.messaging();

messaging.onTokenRefresh(handleTokenRefresh)


messaging.requestPermission().then(() => {
  handleTokenRefresh()

}).catch(err => {
  console.log("error: ", err)
})


async function handleTokenRefresh() {
  var serviceID = await setServiceID();
  return messaging.getToken().then(async (token) => {
    console.log(token)


    var tokenObject = {
      id: generateID(),
      uid: auth.currentUser.uid,
      token: token,
      date: new Date()
    }
    var tokenList = await acaServices.doc(`${serviceID}/notifications/tokens/`).get().then(res => { return res.data() })

    for (const tokens in tokenList) {
      if (tokenList[tokens].token == token && tokenList[tokens].uid == uid)
        token = ""
    }
    if (token != "") {
      acaServices.doc(`${serviceID}/notifications/tokens/`).update({ [`${tokenObject.id}`]: tokenObject }).catch(err => console.log(err))
    }
  })
}

// async function sendNotification() {
//   var serviceID = await setServiceID();
//   var tokenList = await acaServices.doc(`${serviceID}/notifications/request/`).get().then(res => { return res.data().pending })

// }

messaging.onMessage(payload => {
  console.log("onMessage: ", payload)
  var x = document.getElementById("myAudio");

  x.play()
 
  toast(payload.notification.body, "pink")
  // const { title, ...options } = payload.notification;
})

// messaging.setBackgroundMessageHandler(payload => {
//   const notification = JSON.parse(payload.data.notification);
//   const notificationTitle = notification.title;
//   const notificationOptions = {
//     body: notification.body
//   };
//   //Show the notification :)
//   return self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   );
// });

