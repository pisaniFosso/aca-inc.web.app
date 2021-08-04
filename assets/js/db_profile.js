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
var body = document.querySelector('body');
document.getElementById("email").disabled = true;

const acaUsers = db.collection('users-ACA')
const acaUsers_hist = db.collection('users-ACA_hist')
const acaServices = db.collection('ACA-services')
const acaServices_hist = db.collection('ACA-services_hist')
const uid = sessionStorage.getItem('uid');
const increment = firebase.firestore.FieldValue.increment(1);
var confidentials;
var userInfoDB;

function delay(i) {
  return new Promise(resolve => setTimeout(resolve, i));
}
acaUsers.doc(uid).get().then(async (res) => {
  var data = res.data();
  renderText('full-name', data.firstName + " " + data.lastName)
  renderProfile('joined', data.createdDate.toDate().toDateString())
  renderInput('first_name', data.firstName)
  renderInput('last_name', data.lastName)
  confidentials = await acaUsers.doc(`${uid}/confidentials/infos`).get().then(res => { return res.data() }).catch(err => console.log(err));
  userInfoDB = await acaUsers.doc(`${uid}`).get().then(res => { return res.data() }).catch(err => console.log(err));

  if (confidentials.first_login) {

    swal({
      title: "Settings",
      type: "info",
      html: `<p>Please finish set your Account to remove your usage restrictions</p>`,
      confirmButtonText: 'settings',

      allowOutsideClick: false,
    }).then(async (result) => {
      if (result) {

        await acaUsers.doc(`${uid}/confidentials/infos/`).update({ "first_login": false })


        document.getElementById('settings-tab').click()
      }
    })
  }
  renderProfile('member-plan', confidentials.privilege)
  // for (var i = 0; i < document.querySelector("#member-plan").childNodes.length; ++i){
  //   console.log(document.querySelector("#member-plan").childNodes[1])
  //   document.querySelector("#member-plan").childNodes[1].replaceWith("text")
  // }
  renderProfile('email', confidentials.sensitive.email)
  renderText('emailDisplay', confidentials.sensitive.email)
  renderInput('phone', confidentials.sensitive.phone)
  renderInput('sexe', confidentials.sexe)
  renderInput('email', confidentials.sensitive.email)
  renderInput('address', confidentials.sensitive.address)
  renderInput('city', data.city)
  renderInput('province', data.province)
  renderInput('postalCode', confidentials.sensitive.postalCode)
  renderInput('status', confidentials.status)
  if (confidentials.sensitive.statusToDate)
    renderInput('statusToDate', confidentials.sensitive.statusToDate.toDate().toISOString().substr(0, 10))
  if (confidentials.sensitive.passportToDate)
    renderInput('passportToDate', confidentials.sensitive.passportToDate.toDate().toISOString().substr(0, 10))
  if (confidentials.url) renderProfilePic(confidentials.url)
  else if (confidentials.sexe == "male") renderProfilePic("https://cdn.pixabay.com/photo/2017/12/18/03/01/black-avatar-3025348_960_720.png")
  else if (confidentials.sexe == "female") renderProfilePic("https://cdn3.iconfinder.com/data/icons/diversity-avatars/64/disco-woman-black-512.png")
  if (confidentials.facebookLink) renderInput('facebookLink', confidentials.facebookLink)
  if (confidentials.website) renderInput('website', confidentials.website)
  if (confidentials.instagramLink) renderInput('instagramLink', confidentials.instagramLink)
  if (confidentials.otherMedia) renderInput('otherMedia', confidentials.otherMedia)
  if (confidentials.show_phone) document.getElementById("phone_visible").setAttribute("checked", "checked")
  // renderSettings(uid, confidentials);
  if (confidentials.status == "Study Permit") {
    document.getElementById('student').style.display = "block"
    renderInput('studyField', data.studyField)
    renderInput('school', data.school)
  } else {
    document.getElementById('worker').style.display = "block"
    if (data.workField == "0")
      renderInput('workField', "")
    else
      renderInput('workField', data.workField)
    if (confidentials.employer == "0")
      renderInput('employer', "")
    else
      renderInput('employer', confidentials.employer)
  }

  if (confidentials.bio && confidentials.bio != "") {
    renderText('bio', confidentials.bio)
  }
  if (confidentials.degree) {
    for (const degree in confidentials.degree) {
      addItem('degree', confidentials.degree[degree])
    }
  }
  if (confidentials.experience) {
    for (const experience in confidentials.experience) {
      addItem('experience', confidentials.experience[experience])
    }
  }
  if (userInfoDB.skill) {
    for (const skill in userInfoDB.skill) {
      itemAdded('skill', userInfoDB.skill[skill])
    }
  }


  if (confidentials.show_phone) {
    document.getElementById('usr_show_phone').style.display = "block"
    renderText('usr_phone', confidentials.sensitive.phone)
  }

  // var messages = data.messages;

}).catch(err => console.log(err))
// acaUsers.get().then(res => {
//   res.forEach(async (results) => {
//     var data = results.data()
//     if (results.id != uid) {
//       var table = document.getElementById('items');


//       await acaUsers.doc(`${results.id}/confidentials/infos/`).get().then(res => {
//         renderUsers(results.id, data, true, table)
//       }).catch(err => {
//         renderUsers(results.id, data, false, table)
//       })
//     }
//   })
// }).catch(err => console.log(err))

acaUsers.onSnapshot(snapshot => {
  snapshot.docChanges().forEach(async function (change) {
    console.log(change.type);

    if (change.type == "added") {
      var data = change.doc.data()
      if (change.doc.id != uid) {
        var table = document.getElementById('items');
        await acaUsers.doc(`${change.doc.id}/confidentials/infos/`).get().then(res => {
          renderUsers(change.doc.id, res.data(), true, table)

        }).catch(err => {
          renderUsers(change.doc.id, data, false, table)
        })
      }

      if (change.doc.id == uid) {
        var table_received = document.getElementById('items-received');
        var table_sent = document.getElementById('items-received');


        acaUsers.doc(`${change.doc.id}/messages/request`).get().then(res => {
          var countcontactRequest = 0;
          var sentContactRequest = res.data().sent;
          if (sentContactRequest) {
            for (const msgID in sentContactRequest) {
              if (msgID != "count") {
                renderContactRequestSent(msgID, sentContactRequest[msgID], table_sent)
                ++countcontactRequest;
              }
            }
          }

          renderProfile('ContactS', countcontactRequest)

          var countcontactReceived = 0;
          var receivedContactReceived = res.data().received;
          if (receivedContactReceived) {
            for (const msgID in receivedContactReceived) {
              if (msgID != "count") {
                renderContactRequestReceived(msgID, receivedContactReceived[msgID], table_received)
                ++countcontactReceived;
              }
            }
          }
          renderProfile('ContactR', countcontactReceived)
        }).catch(err => console.log(err))



        acaUsers.doc(`${uid}/events/request`).get().then(res => {
          var data = res.data().received;
          var countUpcomming = 0;
          if (data) {
            for (const event in data) {
              if (event != 'count') {

                const nextDays = 1000 * 60 * 60 * 24 * 7;

                if (((data[event].start.toDate() - new Date) <= nextDays && (data[event].start.toDate() - new Date) >= 0) || data[event].start.toDate().toDateString() == new Date().toDateString()) {
                  ++countUpcomming;
                  renderScheduler(event, data[event])
                }
              }


            }
          }
          document.querySelector("#Upcomming").childNodes[1].replaceWith(countUpcomming);
          // renderProfile('Upcomming', countUpcomming);
          // renderProfile('Reminders', countReminders)
        }).catch(err => console.log(err))
      }


    }
    if (change.type == "modified") {


      // if (change.doc.id == auth.currentUser.uid) {

        var table_received = document.getElementById('items-received');
        var table_sent = document.getElementById('items-sent');
        table_received.innerHTML = "";
        table_sent.innerHTML = "";
        acaUsers.doc(`${change.doc.id}/messages/request`).get().then(res => {
          var sentContactRequest = res.data().sent;

          if (sentContactRequest) {
            for (const msgID in sentContactRequest) {
              if (msgID != "count") {
                renderContactRequestSent(msgID, sentContactRequest[msgID], table_sent)
              }
            }
          }


          var receivedContactReceived = res.data().received;
          if (receivedContactReceived) {
            for (const msgID in receivedContactReceived) {
              if (msgID != "count") {
                renderContactRequestReceived(msgID, receivedContactReceived[msgID], table_received)
              }
            }
          }
        }).catch(err => console.log(err))
      // }


      var table = document.getElementById('items');
      table.innerHTML = ""
      if (change.doc.id == auth.currentUser.uid) {

        acaUsers.doc(`${change.doc.id}/confidentials/infos/`).get().then(res => {
          document.querySelector("#member-plan").childNodes[1].replaceWith(res.data().privilege);
          // renderProfile('member-plan', "")
          // renderProfile('member-plan', res.data().privilege)
        })
      }


      acaUsers.get().then(res => {
        res.forEach(async (results) => {
          var data = results.data()
          if (results.id != uid) {
            await acaUsers.doc(`${results.id}/confidentials/infos/`).get().then(res => {
              renderUsers(results.id, res.data(), true, table)
            }).catch(err => {
              renderUsers(results.id, data, false, table)
            })
          }
        })
      }).catch(err => console.log(err))



      acaUsers.doc(`${uid}/events/request`).get().then(res => {
        var data = res.data().received;
        var countUpcomming = 0;
        if (data) {
          for (const event in data) {
            if (event != 'count') {

              const nextDays = 1000 * 60 * 60 * 24 * 7;

              if (((data[event].start.toDate() - new Date) <= nextDays && (data[event].start.toDate() - new Date) >= 0) || data[event].start.toDate().toDateString() == new Date().toDateString()) {
                ++countUpcomming;
              }
            }


          }
        }
        document.querySelector("#Upcomming").childNodes[1].replaceWith(countUpcomming);
        // renderProfile('Reminders', countReminders)
      }).catch(err => console.log(err))


    }
  })
})




// acaUsers.doc(`${uid}/events/request`).get().then(res => {
//   var data = res.data().received;
//   var countUpcomming = 0;
//   if (data) {
//     for (const event in data) {
//       if (event != 'count') {

//         const nextDays = 1000 * 60 * 60 * 24 * 7;

//         if (((data[event].start.toDate() - new Date) <= nextDays && (data[event].start.toDate() - new Date) >= 0) || data[event].start.toDate().toDateString() == new Date().toDateString()) {
//           ++countUpcomming;
//           renderScheduler(event, data[event])
//         }
//       }


//     }
//   }
//   document.querySelector("#Upcomming").childNodes[1].replaceWith(countUpcomming);

//   // renderProfile('Upcomming', countUpcomming);
//   // renderProfile('Reminders', countReminders)
// }).catch(err => console.log(err))

acaUsers.doc(`${uid}`).collection('timelines').get().then(res => {
  var countReminders = 0;

  res.forEach(elt => {
    var receivedReminder = elt.data().received;
    if (receivedReminder) {
      for (const msgID in receivedReminder) {
        if (msgID != "count" && !receivedReminder[msgID].trash) {
          ++countReminders;
          renderMessages(msgID, 'timeline.manualReminders', receivedReminder[msgID])
        }
      }
    }
  })
  renderProfile('Reminders', countReminders)
}).catch(err => console.log(err))

// acaUsers.doc(`${uid}/messages/request`).get().then(res => {
//   var countcontactRequest = 0;
//   var sentContactRequest = res.data().sent;
//   if (sentContactRequest) {
//     for (const msgID in sentContactRequest) {
//       if (msgID != "count") {
//         console.log(sentContactRequest)
//         renderContactRequestSent(msgID, sentContactRequest[msgID])
//         ++countcontactRequest;
//       }
//     }
//   }

//   renderProfile('ContactS', countcontactRequest)

//   var countcontactReceived = 0;
//   var receivedContactReceived = res.data().received;
//   if (receivedContactReceived) {
//     for (const msgID in receivedContactReceived) {
//       if (msgID != "count") {
//         if (!document.getElementById(receivedContactReceived[msgID].sender_uid)) {
//           renderContactRequestReceived(msgID, receivedContactReceived[msgID])
//           ++countcontactReceived;
//         }
//       }
//     }
//   }
//   renderProfile('ContactR', countcontactReceived)
// }).catch(err => console.log(err))

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


body.addEventListener('dblclick', async (evt) => {

  if (evt.target.id == 'bio') {
    editBox(evt.target.id)
  }


})



body.addEventListener('click', async (evt) => {

  if (evt.target.tagName == "I" && evt.target.id.includes("delete-")) {
    var id = evt.target.id.replace('delete-', "")

    if (id == "skill") {
      var data = userInfoDB[id];
      delete data[evt.target.dataset.id]
      acaUsers.doc(`${uid}`).update({ [`${id}`]: data }).then(() => {
        acaUsers.doc(`${uid}`).update({ [`${id}/confidentials/infos/`]: data }).then(() => {
          removeItem(evt.target.dataset.id)
        }).catch((err) => { swal({ type: 'error', html: `<p>Contact Admin</p>`, title: "System error" }) })
      }).catch((err) => { swal({ type: 'error', html: `<p>Contact Admin</p>`, title: "System error" }) })

    } else {

      var data = confidentials[id]
      delete data[evt.target.dataset.id]
      acaUsers.doc(`${uid}/confidentials/infos/`).update({ [`${id}`]: data }).then(() => {
        removeItem(evt.target.dataset.id)
      }).catch((err) => { swal({ type: 'error', html: `<p>Contact Admin</p>`, title: "System error" }) })
    }

  }
  if (evt.target.tagName == "I" && evt.target.id.includes("save-")) {
    var target = evt.target.id.replace("save-", "")

    if (target == "bio") {
      var text = document.getElementById(`text-${target}`).textContent.trim();
      if (text == "Please double click to enter your biography") {
        text = "";
      }
      await acaUsers.doc(`${uid}/confidentials/infos/`).update({ bio: text }).then(() => {
        updatedBio(target);
      }).catch((err) => { swal({ type: 'error', html: `<p>Contact Admin</p>`, title: "System error" }) })
    } else if (target == "skill") {
      var color = ['bg-green', 'bg-yellow', 'bg-orange', 'bg-sky', 'bg-blue', 'bg-red'];
      var selectedColor = color[getRandomInt(6)];
      var objectSkill = {
        id: generateID(),
        name: document.getElementById(`text-${target}`).value.trim(),
        value: document.getElementById("myRange").value,
        color: selectedColor
      }
      if (objectSkill.name !== "") {
        await acaUsers.doc(`${uid}`).update({ [`skill.${objectSkill.id}`]: objectSkill }).then(() => {
          acaUsers.doc(`${uid}/confidentials/infos/`).update({ [`skill.${objectSkill.id}`]: objectSkill }).then(() => {
            itemAdded(target, objectSkill)
          }).catch((err) => { swal({ type: 'error', html: `<p>Contact Admin</p>`, title: "System error" }) })
        }).catch((err) => { swal({ type: 'error', html: `<p>Contact Admin</p>`, title: "System error" }) })
      }
      closeBox(target)

    }

    else {
      var text = document.getElementById(`text-${target}`).textContent.trim()

      var objectBio = {
        name: target,
        id: generateID(),
        text: text
      }
      if (objectBio.text != "") {
        await acaUsers.doc(`${uid}/confidentials/infos/`).update({ [`${objectBio.name}.${objectBio.id}`]: objectBio }).then(() => {
          addItem(target, objectBio)
        }).catch((err) => { swal({ type: 'error', html: `<p>Contact Admin</p>`, title: "System error" }) })

      }
      closeBox(target)
    }

  }

  if (evt.target.id.includes("close-")) {
    closeBox(evt.target.id.replace("close-", ""))

  }

  if (evt.target.tagName == "I" && evt.target.id.includes("add-")) {
    var add = document.getElementById("text-" + evt.target.id.replace('add-', ""));
    if (!add) {
      if (evt.target.id.replace('add-', "") == "skill") {
        addSkill(evt.target.id.replace('add-', ""))
        var slider = document.getElementById("myRange");
        var output = document.getElementById("demo");
        output.innerHTML = slider.value;

        slider.oninput = function (evt) {
          output.innerHTML = evt.target.value;
        }
      } else {
        createTextBox(evt.target.id.replace('add-', ""));
      }
    }
  }

  if (evt.target.tagName == "I" && evt.target.id == "admin_picture_select") {

    var src = document.getElementById('admin_picture')
    var target = document.getElementById('target')
    showImage(src, target)

    var file = document.getElementById('admin_picture');
    file.onchange = async () => {

      var selectedFile = file.files[0];
      // Create a reference to 'mountains.jpg'
      var fileName = selectedFile.name;
      var storageRef = storage.ref('/profilePics/' + uid + "/" + fileName);

      var uploadTask = storageRef.put(selectedFile)
      var url = '';
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

      }, function (error) {
        // Handle unsuccessful uploads
        console.log(error)
      }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          acaUsers.doc(`${uid}/confidentials/infos/`).update({ url: downloadURL })
          acaUsers_hist.doc(`${uid}/confidentials/infos/`).update({ url: downloadURL })
        })
      })
    }
  }
  if (evt.target.id == "subject") {
    renderFullMessage(evt.target.dataset.id)
  }
  if (evt.target.tagName == "INPUT" && evt.target.name == "request-accept") {

    var msgReceived = await acaUsers.doc(`${uid}/messages/request`).get().then(res => { return res.data().received }).catch(err => console.log(err));
    var pending = {}
    if (!evt.target.checked) {

      for (const msgID in msgReceived) {
        if (msgReceived[msgID].sender_uid == evt.target.dataset.id) {
          msgReceived[msgID].acceptedFlag = "N";
          msgReceived[msgID].date = new Date();
          pending[uid] = {
            msgID: msgID,
            acceptedFlag: "N",
            acceptedSendFlag: "N"
          }
          // delete msgReceived[msgID]
        }
      }
      acaUsers.doc(`${uid}/messages/request`).update({ [`pending`]: pending }).catch(err => console.log(err))
      // acaUsers.doc(`${uid}/messages/request`).update({ [`received`]: msgReceived }).catch(err => console.log(err))

      acaUsers.doc(`${uid}`).update({ [`lastUpdate`]: new Date() }).catch(err => console.log(err))
      acaUsers_hist.doc(`${uid}`).update({ [`lastUpdate`]: new Date() }).catch(err => console.log(err))
      // acaUsers.doc(`${evt.target.id}/confidentials/infos`).update({ [`changes.${changeId}.date`]: new Date(), [`changes.${changeId}.by`]: uid })
    } else {
      for (const msgID in msgReceived) {
        if (msgReceived[msgID].sender_uid == evt.target.dataset.id) {
          msgReceived[msgID].acceptedFlag = "Y";
          msgReceived[msgID].acceptedSendFlag = "N";
          msgReceived[msgID].date = new Date();
          pending[uid] = {
            msgID: msgID,
            acceptedFlag: "Y",
            acceptedSendFlag: "N"
          }
          // delete msgReceived[msgID]
        }
      }
      acaUsers.doc(`${uid}/messages/request`).update({ [`pending`]: pending }).catch(err => console.log(err))
      // acaUsers.doc(`${uid}/messages/request`).update({ [`received`]: msgReceived }).catch(err => console.log(err))
      acaUsers.doc(`${uid}`).update({ [`lastUpdate`]: new Date() }).catch(err => console.log(err))
      acaUsers_hist.doc(`${uid}`).update({ [`lastUpdate`]: new Date() }).catch(err => console.log(err))
    }

    // await delay(500)
    // window.location.reload()

  }
  if (evt.target.tagName == "I" && (evt.target.id == "request-contact" || evt.target.id == "request-reminder")) {
    acaUsers.doc(`${uid}/confidentials/infos`).get().then(async (res) => {
      var data = res.data();
      var userInfos = await acaUsers.doc(uid).get().then(res => { return res.data() }).catch(err => console.log(err))
      if (data.privilege == "admin" || data.privilege == "premium") {

        var countRequest = 0;
        var sentContactRequestMessage = {
          receiver_uid: evt.target.dataset.id,
          sender_uid: uid,
          message: `Your contact is Request by ${data.firstName} ${data.lastName} (${data.sensitive.email}).`,
          subject: `ACA member contact request on Lead us `,
          sender_first_name: userInfos.firstName,
          sender_last_name: userInfos.lastName,
          sender_province: userInfos.province,
          sender_city: userInfos.city,
          sender_status: "pending",
          date: new Date(),
          msgID: generateID()
        }
        if (data.status == "Study Permit") {
          sentContactRequestMessage['sender_studyField'] = data.studyField
          sentContactRequestMessage['sender_school'] = data.school;
        } else {
          sentContactRequestMessage['sender_workField'] = data.workField
        }

        countRequest = await exceedRequest(sentContactRequestMessage.receiver_uid);

        if (countRequest <= 2) {

          acaUsers.doc(`${uid}/messages/request`).update({ [`pending.${sentContactRequestMessage.receiver_uid}`]: sentContactRequestMessage, count: increment }).then(() => {
            acaUsers.doc(`${uid}`).update({ [`lastUpdate`]: new Date() }).then(() => {
              acaUsers_hist.doc(`${uid}/messages/request`).update({ [`pending.${sentContactRequestMessage.receiver_uid}`]: sentContactRequestMessage, count: increment }).then(() => {
                acaUsers_hist.doc(`${uid}`).update({ [`lastUpdate`]: new Date() }).then(() => {
                  swal({
                    type: 'success',
                    title: 'sent',
                    html: 'request sent'
                  })
                }).catch(err => console.log(err))
              }).catch(err => console.log(err))
            }).catch(err => console.log(err))
          }).catch(err => console.log(err))
        } else {
          swal({
            title: 'Not a premium',
            html: `<p>you have exceed the number of request for this user<p>`,
            type: 'warning'
          })
        }
      } else {
        swal({
          title: 'Not a premium',
          html: `<p>you are not a premium member<p>`,
          type: 'warning',
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonColor: 'green',
          confirmButtonText: 'Go Premium'
        }).then((result) => {
          if (result) {
            swal({
              title: 'sent',
              html: `<p>you will be contacted by an admin within the next bussiness day<p>`,
              type: 'success',
              showConfirmButton: true,
            })
          }
        })
      }
    }).catch(err => console.log(err))
  }

  if (evt.target.tagName == "I" && evt.target.id == "trash") {

    acaUsers.doc(`${uid}/`).collection('timelines').get().then(res => {
      res.forEach(elt => {
        var receivedReminder = elt.data().received;
        if (receivedReminder && receivedReminder[evt.target.dataset.id]) {
          acaUsers.doc(`${uid}/timelines/${elt.id}`).update({ [`received.${evt.target.dataset.id}.trash`]: true }).then(() => {
            acaUsers_hist.doc(`${uid}/timelines/${elt.id}`).update({ [`received.${evt.target.dataset.id}.trash`]: true }).then(() => {
              deleteMessage(evt.target.dataset.id);
            })
          })
        }
      })
    })
    // acaServices.get().then(res => {
    //   res.forEach(elt => {
    //     var data = elt.data();
    //     var updateObjet = evt.target.dataset.name.split('.');
    //     var result = {};
    //     if (updateObjet[0] === "events") {
    //       var event = data[updateObjet[0]];
    //       result = event[evt.target.dataset.id].to;
    //       result[uid].deleted = true;
    //       result[uid].lastModify = new Date();
    //       acaServices.doc(elt.id).update({ [`${updateObjet[0]}`]: event })
    //     } else {

    //       for (const event of updateObjet) {
    //         result = result[event] || data[event]
    //       }
    //       console.log(evt.target.dataset.id)
    //       delete result[evt.target.dataset.id]

    //       acaServices.doc(elt.id).update({ [`${evt.target.dataset.name}`]: result })
    //     }
    //     deleteMessage(evt.target.dataset.id);
    //   })
    // })
  }
})


// acaServices.onSnapshot(function (snapshot) {
//   snapshot.docChanges().forEach(function (change) {

//     if (change.type == "modified") {
//       var messages = change.doc.data().events
//       var reminders = change.doc.data().timeline.manualReminders
//       for (const msg in messages) {

//         if (messages[msg].to[uid].status == 'close') {
//           const options = {
//             body: "Testing Our Notification",
//             icon: "/img/icons/icon-72x72.png"
//           };
//           notification(options)
//           acaServices.doc(change.doc.id).update({ [`messages[msg].to.${uid}.status`]: "sent" })
//           acaServices_hist.doc(change.doc.id).update({ [`messages[msg].to.${uid}.status`]: "sent" })
//         }
//       }
//       for (const rem in reminders) {

//         if (reminders[rem].notification == 'close') {
//           const options = {
//             body: "Notification Reminder",
//             icon: "/img/icons/icon-72x72.png"
//           };
//           notification(options)
//           acaServices.doc(change.doc.id).update({ [`reminders.${rem}.notification`]: "sent" })
//           acaServices_hist.doc(change.doc.id).update({ [`reminders.${rem}.notification`]: "sent" })
//         }
//       }
//     }

//   })
// })

const exceedRequest = async (usrid) => {
  var countRequest = 0;
  var requests = await acaUsers.doc(`${uid}/messages/request`).get().then(res => { return res.data().sent }).catch(err => console.log(err))


  for (const req in requests) {
    if (requests[req].uid == usrid) {
      ++countRequest
    }
  }
  return countRequest;
}


var form = document.querySelector('form[id="updateInfoFrom"]')

form.addEventListener('submit', evt => {
  evt.preventDefault()
  var clientInfos = {
    firstName: form.first_name.value.trim(),
    lastName: form.last_name.value.trim(),
    studyField: form.studyField.value.trim(),
    school: form.school.value.trim(),
    workField: form.workField.value.trim(),
    city: form.city.value.trim(),
    province: form.province.value.trim()
  }

  var confidentialInfo = {
    sensitive: {
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      statusToDate: form.statusToDate.value.trim() ? new Date(form.statusToDate.value.trim()) : null,
      passportToDate: form.passportToDate.value.trim() ? new Date(form.passportToDate.value.trim()) : null,
      address: form.address.value.trim(),
      postalCode: form.postalCode.value.trim()
    },
    employer: form.employer.value.trim(),
    sexe: form.sexe.value.trim(),
    status: form.status.value.trim()
  }

  // statusToDate: form.statusToDate.value.trim() ? new Date(form.statusToDate.value.trim()).setDate(new Date(form.statusToDate.value.trim()).getDate() + 1) : null,
  // passportToDate: form.passportToDate.value.trim() ? new Date(form.passportToDate.value.trim()).setDate(new Date(form.passportToDate.value.trim()).getDate() + 1) : null,

  var socialMedia = {
    website: form.website.value.trim(),
    facebookLink: form.facebookLink.value.trim(),
    instagramLink: form.instagramLink.value.trim(),
    otherMedia: form.otherMedia.value.trim()
  }

  var infos = Object.assign({}, clientInfos, confidentialInfo);


  if (infos.status == 'Study Permit') {
    infos["workField"] = "0";
    clientInfos["workField"] = "0";
    infos["employer"] = "0";
    clientInfos["employer"] = "0";
  } else {
    infos["studyField"] = "0";
    clientInfos["studyField"] = "0";
    infos["school"] = "0";
    clientInfos["school"] = "0";
  }
  var verificator = true
  for (const info in infos) {
    if (infos[info] == "") {
      toast(`${info} is missing`, 'red')
      verificator = false;
    }
  }
  infos["show_phone"] = form.phone_visible.checked

  infos = Object.assign({}, infos, socialMedia);

  if (verificator) {
    for (const info in infos)
      acaUsers.doc(`${uid}/confidentials/infos`).update({ [`${info}`]: infos[info] }).catch(err => toast(`${info} is missing`, 'red')).then(() => window.location.reload())

    for (const info in clientInfos)
      acaUsers.doc(`${uid}`).update({ [`${info}`]: clientInfos[info] }).catch(err => toast(`${info} is missing`, 'red')).then(() => window.location.reload())

    toast("All Saved thanks", 'green')
  }


})

function toast(text, color) {
  var x = document.createElement("div");
  x.setAttribute("id", "snackbar");
  x.innerHTML = text;
  x.className = "show";
  document.body.appendChild(x);
  var y = document.getElementById("snackbar");
  y.style.backgroundColor = color;
  setTimeout(function () { x.className = x.className.replace("show", ""); x.remove() }, 3000);
}


$('#status').on('change', evt => {
  if (evt.target.value == "Canadian") {
    document.getElementById('statusDate').style.display = "none";
    document.getElementById('passportDate').style.display = "none";
    document.querySelector("form").passportToDate.value = "0";
    document.querySelector("form").statusToDate.value = "0";

  } else {
    document.getElementById('statusDate').style.display = "block";
    document.getElementById('passportDate').style.display = "block";
    document.querySelector("form").passportToDate.value = "";
    document.querySelector("form").statusToDate.value = "";
  }
  //if student 
  if (evt.target.value == "Study Permit") {
    document.getElementById('student').style.display = "block";
    document.getElementById('worker').style.display = "none";
    document.getElementById('workField').value = "0";
    document.getElementById('employer').value = "0";
  } else {
    document.getElementById('workField').value = "";
    document.getElementById('employer').value = "";
  }
  if (evt.target.value == "Work Permit" || evt.target.value == "Canadien" || evt.target.value == "Permanent Resident") {
    document.getElementById('student').style.display = "none";
    document.getElementById('worker').style.display = "block";
    document.getElementById('studyField').value = "0";
    document.getElementById('school').value = "0";
  } else {
    document.getElementById('studyField').value = "";
    document.getElementById('school').value = "";
  }

})


$("#admin_picture_select").click(function () {
  $("#admin_picture").trigger('click');
});

window.onload = () => {

  var calendarDay = document.getElementById("calendarDay");
  var span = calendarDay.getElementsByTagName("span")
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  var ids = ["sunGroup", "monGroup",
    "tueGroup",
    "wedGroup",
    "thuGroup",
    "friGroup",
    "satGroup"]
  var ul = calendarDay.getElementsByTagName("ul")
  var today = new Date()
  today = today.getDay()
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  for (var i = 0; i < span.length; i++) {
    var outputDate = (date.getDate() + i) % lastDay.getDate() == 0 ? lastDay.getDate() : (date.getDate() + i) % lastDay.getDate()
    var outputMonth = (date.getDate() + i) >= lastDay.getDate() ? date.getMonth() + 2 : date.getMonth() + 1
    span[i].innerHTML = `${days[(today) % 7]} <br/>${outputDate}/${outputMonth}`
    ul[i].setAttribute("id", ids[(today) % 7])
    ++today
  }


}

