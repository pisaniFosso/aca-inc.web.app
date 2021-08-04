

const renderText = (id, data) => {
  document.getElementById(id).innerHTML = data;
}

const renderInput = (id, data) => {
  document.getElementById(id).value = data;
}


const createTextBox = (boxID) => {

  var box = document.getElementById(boxID);
  html = `
  <div class="textBox" data-id=${boxID}>
  <span aria-hidden="true" id="close-${boxID}">&times;</span>
  <span class="textarea" role="textbox" contenteditable id="text-${boxID}"></span>
  <i class="far fa-save" id="save-${boxID}"></i>
  </div>
  `;

  box.insertAdjacentHTML("beforeend", html);
}

const closeBox = (id) => {

  var box = document.querySelector(`.textBox[data-id="${id}"]`);
  box.remove()

}

const editBox = (boxID) => {

  var box = document.getElementById(boxID);
  html = `
  <div class="textBox" data-id=${boxID}>
  <span class="textarea" role="textbox" contenteditable id="text-${boxID}"> ${box.textContent}</span>
  <i class="far fa-save" id="save-${boxID}"></i>
  </div>
  `;
  box.innerHTML = html;
}

const updatedBio = (boxID) => {
  var box = document.getElementById(boxID);
  var text = document.getElementById(`text-${boxID}`)


  box.innerHTML = text.textContent

}



const queryStrin = window.location.search;
const urlParam = new URLSearchParams(queryStrin);
const id_res = urlParam.get('id');

const addItem = (boxID, data) => {
  var box = document.getElementById(boxID);


  box.innerHTML += `<p class="item" data-id="${data.id}">${data.text}`
  if (!id_res) {

    box.innerHTML +=
      `
<i class="fas fa-trash-alt" id="delete-${boxID}" data-id="${data.id}"></i>`
  }
  box.innerHTML += `</p>`

}

const removeItem = (id) => {
  var box = document.querySelector(`.item[data-id="${id}"]`);
  box.remove()

}


const addSkill = (id) => {

  var skill = document.getElementById(id);
  var html = `
  <div class="textBox" data-id=${id}>
  <span aria-hidden="true" id="close-${id}" style="float:right">&times;</span>
  <div class="progress-text" >
                          
  <input type="text" placeholder="Skill" id="text-${id}">
                        </div>

                        <div class="slidecontainer-progress">
                        <input type="range" min="1" max="100" value="50" class="slider-progress" id="myRange">
                        <p>Value: <span id="demo"></span></p>
                      </div>
<br/>
<i class="far fa-save" id="save-${id}"></i>
</div>

  `;

  skill.insertAdjacentHTML('afterbegin', html)
}

const itemAdded = (id, data) => {



  var skill = document.getElementById(id);
  var html = `
  <div class="item" data-id="${data.id}">
  <div class="progress-text">
  <div class="row">
    <div class="col-7">${data.name} </div>
    <div class="col-5 text-right">${data.value}%</div>
  </div>
</div>
<div class="custom-progress progress">
  <div role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"
    style="width:${data.value}%" class="animated custom-bar progress-bar slideInLeft ${data.color}"></div>
</div>`
  if (!id_res) {
    html += `
<i class="fas fa-trash-alt" id="delete-${id}" data-id="${data.id}"></i>
`
  }
  `
</div>
  `

  skill.insertAdjacentHTML('afterbegin', html)


}



const renderProfile = (classes, data) => {

  // document.querySelector("#member-plan").childNodes[1].innerHTML=data

  document.querySelector('.' + classes).insertAdjacentHTML('afterend', data)
  // document.querySelector('joined').insertAdjacentHTML('afterend', data)
}


const renderUsers = (id, data, authorized, table) => {


  // var html = `
  //       <tr>
  //           <td>${data.firstName} ${data.lastName}</td>
  //           <td>${data.city}</td>
  //           <td class="center">${data.province}</td>`;

  // if (data.studyField != "0") {
  //   html += `
  //       <td>${data.studyField}</td>
  //           <td>${data.school}</td>
  //       `;
  // } else {
  //   html += `
  //       <td>${data.workField}</td>
  //       <td></td>
  //       `;
  // }
  // if (authorized) {
  //   html += `   <td class="tooltips" id="request-user" data-id=${id}>
  //           <a href='/pages/user_profile.html?id=${id}'><i id="request-user" data-id=${id} class="fa fa-user"></i></a>
  //           <span class="tooltiptext">Request Contacts</span>
  //           </td>`
  // } else {

  //   html += `   <td class="tooltips" id="request-contact" data-id=${id}><i id="request-contact" data-id=${id} class="far fa-paper-plane"></i>
  //   <span class="tooltiptext">Request Contacts</span>
  //   </td>`
  // }


  // html += `
  //       </tr >
  //   `;


  var html = `<div class="at-column">
  <div class="at-user">`
  if (authorized) {
    if (data.url) {
      html += `
    <a href="/pages/user_profile.html?id=${id}"><div class="at-user__avatar"><img src="${data.url}"/></div></a>
`
    } else {
      var src = '';
      if (data.sexe == 'male') {
        src = "https://cdn.pixabay.com/photo/2017/12/18/03/01/black-avatar-3025348_960_720.png"
      } else {
        src = "https://cdn3.iconfinder.com/data/icons/diversity-avatars/64/disco-woman-black-512.png"
      }
      html += `
    <a href="/pages/user_profile.html?id=${id}"><div class="at-user__avatar"><img src="${src}"/></div></a>
    `
    }
    html += `
    <a href="/pages/user_profile.html?id=${id}"><div class="at-user__name">${data.firstName} ${data.lastName}</div></a>
`
  } else {

    html += `
    <div class="at-user__avatar"><img src="https://www.flaticon.com/svg/static/icons/svg/891/891399.svg"/></div>
    <div class="at-user__name">${data.firstName} ${data.lastName}</div>
`
  }


  if (data.studyField != "0") {
    html += `
    <div class="at-user__title">${data.studyField}, ${data.school}</div>
        `;
  } else {
    html += `
    <div class="at-user__title">${data.workField}</div>
        `;
  }
  html += `

  <div class="at-user__title">`

  var i = 0;
  for (const skil in data.skill) {
    if (i <= 3) {
      html += `${data.skill[skil].name}| `
    }
    ++i;

  }

  html += `
  </div>
  <ul class="at-social">
  `


  if (authorized) {

    html += `
    <li class="at-social__item">
    <div class="tooltips" id="request-user" data-id=${id}>
              <a href='/pages/user_profile.html?id=${id}'><i id="request-user" data-id=${id} class="fa fa-user"></i></a>
              <span class="tooltiptext">Go to profile</span>
              </div>
      </li>
    `
  } else {

    html += `
    <li class="at-social__item">
      <div class="tooltips" id="request-contact" data-id=${id}><i id="request-contact" data-id=${id} class="far fa-paper-plane"></i>
    <span class="tooltiptext">Request Contacts</span>
    </div>
      </li>
    `
  }


  html += `
    
    </ul>

    <div class="at-user__title">${data.city}, ${data.province}</div>

  </div>
</div>`
  table.innerHTML += html;

}


const renderContactRequestSent = (id, data) => {
  var table = document.getElementById('items-sent');

  var html = `
        <tr>
            <td>${data.receiver_first_name} ${data.receiver_last_name}</td>
            <td>${data.receiver_city}</td>
            <td class="center">${data.receiver_province}</td>`;

  if (data.receiver_studyField) {
    html += `
        <td>${data.receiver_studyField}</td>
        `;
  } else {
    html += `
        <td>${data.receiver_workField}</td>
        `;
  }

  html += `   
  <td>${data.sender_status}</td>
  `
  if (data.sender_status == "Accepted") {
    html += `   
  <td></td>
  `
  }
  else {
    html += `   
    
  <td class="tooltips" id="request-reminder" data-id=${data.receiver_uid}><i id="request-reminder" data-id=${data.receiver_uid} class="far fa-paper-plane"></i>
            <span class="tooltiptext">Request Contacts</span>
            </td>
        </tr >
    `;
  }
  table.innerHTML += html;
}
const renderContactRequestReceived = (id, data, table) => {

  var html = `
        <tr id=${data.sender_uid}>
            <td>${data.sender_first_name} ${data.sender_last_name}</td>
            <td>${data.sender_city}</td>
            <td class="center">${data.sender_province}</td>`;

  if (data.sender_studyField) {
    html += `
        <td>${data.sender_studyField}</td>
        `;
  } else {
    html += `
        <td>${data.sender_workField}</td>
        `;
  }


  html += `
    <td>${data.receiver_status}</td>

    <td class="tooltips"><label class="switch" >
    `
  if (data.acceptedFlag && data.acceptedFlag == 'Y') {

    html += `
    <input name="request-accept" id=${id} data-id=${data.sender_uid} type="checkbox" checked>
  `}

  else {
    html += `
    <input name="request-accept" id=${id} data-id=${data.sender_uid} type="checkbox">
`
  }
  html += `
  <span name="request-accept" id=${id} data-id=${data.sender_uid} class="slider round"></span>
  </label>
            <span class="tooltiptext">Request Contacts</span>
            </td>
        </tr >
    `;
  table.innerHTML += html;
}

const renderMessages = (id, name, data) => {
  const html = `<li class="list-group-item" data-id=${id}>
    <p class="pull-left" id="subject" data-id=${id}>${data.subject}...<i id="subject" data-id=${id} class="fas fa-chevron-circle-down" ></i></p><br/> <br/> 
    <div class="message-show " id=${id}>${data.message}</div>
     <p class="text-right">${data.date.toDate().toDateString()}<i class="fas fa-trash-alt" data-name=${name} id="trash" data-id=${id}></i></p></li>`;

  document.querySelector('.messages-items').insertAdjacentHTML('beforeend', html);
}

const renderFullMessage = (id) => {

  var style = document.getElementById(id).style;
  if (style.display == "" || style.display == "none") {
    style.display = "block"
  } else {
    style.display = "none"
  }
}

const renderScheduler = (id, data) => {
  var startTime = data.start.toDate();
  var endTime = data.end.toDate();
  var rand = "event-" + Math.round(Math.random() * 4);
  const html = `
    <li class="single-event" data-start="${startTime.getHours()}:${startTime.getMinutes()}" data-end="${endTime.getHours()}:${endTime.getMinutes()}"
                                                data-content="event-abs-circuit" data-event="${rand}">
                                                <a href="#0">
                                                    <em class="event-name">${data.title}</em>
                                                    <br/>
                                                    
                                                    <h4><i class="fa fa-map-marker"></i>${data.location}</h4>
                                                </a>
                                            </li>
    `
  var day = data.start.toDate().toDateString().toLowerCase().slice(0, 3);
  document.getElementById(day + 'Group').insertAdjacentHTML('afterbegin', html);
}

const renderProfilePic = (url) => {
  document.getElementById("target").style.display = "block";
  document.getElementById("target").src = url;
}
const deleteMessage = (id) => {
  var msg = document.querySelector(`.list-group-item[data-id="${id}"]`);
  msg.remove();
}



function showImage(src, target) {
  var fr = new FileReader();
  // when image is loaded, set the src of the image where you want to display it
  fr.onload = function (e) { target.src = this.result; };
  src.addEventListener("change", function () {
    // fill fr with image data    
    fr.readAsDataURL(src.files[0]);
  });
}