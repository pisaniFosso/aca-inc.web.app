
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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');


const acaUsers = db.collection('users-ACA')
const acaUsers_hist = db.collection('users-ACA_hist')
const acaServices = db.collection('ACA-services')
const acaServices_hist = db.collection('ACA-services_hist')
const uid = sessionStorage.getItem('uid');
console.log(id);

window.onload = async () => {


  await acaUsers.doc(`${id}/confidentials/infos`).get().then(usr => {
    var data = usr.data()
    if (data.url) renderProfilePic(data.url)
    else if (data.sexe == "male") renderProfilePic("https://cdn.pixabay.com/photo/2017/12/18/03/01/black-avatar-3025348_960_720.png")
    else if (data.sexe == "female") renderProfilePic("https://cdn3.iconfinder.com/data/icons/diversity-avatars/64/disco-woman-black-512.png")

    renderText('fullName', `${data.firstName} ${data.lastName}`)
    renderText('address', `${data.city}, ${data.province}`)
    if (data.status == "Study Permit") {
      renderText('workField', `Study field: ${data.studyField}`)
      renderText('workField', `School: ${data.school}`)

    } else {

      renderText('workField', `Work field: ${data.workField}`)
      renderText('employer', `Employer: ${data.employer}`)
    }
    renderText('emaildisplay', `${data.sensitive.email}`)
    if (data.show_phone) {
      document.getElementById('phone_number').style.display = "block"
      renderText('phonedisplay', `${data.sensitive.phone}`)
    }
    if (data.bio) {
      document.getElementById('bio').style.display = "block"
      renderText('bioText', `${data.bio}`)
    }
    if (data.website && data.website != "") {
      document.getElementById('website').style.display = "block"
      document.getElementById('websiteLink').setAttribute('href', data.website)

    }
    if (data.instagramLink && data.instagramLink != "") {
      document.getElementById('instagramLink').setAttribute('href', data.instagramLink)
      document.getElementById('instagram').style.display = "block"
    }
    if (data.facebookLink && data.facebookLink != "") {
      document.getElementById('facebookLink').setAttribute('href', data.facebookLink)
      document.getElementById('facebook').style.display = "block"
    }
    if (data.otherMedia && data.otherMedia != "") {
      document.getElementById('otherMediaLink').setAttribute('href', data.otherMediaLink)
      document.getElementById('otherMedia').style.display = "block"
    }


    if (data.degree) {
      document.getElementById("degreeDisplay").style.display = 'block';
      for (const degree in data.degree) {
        addItem('degree', data.degree[degree])
      }
    }
    if (data.experience) {
      document.getElementById("experienceDisplay").style.display = 'block';
      for (const experience in data.experience) {
        addItem('experience', data.experience[experience])
      }
    }
    if (data.skill) {
      document.getElementById("skillDisplay").style.display = 'block';
      for (const skill in data.skill) {
        itemAdded('skill', data.skill[skill])
      }
    }
    // }).catch(err => console.log(err))
  }).catch(err => window.location.assign('/pages/profile.html'))

}