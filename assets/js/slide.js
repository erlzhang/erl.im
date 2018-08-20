var sectionList = document.getElementsByClassName('slide__section'),
    currentIndex = 0,
    len = sectionList.length,
    nextBtn = document.getElementById('nextBtn'),
    prevBtn = document.getElementById('prevBtn'),
    controls = document.getElementsByClassName('slide__control'),
    direction = true,
    inAnimation = false,
    container = document.getElementById("sectionContainer")

imagesLoaded( container , function( instance ) {

  document.getElementById("loading").style.display = "none";

  // 初始化动画效果
  reveal(0);

  // 绑定鼠标滚轮事件
  document.body.onmousewheel = function(event) {
    direction = event.wheelDelta < 0 ;
    slide();
  }

  // 滚轮事件（firefox）
  document.body.addEventListener("DOMMouseScroll", function(event) {
    direction =  event.detail == 3 ;
    slide();
  });

  // 移动端手势事件

  var touchtimes = 0, touchx = []

  document.body.addEventListener('touchstart',function(event){
    touchtimes ++ ;
    touchx[touchtimes] = event.changedTouches[0].clientY;   
  });  
  document.body.addEventListener('touchend',function(event){
    touchtimes ++ ;
    touchx[touchtimes] = event.changedTouches[0].clientY;

    // 滑动距离超过100才触发切换
    if( ( Math.abs(touchx[touchtimes] - touchx[touchtimes-1]) > 50 ) && ( event.target.id != "sidebarToggler" ) ) {
      direction = touchx[touchtimes] > touchx[touchtimes - 1];
      slide();
    }
  });

  // 绑定键盘事件

  document.addEventListener("keydown", function(event) {
    if( event && ( event.keyCode == 39 || event.keyCode == 40 ) ) {
      direction = true;
      slide(); 
    }
    if( event && ( event.keyCode == 38 || event.keyCode == 37 ) ) {
      direction = false;
      slide();
    }
  });
});
    

// 绑定翻页按钮点击事件
nextBtn.onclick = function() {
  direction = true;
  slide();
}
prevBtn.onclick = function() {
  direction = false;
  slide();
}

// 翻页
function slide() {

  // 动画未完成时不予翻页
  if( inAnimation ) { return }

  sectionList[currentIndex].timeLine.reverse();
}

// 内容出现动画效果
function reveal(i) {

  if( sectionList[i].timeLine ) {
    sectionList[i].timeLine.restart();
    return;
  }

  timeLine = new TimelineLite();

  var id = sectionList[i].id;
  timeLine.add( TweenMax.to(sectionList[i].getElementsByClassName("slide__img_placehold")[0], 0.75, {
    height: '100%',
    translateY: 0,
    opacity: 1
  }));
  timeLine.add( TweenMax.to(sectionList[i].getElementsByClassName('slide__desc')[0], 0.5, {
    translateY: 0,
    opacity: 1
  }), '-=0.3');
  timeLine.add( TweenMax.to(sectionList[i].getElementsByClassName('slide__title_inner')[0], 0.35, {
    width: '100%',
    opacity: 1
  }), '-=0.7');
  timeLine.add( TweenMax.to(sectionList[i].getElementsByClassName('slide__title_text')[0], 0.35, {
    translateX: 0,
    opacity: 1
  }), '-=0.3');
  timeLine.add( TweenMax.to(sectionList[i].getElementsByClassName('slide__time_inner')[0], 0.35, {
    width: '100%',
    opacity: 1
  }), '-=0.3')
  timeLine.add( TweenMax.to(sectionList[i].getElementsByClassName('slide__time_text')[0], 0.35, {
    translateX: 0,
    opacity: 1
  }));

  timeLine.eventCallback('onReverseComplete', function() {

    hide_slide(currentIndex);

    if( direction ) {
      if( currentIndex < len - 1 ){
        currentIndex++;
      } else {
        currentIndex = 0;
      }    
    } else {
      if( currentIndex > 0 ){
        currentIndex--;
      } else {
        currentIndex = len - 1;
      }        
    }

    show_slide(currentIndex);

    reveal(currentIndex); 
  });

  timeLine.eventCallback('onStart', function() {
    inAnimation = true;
  });

  timeLine.eventCallback('onComplete', function() {
    inAnimation = false;
  })

  sectionList[i].timeLine = timeLine;
}

// 隐藏当前slide
function hide_slide(i) {
  sectionList[i].style.opacity = '0';
  sectionList[i].style.zIndex = '1';
  controls[i].classList.remove('current');
}

// 显示当前slide
function show_slide(i) {
  sectionList[i].style.opacity = '1';
  sectionList[i].style.zIndex = '5';
  controls[i].classList.add('current');
}
