const form = document.querySelector("form[name='register']")
const login = document.getElementById('login');
const resetPassword = document.getElementById('resetPassword');
const contactForm = document.querySelector('#contact-form')

// function delay(i) {
//   return new Promise(resolve => setTimeout(resolve, i));
// }

form.addEventListener('submit', async (evt) => {
  evt.preventDefault()
    const password = document.getElementById("password").value.trim();
    const repassword = document.getElementById("repassword").value.trim();

    if (password == repassword) {

      const clientInfos = {
        lastName: form.lastName.value.trim(),
        firstName: form.firstName.value.trim(),
        school: form.school.value.trim(),
        workField: form.workField.value.trim(),
        createdDate: new Date(),
        studyField: form.studyField.value.trim(),
        city: form.city.value.trim(),
        province: form.province.value.trim()
      };

      var confidentialInfo = {
        employer: form.employer.value.trim(),
        privilege: 'member',
        sexe: form.sexe.value.trim(),
        status: form.status.value.trim()
      };

      var verificator = true;
      // verificator = await missingField(clientInfos);
      // delay(200);
      // verificator = await missingField(confidentialInfo);

      confidentialInfo['sensitive'] = {
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        address: form.address.value.trim(),
        postalCode: form.postalCode.value.trim(),
      };


      var date = new Date();



      // verificator = await missingField(confidentialInfo.sensitive);

      var infos = Object.assign({}, clientInfos, confidentialInfo);
      // if()
      if (clientInfos.lastName != "" &&
        clientInfos.firstName != "" &&
        clientInfos.school != "" &&
        clientInfos.workField != "" &&
        clientInfos.createdDate != "" &&
        clientInfos.studyField != "" &&
        clientInfos.city != "" &&
        clientInfos.province != "" &&
        confidentialInfo.employer != "" &&
        confidentialInfo.privilege != "" &&
        confidentialInfo.sexe != "" &&
        confidentialInfo.status != "" &&
        confidentialInfo.sensitive.phone != "" &&
        confidentialInfo.sensitive.email != "" &&
        confidentialInfo.sensitive.address != "" &&
        confidentialInfo.sensitive.postalCode != "") {
        if (validateEmail(confidentialInfo.sensitive.email)) {
          auth.createUserWithEmailAndPassword(confidentialInfo.sensitive.email, password).then(cred => {
            db.collection("users-ACA").doc(cred.user.uid).set(clientInfos).then(() => {
              db.collection("users-ACA_hist").doc(cred.user.uid).set(clientInfos).then(() => {
                db.collection("users-ACA").doc(`${cred.user.uid}/timelines/manualReminders/`).set({ count: 0 }).then(() => {
                  db.collection("users-ACA_hist").doc(`${cred.user.uid}/timelines/manualReminders/`).set({ count: 0 }).then(() => {
                    db.collection("users-ACA").doc(`${cred.user.uid}/timelines/autoReminders/`).set({ count: 0 }).then(() => {
                      db.collection("users-ACA_hist").doc(`${cred.user.uid}/timelines/autoReminders/`).set({ count: 0 }).then(() => {
                        db.collection("users-ACA").doc(`${cred.user.uid}/timelines/manualPermitReminders/`).set({ count: 0 }).then(() => {
                          db.collection("users-ACA_hist").doc(`${cred.user.uid}/timelines/manualPermitReminders/`).set({ count: 0 }).then(() => {
                            db.collection("users-ACA").doc(`${cred.user.uid}/timelines/autoPermitReminders/`).set({ count: 0 }).then(() => {
                              db.collection("users-ACA_hist").doc(`${cred.user.uid}/timelines/autoPermitReminders/`).set({ count: 0 }).then(() => {
                                db.collection("users-ACA").doc(`${cred.user.uid}/events/request/`).set({ count: 0 }).then(() => {
                                  db.collection("users-ACA_hist").doc(`${cred.user.uid}/events/request/`).set({ count: 0 }).then(() => {
                                    db.collection("users-ACA").doc(`${cred.user.uid}/messages/request/`).set({ count: 0 }).then(() => {
                                      db.collection("users-ACA_hist").doc(`${cred.user.uid}/messages/request/`).set({ count: 0 }).then(() => {
                                        infos['authorized'] = [cred.user.uid];
                                        infos['show_phone'] = false;
                                        infos['first_login'] = true;
                                        db.collection("users-ACA").doc(`${cred.user.uid}/confidentials/infos/`).set(infos).then(() => {
                                          db.collection("users-ACA_hist").doc(`${cred.user.uid}/confidentials/infos/`).set(infos).then(() => {
                                            var elt = { id: 'CJxWbj5QMYUQTn8ebhEt' };
                                            db.collection(`ACA-services`).doc(`${elt.id}/messages/${cred.user.uid}`).set({ count: 0 }).then(() => {
                                              db.collection(`ACA-services_hist`).doc(`${elt.id}/messages/${cred.user.uid}`).set({ count: 0 }).then(() => {
                                                auth.signOut().then(() => {
                                                  M.toast({ html: `${clientInfos.firstName} you are now registered`, classes: 'rounded green' })
                                                  sessionStorage.clear();
                                                  window.location.href = "/index.html";

                                                  form.reset();
                                                }).catch(err => { auth.currentUser.delete(); db.collection("ACA-services").doc(elt.id).delete(); db.collection("ACA-services_hist").doc(elt.id).delete(); })
                                              }).catch(err => { auth.currentUser.delete(); db.collection("ACA-services").doc(elt.id).delete(); db.collection("ACA-services_hist").doc(elt.id).delete(); })
                                            }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                                          }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                                        }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                                      }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                                    }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                                  }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                                }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                              }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                            }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                          }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                        }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                      }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                    }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                  }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
                }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
              }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); db.collection("users-ACA_hist").doc(cred.user.uid).delete(); })
            }).catch(err => { auth.currentUser.delete(); db.collection("users-ACA").doc(cred.user.uid).delete(); })
          }).catch(err => {
            M.toast({ html: `${err.message}`, classes: 'rounded red' })
          })
        } else {
          M.toast({ html: `enter a valid email`, classes: 'rounded red' })
        }
      } else {
        M.toast({ html: `enter all your infos`, classes: 'rounded red' })
      }

    }
    else {
      M.toast({ html: `enter the same password is required`, classes: 'rounded red' })
    }


})

login.addEventListener('click', evt => {
  evt.preventDefault();

    if (evt.target.id == "resetPassword") {
      var email = document.getElementById("resetEmail").value.trim();

      auth.sendPasswordResetEmail(email).then(function () {
        // Email sent.
        M.toast({ html: `email sent to ${email}`, classes: 'rounded green' });

      }).catch(function (error) {
        // An error happened.
        M.toast({ html: `${error.message}`, classes: 'rounded red' });
      });

    } else if (evt.target.id == "loginSubmit") {

      var email = document.getElementById("loginEmail").value.trim();
      var password = document.getElementById("loginPassword").value.trim();

      if (email !== "" && password !== "") {
        auth.signInWithEmailAndPassword(email, password).then((cred) => {
          db.collection("users-ACA").doc(cred.user.uid).get().then(doc => {
            if (doc) {
              sessionStorage.setItem('uid', cred.user.uid)
              if (doc.data().privilege == "member") {
                window.location.assign('/pages/profile.html');
              } else {
                sessionStorage.clear();
                window.location.href = "/index.html";
              }
            } else {
              M.toast({ html: `No such document!`, classes: 'rounded red' });
              M.toast({ html: `${clientInfos.firstName} you are now registered`, classes: 'rounded green' })
              sessionStorage.clear();

            }
          }).catch(function (error) {
            auth.signOut().then(() => {
              M.toast({ html: `${clientInfos.firstName} you are now registered`, classes: 'rounded green' })
              sessionStorage.clear();
            })
          })
        }).catch(err => {
          M.toast({ html: `${err.message}`, classes: 'rounded red' });
        })
      } else {
        M.toast({ html: `please enter your email and your password`, classes: 'rounded red' })
      }
    }

})

contactForm.addEventListener('click', evt => {
  if (date.getFullYear() >= 2021) {

    if (evt.target.type == "submit" || evt.target.tagName == "I") {
      evt.preventDefault()
      var uid = sessionStorage.getItem('uid')
      var firstName = document.getElementById('first_name').value.trim()
      var lastName = document.getElementById('last_name').value.trim()
      var email = document.getElementById('contact_email').value.trim()
      var subject = document.getElementById('subject').value.trim()
      var message = document.getElementById('message').value.trim()
      var messageInfo = {
        uid: uid,
        firstName: firstName,
        lastName: lastName,
        from: email,
        to: "ACA",
        subject: subject,
        message: `${firstName} ${lastName} sent a message from: ${email} 
      <p>messege: ${message}</p>`,
        msgID: generateID(),
        read: "false",
        date: new Date()
      };
      var verification = true;

      for (const info in messageInfo) {
        if (messageInfo[info] == "") {
          M.toast({ html: `${info} is empty`, classes: 'rounded red' })
          verification = false;
        }

      }

      if (verification) {
        acaService.get().then(results => {
          results.forEach(res => {
            acaService.doc(res.id).get().then(res => {
              if (uid) {
                acaService.doc(`${res.id}/messages/${uid}/`).update({ [`advises.pending.${messageInfo.msgID}`]: messageInfo, 'advises.count': increment }).then(() => {
                  acaService.doc(`${res.id}`).update({ [`lastUpdate`]: new Date() }).then(() => {
                    acaService_hist.doc(`${res.id}/messages/${uid}`).update({ [`advises.pending.${messageInfo.msgID}`]: messageInfo, 'advises.count': increment }).then(() => {
                      acaService_hist.doc(`${res.id}`).update({ [`lastUpdate`]: new Date() }).then(() => {
                        resetAllValues()
                      }).catch(err => console.log(err))
                    }).catch(err => console.log(err))
                  }).catch(err => console.log(err))
                }).catch(err => console.log(err))
              } else {
                acaService.doc(`${res.id}/messages/guest/`).update({ [`advises.pending.${messageInfo.msgID}`]: messageInfo, "advises.count": increment }).then(() => {
                  acaService.doc(`${res.id}`).update({ [`lastUpdate`]: new Date() }).then(() => {
                    acaService_hist.doc(`${res.id}/messages/guest/`).update({ [`advises.pending.${messageInfo.msgID}`]: messageInfo, "advises.count": increment }).then(() => {
                      acaService_hist.doc(`${res.id}`).update({ [`lastUpdate`]: new Date() }).then(() => {
                        resetAllValues()
                      }).catch(err => console.log(err))
                    }).catch(err => console.log(err))
                  }).catch(err => console.log(err))
                }).catch(err => console.log(err))
              }
            }).catch(err => console.log(err))
          })
        }).catch(err => console.log(err))
      }
    }
  } else {
    M.toast({ html: `please Wait january 1st, 2021`, classes: 'rounded red' })

  }
})


const missingField = (clientInfos) => {

  for (const info in clientInfos) {
    if (!clientInfos[info] || clientInfos[info] == "") {
      M.toast({ html: `${info} is required`, classes: 'rounded red' })
      return false;
    }
  }
  return true;
}