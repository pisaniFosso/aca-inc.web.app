
var registerLogin = document.getElementById("subscribe");
var subscribeLink = document.getElementById("subscribe-link");
var logOut = document.getElementById("log-out");
var profile = document.getElementById("profile");

auth.onAuthStateChanged(user => {
    if (user) {
        sessionStorage.setItem('uid', user.uid)

        db.collection('users-ACA').doc(`${user.uid}/confidentials/infos`).get().then(result => {
            var data = result.data();
            registerLogin.style.display = "none";
            subscribeLink.style.display = "none";
            logOut.style.display = "block";
            profile.style.display = "block";
            //             intro.innerHTML = `<h2>Welcome ${data.firstName}</h2>`;
            //             subheader.innerHTML = `${data.firstName} ${data.lastName}`
            if (data.privilege == 'admin') {
                var admin = document.getElementById('admin');
                var edit = document.querySelectorAll('.edit');
                var trash = document.querySelectorAll('.fa-trash-o');
                admin.style.display = "block";
                edit.forEach(elt=>elt.style.display = "block");
                trash.forEach(elt=>elt.style.display = "block");
                sessionStorage.setItem('admin', true);

            }
        })
    }
    else {
        logOut.style.display = "none";
        registerLogin.style.display = "block";
        subscribeLink.style.display = "block";
        // intro.innerHTML = `<h2>Register / Login to connect with cameroonians in your region</h2>`;
    }
});


logOut.addEventListener('click', evt => {
    evt.preventDefault();
    auth.signOut().then(() => {
        sessionStorage.clear();
        location.reload();
    })
})