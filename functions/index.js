const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase)

exports.sendNotifications = functions.firestore.document("ACA-Services/{serviceID}/notifications/request/").onWrite(event => {
  if (!event.after.exists()) {
    return;
  }
  if (event.before.data() == event.after.data()) {
    return;

  }
  const NOTIFICATION_MESSAGE = event.after.data().pending;

  const payload = {
    notification: {
      title: `New Message from ${NOTIFICATION_MESSAGE.receiver_name}`,
      body: `${NOTIFICATION_MESSAGE.message}`,
      click_action: `https://${functions.config().firebase.authDomain}`
    }
  }

  console.info(payload)



})
