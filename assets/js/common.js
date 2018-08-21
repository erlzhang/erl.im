if(typeof(String.prototype.trim) === "undefined")
{
  String.prototype.trim = function() 
  {
    return String(this).replace(/^\s+|\s+$/g, '');
  };
}

document.addEventListener("turbolinks:load", function() {

  // 清除所有页面跳转的交互效果
  var emits = document.getElementsByClassName("emit");
  if( emits.length > 0 ){
    for( var i = 0, len = emits.length; i < len; i ++ ){
      emits[i].classList.remove("emit");
    }
  }
  // 菜单展开
  
  if( !menuToggler ) {
    var menuToggler = document.getElementById("menuToggler");
    var mainMenu = document.getElementById("mainMenu");
    if( menuToggler ) {
      menuToggler.onclick = function() {
        console.log(" menuToggler click  ")
        if( menuToggler.classList.contains("active") ) {
          menuToggler.classList.remove("active");
          mainMenu.classList.remove("on");
        } else {
          menuToggler.classList.add("active");
          mainMenu.classList.add("on");
        } 
      }
    }
  }

  //页面跳转动画

  //文章页面：返回归档页（怎么记住是从哪个归档页面跳过来的？）
  
  if( !archiveBtn ) {
    var archiveBtn = document.getElementById("archiveBtn");
    if( archiveBtn ) {
      archiveBtn.onclick = function(event) {
        animateVisit(event, 300);
      }
    }
  }

  //归档页面转跳文章页面
  
  if( !postLinks || postLinks.length == 0 ){
    var postLinks = document.getElementsByClassName("post-link");

    if ( postLinks.length > 0 ) {
      for( var i = 0, len = postLinks.length; i < len; i ++ ) {
        postLinks[i].onclick = function(event) {
          var archivePageUrl = window.location.href;
          animateVisit(event, 400);
          document.addEventListener("turbolinks:load", function() {
            var archiveBtn = document.getElementById("archiveBtn");
            if( archiveBtn && archiveBtn.href != archivePageUrl ) {
              archiveBtn.href = archivePageUrl;
            }
          });
        }
      } 
    }
    
  }


  // 归档页面翻页
  
  if( !btnNext ) {
    var btnNext = document.getElementById("btnNext");

    if( btnNext ) {
      btnNext.onclick = function(event) {
        animateVisit(event, 400); 
      }
    }
  }


  if( !btnPrev ) {
    var btnPrev = document.getElementById("btnPrev");

    if( btnPrev ) {
      btnPrev.onclick = function(event) {
        animateVisit(event, 400);
      }
    }
  }

  if( !pagiLinks || pagiLinks.length == 0 ) {
    var pagiLinks = document.getElementsByClassName("pagi-link");

    if( pagiLinks.length > 0 ) {
      for( var i = 0, len = pagiLinks.length; i < len; i++ ) {
        pagiLinks[i].onclick = function() {
          animateVisit(event, 400); 
        }
      }
    }
  }

  // 主菜单点击跳转动画

  if( !navLinks || navLinks.length == 0 ) {
    var navLinks = document.getElementsByClassName("nav-link");

    if( navLinks.length > 0 ){
      for( var i = 0, len = navLinks.length; i < len; i ++ ){
        navLinks[i].onclick = function(event) {
          console.log(" navLinks click ")
          animateVisit(event, 400)
        }
      }
    }
  } 

  // 相册
  
  if( !galleryLinks || galleryLinks.length == 0 ) {
    var galleryLinks = document.getElementsByClassName("gallery-link");

    if( galleryLinks.length > 0 ) {
      for( var i = 0, len = galleryLinks.length; i < len; i ++ ) {
        galleryLinks[i].onclick = function(event) {
          event.preventDefault();
          var ele = event.target;
          while( ele.tagName != "A" ){
            ele = ele.parentNode;
          }
          $.ajax({
            url: ele.href,
            type: "get",
            dataType: "JSON",
            success: function(data) {
              if( data.length >= 0 ) {
                images = []
                for( var i = 0, len = data.length; i < len; i ++ ) {
                  images.push({src: ele.href + data[i]});
                }
                $.fancybox.open(images);
              }
            }
          });
        }
      } 
    }
  }


  //小说

  if( !chapterList || chapterList.length == 0 ) {
    var chapterList = document.getElementsByClassName("chapter-link");

    var chapterContent = document.getElementById("chapterContent");

    if( chapterList.length > 0 ) {
      getChapter(chapterList[0].href)
      for( var i = 0, len = chapterList.length; i < len; i ++ ) {
        chapterList[i].onclick = function(event) {
          event.preventDefault();
          var ele = event.target
          while( ele.tagName != "A" ) {
            ele = ele.parentNode
          }
          getChapter(ele.href);
        } 
      } 
    }
  }
  
});


function getChapter(url) {
  // 原生ajax
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if( xhr.readyState == 4 ) {
      if( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {
        if( chapterContent ) {
          chapterContent.innerHTML = xhr.responseText 
        }
      } else {
        console.log(xhr.status)
      }
    }
  }
  xhr.open("get", url, true);
  xhr.send(null);
}


function animateVisit(e, delay) {
  console.log("animateVisit")
  e.preventDefault();
  var ele = e.target;
  while( ele.tagName != "A" ){
    ele = ele.parentNode;
  }
  ele.classList.add("emit");
  setTimeout(function() {
    Turbolinks.visit(ele.href);
  }, delay);
}
