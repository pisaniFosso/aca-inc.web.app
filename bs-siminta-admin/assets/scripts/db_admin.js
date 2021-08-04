// enable offline data
db.enablePersistence()
  .catch(function (err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });


const body = document.querySelector('body');
const acaUsers = db.collection('users-ACA');
const ACAservices = db.collection('ACA-services');
const ACAservices_hist = db.collection('ACA-services_hist');
const acaUsers_hist = db.collection('users-ACA_hist');
const uid = sessionStorage.getItem('uid');
const increment = firebase.firestore.FieldValue.increment(1);
const decrement = firebase.firestore.FieldValue.increment(-1);

var thisMonth = new Date();
var sixMonth = new Date();
thisMonth = thisMonth.getMonth() + 1 + ", 01, " + thisMonth.getFullYear()
sixMonth = (sixMonth.getMonth() + 7) % 12 + ", 01, " + (sixMonth.getFullYear() + Math.floor((sixMonth.getMonth() + 7) / 12))
thisMonth = new Date(thisMonth)
sixMonth = new Date(sixMonth)
console.log(thisMonth)
var serviceID;

const setServiceID = async () => {
  var id = await ACAservices.get().then(res => {
    var resID;
    res.forEach(elt => {
      resID = elt.id;
      renderText('downloads', elt.data().downloads)

    })
    return resID;
  })
  return id;

}


body.addEventListener('click', async (evt) => {
  console.log(evt)


  if (evt.target.tagName == "I" && evt.target.id == "reminder-send") {
    var reminder = {
      msgID: generateID(),
      uid: evt.target.dataset.id,
      message: 'your passport will expire in 6 months or less',
      subject: 'Reminder',
      icon: 'fas fa-passport fa-2x',
      date: new Date()
    }
    acaUsers.doc(`${reminder.uid}/confidentials/infos`).get().then(res => {
      reminder['expireDate'] = res.data().sensitive.passportToDate;
      reminder['to'] = res.data().sensitive.email;
      acaUsers.doc(`${reminder.uid}/timelines/manualReminders`).update({ [`pending.${reminder.msgID}`]: reminder, count: increment }).then(() => {
        acaUsers_hist.doc(`${reminder.uid}/timelines/manualReminders`).update({ [`pending.${reminder.msgID}`]: reminder, count: increment }).then(() => {
          acaUsers.doc(`${reminder.uid}`).update({ lastUpdate: new Date() })
          acaUsers_hist.doc(`${reminder.uid}`).update({ lastUpdate: new Date() })
          ACAservices.doc(`${serviceID}`).update({ lastUpdate: new Date() })
          ACAservices_hist.doc(`${serviceID}`).update({ lastUpdate: new Date() })
          swal({
            title: "reminder",
            html: "reminder sent to " + res.data().sensitive.email
          })
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))

  }
  if (evt.target.tagName == "I" && evt.target.id == "reminder-visa") {
    var reminder = {
      msgID: generateID(),
      uid: evt.target.dataset.id,
      message: `your ${evt.target.dataset.status} will expire in 6 months or less`,
      subject: 'Reminder',
      icon: 'fas fa-plane-arrival fa-2x',
      date: new Date()
    }

    acaUsers.doc(`${reminder.uid}/confidentials/infos`).get().then(res => {
      reminder['expireDate'] = res.data().sensitive.statusToDate;
      reminder['to'] = res.data().sensitive.email;
      acaUsers.doc(`${reminder.uid}/timelines/manualPermitReminders`).update({ [`pending.${reminder.msgID}`]: reminder, count: increment }).then(() => {
        acaUsers_hist.doc(`${reminder.uid}/timelines/manualPermitReminders`).update({ [`pending.${reminder.msgID}`]: reminder, count: increment }).then(() => {
          acaUsers.doc(`${reminder.uid}`).update({ lastUpdate: new Date() })
          acaUsers_hist.doc(`${reminder.uid}`).update({ lastUpdate: new Date() })
          ACAservices.doc(`${serviceID}`).update({ lastUpdate: new Date() })
          ACAservices_hist.doc(`${serviceID}`).update({ lastUpdate: new Date() })
          swal({
            title: "reminder",
            html: "reminder sent to " + res.data().sensitive.email
          })
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))

  }
})

//Monthly Subscriber;
acaUsers.where("createdDate", ">=", thisMonth)
  .get().then(res => {
    renderText('monthly-subscriber', res.docs.length)
  })
acaUsers
  .get().then(res => {
    var count = 0;

    res.forEach(elt => {

      acaUsers.doc(`${elt.id}/confidentials/infos`)
        .get().then((result) => {
          if (result.data().sensitive.passportToDate && result.data().sensitive.passportToDate.toDate() <= sixMonth && result.data().sensitive.passportToDate.toDate() >= thisMonth) {
            var infos = Object.assign({}, result.data(), elt.data());
            renderPassportExpireringSoon(elt.id, infos);
            ++count;
          }
          renderText('passport-expire', count)
        })
    })

  })
acaUsers
  .get().then(res => {
    var count = 0;

    res.forEach(elt => {

      acaUsers.doc(`${elt.id}/confidentials/infos`)
        .get().then((result) => {
          if (result.data().sensitive.statusToDate && result.data().sensitive.statusToDate.toDate() <= sixMonth && result.data().sensitive.statusToDate.toDate() >= thisMonth) {
            var infos = Object.assign({}, result.data(), elt.data());
            renderPermitExpireringSoon(elt.id, infos)
            ++count;
          }
          renderText('permit-expire', count)
        })
    })

  })
// 


acaUsers.doc(`${uid}/confidentials/infos/`).get().then(res => {
  console.log(res.data())
  renderText('user-name', res.data().firstName + ' ' + res.data().lastName)
  renderText('full-name', res.data().firstName + ' ' + res.data().lastName)
  if (res.data().url) {
    document.getElementById('profilePic').src = res.data().url;
  }
})

setTimeout(async () => {
  serviceID = await setServiceID()

  ACAservices.doc(`${serviceID}`).collection('messages').get().then(async (results) => {
    var count = 0
    results.forEach(elt => {
      const data = elt.data();
      for (const advise in data) {
        if (advise == "advises") {
          var sent = data[advise].sent;

          for (const msg in sent) {
            var message = sent[msg];
            if (msg !== "count") {
              if (message.read == "false") {
                const error = {
                  name: message.firstName + " " + message.lastName,
                  msg: message.message.slice(0, 100),
                  date: message.date.toDate().toDateString()
                }
                ++count;

                renderMessage('messages-count', error);
              }

            }

          }
        }
      }
    })

    renderText('messages-count', count)


  })

  ACAservices.doc(`${serviceID}`).collection('events').doc("request").get().then(async (results) => {
    // ACAservices.doc(`${serviceID}/events/request/`).get().then(results => {
    var data = results.data().sent;

    var countEvents = 0;

    for (const elt in data) {
      if (elt != "count" && data[elt].start.toDate().getMonth() == (new Date()).getMonth() && data[elt].start.toDate().getFullYear() == (new Date()).getFullYear()) {
        ++countEvents
      }
    };

    renderEvents(countEvents);
  })


}, 2000);