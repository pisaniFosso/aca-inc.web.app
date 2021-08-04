
document.addEventListener('DOMContentLoaded', function () {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, { edge: 'right' });
});
document.addEventListener('DOMContentLoaded', function () {
  var elemsFrom = document.querySelectorAll('.datepickerFrom');
  var instancesFrom = M.Datepicker.init(elemsFrom, { autoClose: true });
  var elemsTo = document.querySelectorAll('.datepickerTo');
  var instancesTo = M.Datepicker.init(elemsTo, { autoClose: true });
});

$("#edit-top").click(function () {
  $("#browse-image").trigger('click');
});
$("#target_image_picture_select").click(function () {
  $("#target_image_picture").trigger('click');
});
$("#thumbnail_select").click(function () {
  $("#target_thumbnail_picture").trigger('click');
});
$("#logo_select").click(function () {
  $("#target_logo_picture").trigger('click');
});
$("#edit-about").click(function () {
  $("#browse-image").trigger('click');
});
$("#admin_picture_select").click(function () {
  $("#admin_picture").trigger('click');
});
$("#admin-add").click(() => {
  $(".add_admin").css("display", "block");
})
$("#cancel_add_admin").click(() => {
  $(".add_admin").css("display", "none");
})
// render top home page background
const renderAllBackground = (imageInfo) => {

  for (const image in imageInfo) {
    renderOneBackground(image, imageInfo[image].imageURL)
  }
}

//Custom Functions that you can call
function resetAllValues() {
  $('.clearfix').find('input').val('');
  $('.clearfix').find('textarea').val('');
}
//render one backgroung Image
const renderOneBackground = (id, data) => {
  const background = document.getElementById(id);

  background.style.backgroundImage = `url(${data})`

}

const renderAllAdmin = (data) => {
  for (const id of Object.keys(data)) {
    renderAdmin(id, data[id].imageURL, data[id].infos)
  }
}

// display one admin
const renderAdmin = (id, url, data) => {

  var team = document.getElementById('team');

  var html = `

  <div class="col-sm-4" data-id=${id}>
              <div class="team-member">

                <figure>
                  <img src="${url}" alt="Team Member">
                  <figcaption>
                    <p class="member-name">${data.name}</p>
                    <p class="designation">
                      ${data.position}
                    </p><!-- /.designation -->
                  </figcaption>
                </figure>`
  if (data.social) {
    html += `<div class="social-btn-container">
                  <div class="team-socail-btn">
                    `
    if (data.social.facebook) {
      html += `<span class="social-btn-box facebook-btn-container">
                    <a href="${data.social.facebook}" class="facebook-btn">
                      <i class="fa fa-facebook"></i>
                    </a><!-- /.facebook-btn -->
                  </span><!-- /.social-btn-box -->`
    }
    if (data.social.twitter) {
      html += `<span class="social-btn-box twitter-btn-container">
                    <a href="${data.social.twitter}" class="twitter-btn">
                      <i class="fa fa-twitter"></i>
                    </a><!-- /.twitter-btn -->
                  </span><!-- /.social-btn-box -->`
    }
    if (data.social.linkedin) {
      html += `
                    <span class="social-btn-box linkedin-btn-container">
                      <a href="${data.social.linkedin}" class="linkedin-btn">
                        <i class="fa fa-linkedin"></i>
                      </a><!-- /.linkedin-btn -->
                    </span><!-- /.social-btn-box -->`
    }
    if (data.social.github) {
      html += `<span class="social-btn-box github-btn-container">
                    <a href="${data.social.github}" class="github-btn">
                      <i class="fa fa-github-alt"></i>
                    </a><!-- /.github-btn -->
                  </span><!-- /.social-btn-box -->`
    }
    html += `</div><!-- /.team-socail-btn -->
                            </div><!-- /.social-btn-container -->`


  }

  html += `
  
  </div><!-- /.team-member -->
  <i class="fa fa-trash-o" id=${id} data-type="trash" style="display:none"></i>

  
  </div><!-- /.col-sm-4 -->

  `;


  team.innerHTML += html;


}

const removeAdmin = (id) => {
  var admin = document.querySelector(`.col-sm-4[data-id="${id}"`);

  admin.remove();

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
$('.form').find('input, textarea').on('keyup blur focus', function (e) {

  var $this = $(this),
    label = $this.prev('label');

  if (e.type === 'keyup') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.addClass('active highlight');
    }
  } else if (e.type === 'blur') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.removeClass('highlight');
    }
  } else if (e.type === 'focus') {

    if ($this.val() === '') {
      label.removeClass('highlight');
    }
    else if ($this.val() !== '') {
      label.addClass('highlight');
    }
  }

});

$('.tab a').on('click', function (e) {

  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});

$('#status').on('change', evt => {

  //if student 
  if (evt.target.value == "Study Permit") {
    document.getElementById('study').style.display = "block";
    document.getElementById('work').style.display = "none";
    document.getElementById('workField').value = "0";
    document.getElementById('employer').value = "0";
  } else {
    document.getElementById('workField').value = "";
    document.getElementById('employer').value = "";
  }
  if (evt.target.value == "Work Permit" || evt.target.value == "Canadian" || evt.target.value == "Permanent Resident") {
    document.getElementById('study').style.display = "none";
    document.getElementById('work').style.display = "block";
    document.getElementById('studyField').value = "0";
    document.getElementById('school').value = "0";
  } else {
    document.getElementById('studyField').value = "";
    document.getElementById('school').value = "";
  }

})

$("#forgot").on('click', evt => {
  var intro = document.getElementById('intro');
  var form = document.getElementById('form-login');

  intro.innerHTML = "Enter your email to reset your password";
  form.innerHTML = `<div class="field-wrap">
  <label>
      Email Address<span class="req">*</span>
  </label>
  <input type="email" id="resetEmail" autocomplete="off" />
  </div>
  <button class="button button-block" id="resetPassword">Reset</button>
  `;
})



var done = false;

setTimeout(function () {
  done = true;
}, 2546);

$('.fa-spin').on('animationiteration', function (event) {
  if (done) {
    $(event.target).removeClass('fa-spin');
    $(event.target).addClass('fa-check-circle');
  }
});

const renderVideos = (data) => {

  var videos = document.getElementById("videosList");
  var html = `
  
  <div class="youtube-video-place embed-responsive embed-responsive-4by3 " data-yt-url="${data.url}?rel=0&showinfo=0&autoplay=1" data-id="${data.id}">
  <div class="image">
  <div class="player" data-id="${data.id}" id="play"><span id="play" data-id="${data.id}">Play</span></div>
  <img src="${data.thumbnailURL}" style="object-fit:contain" async class="play-youtube-video">
  </div>
  </div>
  `
  videos.insertAdjacentHTML('afterbegin', html)
}


const renderPictures = (id, data) => {
  var imagesList = document.getElementById("imagesList");

  var html = `
  <div class="image">
                  <img src="${data.imageURL}" data-scroll-zoom />
                </div>
  `
  imagesList.insertAdjacentHTML('afterbegin', html)
  // imagesList.innerHTML+= html;
}
const renderService = (id, data) => {
  var servicesList = document.getElementById("servicesList");

  var link_Doc = data.infos.link || data.infos.urlDoc;
  var html = `

  <div class="col-md-4 col-sm-6">
                    <div class="product-grid8">
                      <div class="product-image8">
                        <a href="${link_Doc}">
                          <img class="pic-1" src="${data.imageURL}">
                        </a>
                        <ul class="social">`;
  if (data.infos.facebook) {
    html += `
    <li><a href="${data.infos.facebook}" class="fa fa-facebook" style="background-color:blue; color:white"></a></li>`

  }
  if (data.infos.instagram) {
    html += `
    <li><a href="${data.infos.instagram}" class="fa fa-instagram" style="background-color:white; color:red"></a></li>
    `

  }
  if (data.infos.snapchat) {
    html += `
    <li><a href="${data.infos.snapchat}" class="fa fa-snapchat" style="background-color:yellow; color:white"></a></li>`

  }
  html += `</ul>
                      </div>
                      <div class="product-content">
                      <h3 class="title">${data.infos.name}</h3>
                        <span class="product-shipping">${data.infos.address}</span>`
  if (data.infos.urlDoc) {
    html += `
  <a class="all-deals" href="${data.infos.urlDoc}">More info<i class="fa fa-angle-right icon"></i></a>
`
  } else {
    html += `
<a class="all-deals" href="${data.infos.link}">Visit Us<i class="fa fa-angle-right icon"></i></a>
`
  }
  html += `
                        </div>
                    </div>
                  </div>
  `
  servicesList.insertAdjacentHTML('afterbegin', html)
  // imagesList.innerHTML+= html;
}
