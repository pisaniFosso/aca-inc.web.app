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

function delay(i) {
  return new Promise(resolve => setTimeout(resolve, i));
}

const acaUsers = db.collection('users-ACA');
const ACAservices = db.collection('ACA-services');
const ACAservices_hist = db.collection('ACA-services_hist');
const acaUsers_hist = db.collection('users-ACA_hist');
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

const setAllUsers = async () => {
  var usersId = await acaUsers.get().then(res => {
    var users=[];
    res.forEach(elt => {
      users.push(elt.id);
    })
    return users;
  })
  return usersId;

}


const body = document.querySelector('body');
body.addEventListener('click', async (evt) => {
  console.log(evt)
  if (evt.target.tagName == 'I' && evt.target.id == "subject") {
    
    var serviceID = await setServiceID();
    var usersID = await setAllUsers();
    usersID.forEach(usr=>{
      if(usr == uid){
      ACAservices.doc(`${serviceID}/messages/${usr}`).update({ [`advises.sent.${evt.target.dataset.id}.read`]: true }).then(()=>{
        renderFullMessage(evt.target.dataset.id)
      })
    }
    })

  }
  if ((evt.target.tagName == "A" || evt.target.tagName == "I") && evt.target.id == "readSelect") {
    var all_messages = document.getElementById('table-inbox')
    var input = all_messages.getElementsByTagName('input')
    for (let i = 0; i < input.length; i++) {
      await delay(1000)
      if (input[i].checked == true) {

        makeReadorUnRead(i, input, true)
      }
    }
  }
  if ((evt.target.tagName == "A" || evt.target.tagName == "I") && evt.target.id == "unreadSelect") {
    var all_messages = document.getElementById('table-inbox')
    var input = all_messages.getElementsByTagName('input')
    for (let i = 0; i < input.length; i++) {
      await delay(1000)
      if (input[i].checked == true) {
        makeReadorUnRead(i, input, "false")

      }
    }
  }

  if (evt.target.id == "new-email") {
    swal({
      title: "New Email",
      html: `
      <div class="container" style="float:left">
      <label for="fullName">Full Name: </label>
      <input type="text" placeholder="full receiver name" id="fullName"/>
      <br/>
      <label for="subjectText">subject: </label>
      <input type="text" placeholder="subject" id="subjectText"/>
      <br/>
      <label for="email">To: </label>
      <input type="email" placeholder="email" id="email"/>
      <br/>
      <label for="textmsg">Message: </label>
      <textarea id="textmsg" style="min-width=400px; min-height:200px"></textarea>
      </div>
      `,
      showCancelButton: true,
      cancelButtonColor: 'red'
    }).then(result => {
      if (result) {
        var details = {
          fullName: $("#fullName").val(),
          subject: $("#subjectText").val(),
          to: $("#email").val(),
          message: $("#textmsg").val(),
          msgID: generateID(),
          date: new Date(),
          from: uid
        }
        console.log(details);
        if (details.to !== "" && details.fullName != "" && details.subject !== "" && details.message !== "") {
          ACAservices.get().then(res => {
            res.forEach(elt => {
              ACAservices.doc(elt.id).update({ [`messageSent.${details.msgID}`]: details }).then(() => {
                ACAservices_hist.doc(elt.id).update({ [`messageSent.${details.msgID}`]: details }).then(() => {
                  swal({
                    title: "message sent",
                    type: "success"
                  }).then(resul => renderMessagesSend(details.msgID, details))
                })
              })
            })
          })
        } else {
          toast('please fill all info', "red")
        }
      }
    })
  }
  if (evt.target.id == 'inbox') {
    changeActive(evt.target.id)
  }
  if (evt.target.id == 'send') {
    changeActive(evt.target.id)
  }
  if (evt.target.id == 'trash') {
    changeActive(evt.target.id)
  }
  if (evt.target.id == "trash-inbox") {
    var all_messages = document.getElementById('table-inbox')
    var input = all_messages.getElementsByTagName('input')
    for (let i = 0; i < input.length; i++) {
      await delay(1000)
      if (input[i].checked == true) {
        deleteMessage(i, input, "inbox")

      }
    }

  }
  if (evt.target.id == "trash-send") {
    var all_messages = document.getElementById('table-send')
    var input = all_messages.getElementsByTagName('input')
    console.log(evt.target.id)
    for (let i = 0; i < input.length; i++) {
      await delay(1000)
      if (input[i].checked == true) {
        deleteMessage(i, input, "send")

      }
    }

  }

  if (evt.target.id == "openInboxMessage") {
    var all_messages = document.getElementById('table-inbox')
    var input = all_messages.getElementsByTagName('input')
    for (let i = 0; i < input.length; i++) {
      // await delay(1000)
      if (input[i].checked == true) {
        renderFullMessage(input[i].id)
      }
    }
  }
  if (evt.target.id == "openSendMessage") {
    var all_messages = document.getElementById('table-send')
    var input = all_messages.getElementsByTagName('input')
    for (let i = 0; i < input.length; i++) {
      // await delay(1000)
      if (input[i].checked == true) {
        renderFullMessage(input[i].id)
      }
    }
  }
  if (evt.target.id == "openTrashInboxMessage") {
    var all_messages = document.getElementById('table-trash-inbox')
    var input = all_messages.getElementsByTagName('input')
    console.log("open")
    for (let i = 0; i < input.length; i++) {
      // await delay(1000)
      if (input[i].checked == true) {
        renderFullMessage(input[i].id)
      }
    }
  }
  if (evt.target.id == "openTrashSendMessage") {
    var all_messages = document.getElementById('table-trash-send')
    var input = all_messages.getElementsByTagName('input')
    for (let i = 0; i < input.length; i++) {
      // await delay(1000)
      if (input[i].checked == true) {
        renderFullMessage(input[i].id)
      }
    }
  }
  // if (evt.target.id == "closeInboxMessage") {

  // }
})


setTimeout(async () => {
  serviceID = await setServiceID()
  var countSent = 0

  ACAservices.doc(`${serviceID}`).collection('messages').get().then(async (results) => {
    results.forEach(elt => {
      var count = 0
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
              renderMessages(message.msgID, message)

            }

          }
          renderText('messages-count', count)
          renderText('inboxCount', count)

        }

        else if (advise == 'sent') {
          var sent = data[advise];
          for (const msg in sent) {
            if (msg !== "count") {
              var message = sent[msg];
              renderMessagesSend(message.msgID, message)

              ++countSent;
            }

          }

        }
      }
    })
    renderText('sentCount', countSent)

  })
}, 2000);




acaUsers.doc(uid).get().then(res => {
  console.log(res.data())
  renderText('full-name', res.data().firstName + ' ' + res.data().lastName)
  if (res.data().url) {
    document.getElementById('profilePic').src = res.data().url;
  }
})

// db.collection(`bzl6zNbhKxKcSRWDhG39/messageSent`).doc().get().then(res => {
//   console.log(res.data())
// })
// ACAservices.get().then(results => {
//   results.forEach(result => {
//     var data = result.data();
//     var count = 0;


//     var messages = data.messages || {}
//     var messagesSent = data.messageSent || {}
//     var messagesTrash = data.trash || {}
//     for (const elt in messages) {
//       renderMessages(elt, messages[elt])
//       if (messages[elt].read == "false") {
//         const msg = {
//           name: messages[elt].firstName + " " + messages[elt].lastName,
//           msg: messages[elt].message.slice(0, 100),
//           date: messages[elt].date.toDate().toDateString()
//         }
//         ++count
//         renderMessage('messages-count', msg);
//       }
//     }
//     renderText('messages-count', count)
//     renderText('inboxCount', count)

//     count = 0;

//     for (const elt in messagesSent) {

//       renderMessagesSend(messagesSent[elt].msgID, messagesSent[elt])
//       ++count;
//     }

//     for (const elt in messagesTrash) {
//       const trash = messagesTrash[elt]
//       for (const msg in trash)
//         renderMessagesTrash(msg, trash[msg], elt)
//     }

//     renderText('sentCount', count)

//   })
// })

$("#checkbox-group-inbox").on('click', evt => {
  console.log(evt)
  if (evt.target.checked == true) {
    selectAll(evt.target.name)
  } else {
    UnSelectAll(evt.target.name)
  }
})
$("#checkbox-group-send").on('click', evt => {
  console.log(evt)
  if (evt.target.checked == true) {
    selectAll(evt.target.name)
  } else {
    UnSelectAll(evt.target.name)
  }
})
$("#checkbox-group-trash-inbox").on('click', evt => {
  console.log(evt)
  if (evt.target.checked == true) {
    selectAll(evt.target.name)
  } else {
    UnSelectAll(evt.target.name)
  }
})
$("#checkbox-group-trash-send").on('click', evt => {
  console.log(evt)
  if (evt.target.checked == true) {
    selectAll(evt.target.name)
  } else {
    UnSelectAll(evt.target.name)
  }
})


function deleteMessage(i, input, text) {
  ACAservices.get().then(res => {
    res.forEach((elt) => {
      console.log(text)
      if (text == "inbox")
        var messages = { data: elt.data().messages, what: 'messages' };
      else
        var messages = { data: elt.data().messageSent, what: 'messageSent' };
      for (const msg in messages.data) {
        if (msg == input[i].id) {
          ACAservices.doc(elt.id).update({ [`trash.${text}.${msg}`]: messages.data[msg] }).then(() => {
            delete messages.data[msg]
            ACAservices.doc(elt.id).update({ [`${messages.what}`]: messages.data }).then(() => {
              var td = removeMessage(msg);
              addTrash(text, td);
            })
          })
        }
      }


    })
  })
}
function makeReadorUnRead(i, input, text) {

  var serviceID = await setServiceID();
    var usersID = await setAllUsers();
    usersID.forEach(usr=>{
      if(usr == uid){
      ACAservices.doc(`${serviceID}/messages/${usr}`).update({ [`advises.sent.${evt.target.dataset.id}.read`]: true }).then(()=>{
        renderFullMessage(evt.target.dataset.id)
      })
    }
    })
  ACAservices.get().then(res => {
    res.forEach((elt) => {
      var messages = elt.data().messages || {}
      for (const msg in messages) {
        if (msg == input[i].id) {
          messages[msg].read = text;
          ACAservices.doc(elt.id).update({ messages: messages }).then(() => {
            if (text == 'false')
              document.querySelector(`.star[data-id="${msg}"]`).classList.add("star-checked")
            else
              document.querySelector(`.star[data-id="${msg}"]`).classList.remove("star-checked")
          })
        }
      }
    })
  })
}

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


function selectAll(name) {
  console.log(name)
  var items = document.getElementsByName(name);
  for (var i = 0; i < items.length; i++) {
    if (items[i].type == 'checkbox')
      items[i].checked = true;
  }
}

function UnSelectAll(name) {
  var items = document.getElementsByName(name);
  for (var i = 0; i < items.length; i++) {
    if (items[i].type == 'checkbox')
      items[i].checked = false;
  }
}

function filter(tableId, searchId) {
  var input, filter, table, td, tr, h, i, j, txtValue;
  input = document.getElementById(searchId);
  filter = input.value.toUpperCase();
  table = document.getElementById(tableId);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    for (j = 0; j < td.length; j++) {
      h = td[j].getElementsByTagName("h4")[0];
      if (h) {
        txtValue = h.textContent || h.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
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


function changeActive(id) {
  var container = document.body.getElementsByClassName('container')
  console.log(id)
  for (var i = 0; i < container.length; i++) {
    if (container[i].id == ("div-" + id)) {
      document.getElementById(container[i].id).style.display = "block"
    } else {
      document.getElementById(container[i].id).style.display = "none"
    }
  }
}