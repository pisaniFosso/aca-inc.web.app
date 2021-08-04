
var logOut = document.getElementById("log-out");

auth.onAuthStateChanged(user => {
  console.log(user)
  if (user) {
    sessionStorage.setItem('uid', user.uid)
    db.collection('users-ACA').doc(user.uid).get().then(result => {
      var data = result.data();
      logOut.style.display = "block";
      if (data.privilege == 'admin') {
        sessionStorage.setItem('admin', true);
        }
        })
  }
  else {
    logOut.style.display = "none";
  }
});


logOut.addEventListener('click', evt => {
  evt.preventDefault();
  auth.signOut().then(() => {
    sessionStorage.clear();
    location.reload();
  })
})