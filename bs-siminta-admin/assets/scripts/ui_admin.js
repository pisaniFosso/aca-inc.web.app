

const renderText = (id, data) => {
  document.getElementById(id).innerHTML = data;
}

const renderMessage = (id, data) => {
  const html = `<li>
    <a href="#">
        <div>
            <strong><span class=" label label-danger">${data.name}</span></strong>
            <span class="pull-right text-muted">
                <em>${data.date}</em>
            </span>
        </div>
        <div>${data.msg}...
        </div>
    </a>
</li>`;

  document.querySelector('.dropdown-messages').insertAdjacentHTML('afterbegin', html);
}

const renderPassportExpireringSoon = (id, data) => {
  const html = `
    <tr>
        <td id="${id}" class='tooltips'>
        <span class="tooltiptext">${id}</span>
        ${id.slice(0, 5)}...</td>
        <td>${data.firstName} ${data.lastName}</td>
        <td>${data.status}</td>
        <td style="color:red;"> ${data.sensitive.passportToDate.toDate().toISOString().substr(0, 10)}</td>
        <td>${data.sensitive.email}</td>
        <td style="text-align:center; width:10px" ><i  id="reminder-send" class="fas fa-paper-plane" data-id=${id} aria-hidden="true"></i></td>
    </tr>
    `;
  document.querySelector('.passport-expirering').insertAdjacentHTML('beforeend', html);
}
const renderPermitExpireringSoon = (id, data) => {
  const html = `
    <tr>
        <td id="${id}" class='tooltips'>
        <span class="tooltiptext">${id}</span>
        ${id.slice(0, 5)}...</td>
        <td>${data.firstName} ${data.lastName}</td>
        <td>${data.status}</td>
        <td style="color:red;">${data.sensitive.statusToDate.toDate().toISOString().substr(0, 10)}</td>
        <td>${data.sensitive.email}</td>
        <td style="text-align:center; width:10px" ><i  id="reminder-visa" data-status="${data.status}" class="fas fa-paper-plane" data-id=${id} aria-hidden="true"></i></td>
    </tr>
    `;
  document.querySelector('.permit-expirering').insertAdjacentHTML('beforeend', html);
}

const renderUsers = (id, data) => {

  var table = document.getElementById('all-users');

  var html = `
        <tr class="odd gradeX">
        <td id="${id}" class='tooltips'>
        <span class="tooltiptext">${id}</span>
        ${id.slice(0, 15)}...</td>
            <td>${data.firstName} ${data.lastName}</td>
            <td>${data.city}</td>
            <td class="center">${data.province}</td>
            <td class="center">${data.status}</td>
            <td class="center">
            <label class="switch">`
  if (data.privilege == 'premium') {

    html += `
                          <input type="checkbox" name="premium-btn" id=${id} checked>
                          `;
  } else {
    html += `
                          <input type="checkbox" name="premium-btn" id=${id}>
                          `;
  }

  html += `
  <span class="slider round"></span>
</label>
</td>
<td class="center">
  <label class="switch">`
  if (data.privilege == 'admin') {

    html += `
                <input type="checkbox" name="admin-btn" id=${id} checked>
                `;
  } else {
    html += `
                <input type="checkbox" name="admin-btn" id=${id}>
                `;
  }


  html += `
                <span class="slider round"></span>
            </label>
            </td>
        </tr>
        `;
  table.innerHTML += html;
}
const renderTable = (tableID, id, data) => {

  var table = document.getElementById(tableID);

  const html = `
        <tr class="odd gradeX">
        <td id="${id}" class='tooltips'>
        <span class="tooltiptext">${id}</span>
        ${id.slice(0, 5)}...</td>
            <td>${data.firstName} ${data.lastName}</td>
            <td>${data.city}</td>
            <td class="center">${data.sensitive.email}</td>
        </tr>
        `;
  table.innerHTML += html;
}
const renderEvents = (count) => {
  console.log(count)

  document.querySelector('.countEvents').innerHTML = count;


}



const renderTimeLine = (id, data) => {

  var container = document.querySelector('.cd-container');
  const html = `
    <div class="cd-timeline-block">
                    <div class="cd-timeline-img cd-picture">
                        <i class="${data.icon}"></i>
                    </div> <!-- cd-timeline-img -->

                    <div class="cd-timeline-content">
                        <h2>Passport Reminder</h2>
                        <small>${data.to}</small>
                        <p>${data.message}</p>
                        <span class="cd-date">${String(data.date.toDate()).slice(0, 24)}</span>
                    </div> <!-- cd-timeline-content -->
                </div> <!-- cd-timeline-block -->
    `;

  container.insertAdjacentHTML('afterbegin', html)
}


const renderMessages = (id, data) => {
  var html = `
  <tr class="selected message" id="myTr" data-id=${id}>
                        <td>
                          <div class="ckbox ckbox-theme">
                            <input data-id=${id} name="inbox" id=${id} type="checkbox" class="mail-checkbox">
                            <label for="checkbox1"></label>
                          </div>
                        </td>`
  if (data.read == "false") {
    html += `<td>
                          <a href="#" class="star star-checked" data-id=${id}><i class="fa fa-star"></i></a>
                        </td>`
  } else {
    html += `<td>
                          <a href="#" class="star"><i class="fa fa-star"></i></a>
                        </td>`
  }
  html +=
    `
                        <td id="myTd">
                          <div class="media">
                            <a href="#" class="pull-left">
                              <img alt="..." src="https://cdn.pixabay.com/photo/2017/12/18/03/01/black-avatar-3025348_960_720.png"
                                class="media-object">
                            </a>
                            <div class="media-body">
                              <h4 class="text-primary" id="first-name"> ${data.firstName} ${data.lastName}</h4>
                              <p class="email-summary"><strong id="subject">${data.subject}</strong> <i id="subject" data-id=${id} class="fas fa-chevron-circle-down" ></i>`
  if ((new Date().getDate() - data.date.toDate().getDate() < 3) && new Date().getMonth() == data.date.toDate().getMonth() && new Date().getFullYear() == data.date.toDate().getFullYear())
    html += ` <span class="label label-success">New</span>`

  html += `
                              </p>
                              <div class="message-show" id=${id}>${data.message}</div>

                              <span class="media-meta">${data.date.toDate().toDateString()} at ${String(data.date.toDate().getHours()).padStart(2, '0')}:${String(data.date.toDate().getMinutes()).padStart(2, '0')}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
  `;

  document.getElementById('all-inbox').insertAdjacentHTML('afterbegin', html);
}

const renderMessagesSend = (id, data) => {
  var html = `
  <tr class="selected message" id="myTr" data-id=${id}>
                        <td>
                          <div class="ckbox ckbox-theme">
                            <input data-id=${id} name="send" id=${id} type="checkbox" class="mail-checkbox">
                            <label for="checkbox1"></label>
                          </div>
                        </td><td></td>
                        <td id="myTd">
                          <div class="media">
                            <a href="#" class="pull-left">
                              <img alt="..." src="https://cdn.pixabay.com/photo/2017/12/18/03/01/black-avatar-3025348_960_720.png"
                                class="media-object">
                            </a>
                            <div class="media-body">
                              <h4 class="text-primary" id="first-name"> ACA System</h4>
                              <p class="email-summary"><strong id="subject">${data.subject}</strong> <i id="subject" data-id=${id} class="fas fa-chevron-circle-down" ></i>`
  if ((new Date().getDate() - data.date.toDate().getDate() < 3) && new Date().getMonth() == data.date.toDate().getMonth() && new Date().getFullYear() == data.date.toDate().getFullYear())
    html += ` <span class="label label-success">New</span>`

  html += `
                              </p>
                              <div class="message-show" id=${id}>${data.message}</div>

                              <span class="media-meta">${data.date.toDate().toDateString()} at ${String(data.date.toDate().getHours()).padStart(2, '0')}:${String(data.date.toDate().getMinutes()).padStart(2, '0')}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
  `;

  document.getElementById('all-send').insertAdjacentHTML('afterbegin', html);
}

const renderMessagesTrash = (id, data, what) => {
  var html = `
  <tr class="selected trash" id="myTr" >
                        <td>
                        <div class="ckbox ckbox-theme">
                        <input data-id=${id} name="trash-${what}" id=${id} type="checkbox" class="mail-checkbox">
                        <label for="checkbox1"></label>
                      </div>
                        </td><td></td>
                        <td id="myTd">
                          <div class="media">
                            <a href="#" class="pull-left">
                              <img alt="..." src="https://cdn.pixabay.com/photo/2017/12/18/03/01/black-avatar-3025348_960_720.png"
                                class="media-object">
                            </a>
                            <div class="media-body">
                              <h4 class="text-primary" id="first-name"> ${data.fullName}</h4>
                              <p class="email-summary"><strong id="subject">${data.subject}</strong> <i id="subject" data-id=${id} class="fas fa-chevron-circle-down" ></i>`
  if ((new Date().getDate() - data.date.toDate().getDate() < 3) && new Date().getMonth() == data.date.toDate().getMonth() && new Date().getFullYear() == data.date.toDate().getFullYear())
    html += ` <span class="label label-success">New</span>`

  html += `
                              </p>
                              <div class="message-show" id=${id}>${data.message}</div>

                              <span class="media-meta">${data.date.toDate().toDateString()} at ${String(data.date.toDate().getHours()).padStart(2, '0')}:${String(data.date.toDate().getMinutes()).padStart(2, '0')}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
  `;

  document.getElementById('all-trash-' + what).insertAdjacentHTML('afterbegin', html);
}
const removeMessage = (id) => {
  var msg = document.querySelector(`.message[data-id="${id}"]`)

  msg.remove();
  return msg;
}

const addTrash = (id, data) => {
  var table = document.getElementById("all-trash-" + id)
  if (id == "inbox")
    data.querySelector('.star').remove()
  table.insertAdjacentElement('afterbegin', data);
}
const renderFullMessage = (id) => {

  var style = document.querySelector(`.message-show[id="${id}"`).style
  if (style.display == "" || style.display == "none") {
    style.display = "block"
  } else {
    style.display = "none"
  }
}