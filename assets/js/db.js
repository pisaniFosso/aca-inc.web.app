
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

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.tooltipped');
  var instances = M.Tooltip.init(elems, "");
});

// Or with jQuery

// $(document).ready(function(){
//   $('.tooltipped').tooltip();
// });


const acaService = db.collection('ACA-services');
const acaService_hist = db.collection('ACA-services_hist');
const increment = firebase.firestore.FieldValue.increment(1);


acaService.get().then(results => {
  results.forEach(async (res) => {
    var data = res.data();
    renderAllBackground(data.background)
    renderAllAdmin(data.admin)
    for (const link in data.links) {
      renderVideos(data.links[link]);
    }
    for (const pic in data.pictures) {

      renderPictures(pic, data.pictures[pic])
    }
    for (const serv in data.services) {

      renderService(serv, data.services[serv])
    }
  })
})


const setServiceID = async () => {
  var id = await acaService.get().then(res => {
    var resID;
    res.forEach(elt => {
      resID = elt.id;
    })
    return resID;
  })
  return id;

}

var body = document.querySelector('body');
var serviceID;

setTimeout(async () => {

  serviceID = await setServiceID();
}, 2000);

body.addEventListener('click', async function (evt) {

  if (evt.target.id.includes("item-") && evt.target.id != "item-option") {
    // evt.preventDefault();
    var all_item = document.querySelectorAll('.tab-pane')
    all_item.forEach(item => {
      if (item.id == evt.target.id.replace("item-", "")) {
        item.style.display = "block"
      } else {
        item.style.display = "none"
      }
      // console.log(item.style)
    })
  }

  if (evt.target.tagName == "I" && evt.target.id.includes("edit-")) {

    var file = document.getElementById('browse-image');
    file.onchange = async () => {

      //edit element
      var element = evt.target.id.replace('edit-', 'page-')
      var selectedFile = file.files[0];
      var pathFirebase = '/ACA/backgound/' + element + '/' + selectedFile.name
      var pathFirestore = "background." + element;
      var url = await submitImage(pathFirebase, pathFirestore, selectedFile)
      renderOneBackground(element, url)

    }
  }
  if (evt.target.tagName == "I" && evt.target.id == "admin_picture_select") {

    var src = document.getElementById('admin_picture')
    var target = document.getElementById('target')
    showImage(src, target)
  }

  if (evt.target.id == "submit_add_admin") {

    var name = document.getElementById("admin_name").value.trim();
    var position = document.getElementById("admin_position").value.trim();
    var facebook = document.getElementById("admin_facebook").value.trim();
    var twitter = document.getElementById("admin_twitter").value.trim();
    var linkedin = document.getElementById("admin_linkedin").value.trim();
    var github = document.getElementById("admin_github").value.trim();
    var picture = document.getElementById("admin_picture").files[0];

    var member = {};
    if (facebook !== "") Object.assign(member, { social: { facebook: facebook } });
    if (twitter !== "") Object.assign(member, { social: { twitter: twitter } });
    if (linkedin !== "") Object.assign(member, { social: { linkedin: linkedin } });
    if (github !== "") Object.assign(member, { social: { github: github } });

    member['name'] = name;
    member['position'] = position
    if (member.name !== "" && member.position !== "" && picture.name !== "") {

      //edit element
      var selectedFile = picture;
      var id = generateID()
      var pathFirebase = '/ACA/admin/' + selectedFile.name
      var pathFirestore = "admin." + id;
      var url = await submitImage(pathFirebase, pathFirestore, selectedFile)
      acaService.get().then(results => {
        results.forEach(res => {
          acaService.doc(res.id).update({ [`admin.${id}.infos`]: member }).then(() => {
            acaService_hist.doc(res.id).update({ [`admin.${id}.infos`]: member }).then(rd => {
            })
          })
        })
      })

      renderAdmin(id, url, member);
    } else {
      M.toast({ html: `fill in the required informations`, classes: 'rounded red' })

    }
  }

  if (evt.target.tagName == "I" && evt.target.dataset.type == "trash") {
    var id = evt.target.id
    acaService.get().then(results => {
      results.forEach(res => {
        acaService.doc(res.id).get().then(result => {
          var admin = result.data().admin
          delete admin[id];
          acaService.doc(res.id).update({ admin: admin }).then(() => {
            acaService_hist.doc(res.id).update({ admin: admin }).then(() => {
              removeAdmin(id);
            })
          })
        })
      })
    })
  }

  if (evt.target.tagName == "I" && evt.target.id == "add-video") {
    document.getElementById("video").style.display = "block";
    document.getElementById("image").style.display = "none";
    document.getElementById("service").style.display = "none";

  }
  if (evt.target.tagName == "I" && evt.target.id == "add-photo") {
    document.getElementById("service").style.display = "none";
    document.getElementById("video").style.display = "none";
    document.getElementById("image").style.display = "block";

  }
  if (evt.target.tagName == "I" && evt.target.id == "add-service") {
    document.getElementById("service").style.display = "block";
    document.getElementById("video").style.display = "none";
    document.getElementById("image").style.display = "none";
  }
  if (evt.target.tagName == "I" && evt.target.id == "target_image_picture_select") {

    var src = document.getElementById('target_image_picture')
    var target = document.getElementById('target_image')
    showImage(src, target)
  }
  if (evt.target.tagName == "I" && evt.target.id == "logo_select") {

    var src = document.getElementById('target_logo_picture')
    var target = document.getElementById('target_logo')
    showImage(src, target)
  }
  if (evt.target.tagName == "I" && evt.target.id == "thumbnail_select") {
    var src = document.getElementById('target_thumbnail_picture')
    var target = document.getElementById('target_thumbnail')
    showImage(src, target)
  }

  if (evt.target.tagName == "INPUT" && evt.target.id == "submit_add_service") {
    var picture = document.getElementById("target_logo_picture").files[0];
    var name = document.getElementById("serviceName").value.trim();
    var link = document.getElementById("serviceLink").value.trim();
    var serviceFacebookLink = document.getElementById("serviceFacebookLink").value.trim();
    var serviceInstagramLink = document.getElementById("serviceInstagramLink").value.trim();
    var serviceSnapchatLink = document.getElementById("serviceSnapchatLink").value.trim();
    var address = document.getElementById("serviceAddress").value.trim();
    var wordDoc = document.getElementById("wordFile").files[0];
    var id = generateID()
    var infos = {
      name: name,
      link: link,
      facebook: serviceFacebookLink,
      instagram: serviceInstagramLink,
      snapchat: serviceSnapchatLink,
      address: address
    };

    var selectedFile = picture;
    var pathFirebase = '/ACA/services/' + selectedFile.name
    var pathFirestore = "services." + id;
    var url = await submitImage(pathFirebase, pathFirestore, selectedFile)

    if (wordDoc) {


      var storageRef = storage.ref('/ACA/services/docs/' + wordDoc.name);
      var uploadTask = storageRef.put(wordDoc);
      await uploadTask.on('state_changed', function (snapshot) {
      }
        , function (error) {
          // Handle unsuccessful uploads
          console.log(error)
        }, async function () {
          await submitImage(pathFirebase, pathFirestore, selectedFile)

          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            infos['urlDoc'] = downloadURL;
            acaService.get().then(results => {
              results.forEach(res => {
                acaService.doc(res.id).update({ [`services.${id}.infos`]: infos }).then(() => {
                  acaService_hist.doc(res.id).update({ [`services.${id}.infos`]: infos }).then(rd => {
                  })
                })
              })
            })
          })
        })
    } else {
      acaService.get().then(results => {
        results.forEach(res => {
          acaService.doc(res.id).update({ [`services.${id}.infos`]: infos }).then(() => {
            acaService_hist.doc(res.id).update({ [`services.${id}.infos`]: infos }).then(rd => {
            })
          })
        })
      })
    }

    // if(infos)


    // await acaService.doc(serviceID).update({ [`services.${id}.infos`]: infos }).then(() => {
    //   acaService_hist.doc(serviceID).update({ [`services.${id}.infos`]: infos }).then(() => {
    //     // renderPictures(id, pic)
    //     // renderService(id, )
    //   })
    // })
    console.log(await acaService.doc(serviceID).get().then(res => { return res.data().services[id] }))
  }

  if (evt.target.tagName == "INPUT" && evt.target.id.includes("cancel")) {
    document.getElementById("video").style.display = "none";
    document.getElementById("image").style.display = "none";
    document.getElementById("service").style.display = "none";
  }

  if (evt.target.tagName == "INPUT" && evt.target.id == "submit_add_picture") {
    var picture = document.getElementById("target_image_picture").files[0];

    var selectedFile = picture;
    var id = generateID()
    var pathFirebase = '/ACA/pictures/' + selectedFile.name
    var pathFirestore = "pictures." + id;
    var url = await submitImage(pathFirebase, pathFirestore, selectedFile)
    var pic = {
      id: id,
      imageURL: url
    }
    acaService.doc(serviceID).update({ [`pictures.${id}`]: pic }).then(() => {
      acaService_hist.doc(serviceID).update({ [`pictures.${id}`]: pic }).then(rd => {
        renderPictures(id, pic)
      })
    })
  }
  if (evt.target.tagName == "INPUT" && evt.target.id == "submit_video_link") {
    var picture = document.getElementById("target_thumbnail_picture").files[0];
    var link = {
      id: generateID(),
      url: document.getElementById("videoLink").value.trim().replace("watch?v=", "embed/")
    }
    var selectedFile = picture;
    var id = generateID()
    var pathFirebase = '/ACA/thumbnail/' + selectedFile.name
    var pathFirestore = "links." + link.id;
    var url = await submitImage(pathFirebase, pathFirestore, selectedFile)

    link["thumbnailURL"] = url;
    acaService.doc(serviceID).update({ [`links.${link.id}`]: link }).then(() => {
      acaService_hist.doc(serviceID).update({ [`links.${link.id}`]: link }).then(() => {
        document.getElementById("videoLink").innerHTML = ""
        renderVideos(link);
      })
    })
  }


  if (evt.target.id == "play") {
    var video_wrapper = $(`.youtube-video-place[data-id='${evt.target.dataset.id}']`);

    video_wrapper.html('<iframe allowfullscreen frameborder="0" class="embed-responsive-item" src="' + video_wrapper.data('yt-url') + '"></iframe>');
  }

})



const submitImage = async (pathFirebase, pathFirestore, file) => {
  //submit the form here
  var storageRef = storage.ref(pathFirebase);
  var uploadTask = storageRef.put(file);
  var elem = document.getElementById("myBar");

  var up = await uploadTask.on('state_changed', function (snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    elem.style.display = "block";
    elem.style.width = progress + "%";
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function (error) {
    // Handle unsuccessful uploads
    console.log(error)
  }, async function () {
    elem.style.display = "none";

    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    return (await uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      var uid = sessionStorage.getItem('uid')
      var background = { "imageURL": downloadURL, "modifyby": uid, "modifyDate": new Date };
      acaService.get().then(results => {
        results.forEach(res => {
          acaService.doc(res.id).update({ [`${pathFirestore}`]: background }).then(() => {
            acaService_hist.doc(res.id).get().then(res => {

              var end = {};
              for (const i of pathFirestore.split('.')) {
                end = end[i] ? end[i] : res.data()[i];
              }
              if (Array.isArray(end)) {
                var pageBackGround = end || [];
                pageBackGround.push(background);
                acaService_hist.doc(res.id).update({ [`${pathFirestore}`]: pageBackGround }).then(() => {
                  return (downloadURL)
                })
              } else {
                acaService_hist.doc(res.id).update({ [`${pathFirestore}`]: background }).then(() => {
                  return (downloadURL)
                })
              }

            })
          })
        })

      })

    }))

  })
  await uploadTask.then(res => console.log(res))
  return (await uploadTask.then(snapshot => { return snapshot.ref.getDownloadURL() }))
}


window.addEventListener('appinstalled', (evt) => {
  // Log install to analytics
  console.log('INSTALL: Success');
  acaService.get().then(results => {
    results.forEach(res => {
      acaService.doc(res.id).update({ downloads: increment })
    });
  });
});

