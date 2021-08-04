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


const body = document.querySelector('body');
body.addEventListener('click', evt => {
    console.log(evt)
})
const acaUsers = db.collection('users-ACA');
const ACAservices = db.collection('ACA-services');
const ACAservices_hist = db.collection('ACA-services_hist');
const acaUsers_hist = db.collection('users-ACA_hist');
const uid = sessionStorage.getItem('uid');



acaUsers.doc(uid).get().then(res => {
    console.log(res.data())
    renderText('full-name', res.data().firstName + ' ' + res.data().lastName)
    if(res.data().url){
      document.getElementById('profilePic').src=res.data().url;
    }
})


ACAservices.get().then(results => {
    results.forEach(result => {

        const timeline = result.data().timeline;
        const data = result.data();
        var count = 0;
        for (const item in timeline) {
            var time = timeline[item];
            for (const news in time) {
                if (time[news].uid == uid) {
                    console.log('good')
                    renderTimeLine(time[news].id, time[news])
                }
            }
        }

        data.messages.forEach(elt => {
            if (elt.read == "false") {
                const error = {
                    name: elt.firstName + " " + elt.lastName,
                    msg: elt.message.slice(0, 100),
                    date: elt.date.toDate().toDateString()
                }
                renderMessage('messages-count', error);
                ++count
            }
        })

        renderText('messages-count', count)
        //Check when the server is down and report
    })
})



