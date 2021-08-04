
var logOut = document.getElementById("log-out");
var admin = document.getElementById("admin");

auth.onAuthStateChanged(user => {
    if (user) {
        sessionStorage.setItem('uid', user.uid)

        db.collection('users-ACA').doc(`${user.uid}/confidentials/infos`).get().then(result => {
            var data = result.data();
            logOut.style.display = "inline-block";
            //             intro.innerHTML = `<h2>Welcome ${data.firstName}</h2>`;
            //             subheader.innerHTML = `${data.firstName} ${data.lastName}`
            if (data.privilege == 'admin') {
                admin.style.display = "inline-block";
            }
            if (data.social) {
                var social = document.getElementById("social-media");
                social.style.display = "block"
                for (const media in data.social) {
                    var social_media = document.getElementById(media);
                    social_media.style.display ="block"
                }
            }
        })
    }
    else {
        logOut.style.display = "none";
        window.location.href="/index.html";
        // intro.innerHTML = `<h2>Register / Login to connect with cameroonians in your region</h2>`;
    }
});


logOut.addEventListener('click', evt => {
    evt.preventDefault();
    auth.signOut().then(() => {
        sessionStorage.clear();
        window.location.href="/index.html";
    })
})

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
  
  