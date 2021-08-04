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
const acaUsers = db.collection('users-ACA');
const ACAservices = db.collection('ACA-services');
const ACAservices_hist = db.collection('ACA-services_hist');
const acaUsers_hist = db.collection('users-ACA_hist');
const doc_id = 'vznpBopGSohFk0IrNwEY';
const uid = sessionStorage.getItem('uid');

const setServiceID = async () => {
  var id = await ACAservices.get().then(res => {
    var resID;
    res.forEach(elt => {
      resID = elt.id;
    })
    return resID;
  })
  return id;

}


/* generateID Start
--------------------------------------------------------------------*/

function generateID() {
  var d = new Date().getTime();

  var guid = 'xxxxxxxx-xxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);

    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  return guid;
}
/*GenerateId end
--------------------------------------------------------------------*/



const body = document.querySelector('body');
body.addEventListener('click', async(evt) => {
  console.log(evt)
  if (evt.target.name == "admin-btn" && evt.target.tagName == "INPUT") {
    console.log(evt.target.checked, evt.target.id)
    var confidentials = await acaUsers.doc(`${evt.target.id}/confidentials/infos`).get().then(res => { return res.data() }).catch(err => console.log(err));

    var message= {
      from: "ACA",
      to: confidentials.sensitive.eamil
    }
    if (!evt.target.checked) {
      var changeId = generateID();
      acaUsers.doc(`${evt.target.id}/confidentials/infos`).update({ privilege: "member" })
      acaUsers.doc(`${evt.target.id}/confidentials/infos`).update({ [`changes.${changeId}.date`]: new Date(), [`changes.${changeId}.by`]: uid })
      acaUsers.doc(`${evt.target.id}`).update({ lastUpdate: new Date()})
    } else {
      var changeId = generateID();
      acaUsers.doc(`${evt.target.id}/confidentials/infos`).update({ privilege: "admin" })
      acaUsers.doc(`${evt.target.id}/confidentials/infos`).update({ [`changes.${changeId}.date`]: new Date(), [`changes.${changeId}.by`]: uid })
      acaUsers.doc(`${evt.target.id}`).update({ lastUpdate: new Date()})
    }
  }
  if (evt.target.name == "premium-btn" && evt.target.tagName == "INPUT") {
    console.log(evt.target.checked, evt.target.id)
    if (!evt.target.checked) {
      var changeId = generateID();
      acaUsers.doc(`${evt.target.id}/confidentials/infos`).update({ privilege: "member" })
      acaUsers.doc(`${evt.target.id}/confidentials/infos`).update({ [`changes.${changeId}.date`]: new Date(), [`changes.${changeId}.by`]: uid })
      acaUsers.doc(`${evt.target.id}`).update({ lastUpdate: new Date()})
    } else {
      var changeId = generateID();
      acaUsers.doc(`${evt.target.id}/confidentials/infos`).update({ privilege: "premium" })
      acaUsers.doc(`${evt.target.id}/confidentials/infos`).update({ [`changes.${changeId}.date`]: new Date(), [`changes.${changeId}.by`]: uid })
      acaUsers.doc(`${evt.target.id}`).update({ lastUpdate: new Date()})
    }
  }
})



acaUsers.doc(uid).get().then(res => {
  console.log(res.data())
  renderText('full-name', res.data().firstName + ' ' + res.data().lastName)
  if (res.data().url) {
    document.getElementById('profilePic').src = res.data().url;
  }
})
acaUsers.get().then(res => {

  res.forEach(elt => {
    acaUsers.doc(`${elt.id}/confidentials/infos`).get().then(result => {
      var infos = Object.assign({}, result.data(), elt.data());
      renderUsers(elt.id, infos)
      var data = result.data();

      if(data.status=='Permanent Resident'){
        renderTable('all-PR', elt.id, infos)
      }
      else if(data.status=='Study Permit'){
        renderTable('all-students', elt.id, infos)
      }
      else if(data.status=='Work Permit'){
        renderTable('all-workers', elt.id, infos)
      }
      else if(data.status=='Canadian'){
        renderTable('all-CA', elt.id, infos)
      }
      if(data.sexe=='male'){
        renderTable('all-males', elt.id, infos)
      }
      else if(data.sexe=='female'){
        renderTable('all-females', elt.id, infos)
      }

    })
  })
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
}, 1000)

