jQuery(document).ready(function ($) {
  mainAnimation();
  $('body').addClass('page-load');
  if ($('body').hasClass('page-load')) {

    pageLoad();
  }

  /*	//set some variables
     var isAnimating = false,
       firstLoad = false,
       newScaleValue = 1;

     //cache DOM elements
     var dashboard = $('.site-menu'),
       mainContent = $('.wrap'),
       loadingBar = $('#cd-loading-bar');

     //select a new section
     dashboard.on('click', '.page-link', function(event){
       event.preventDefault();
       var target = $(this),
         //detect which section user has chosen
         sectionTarget = target.data('menu');
       if( !target.hasClass('selected') && !isAnimating ) {
         //if user has selected a section different from the one alredy visible - load the new content
         triggerAnimation(sectionTarget, true);
       }

       firstLoad = true;
     });

     //detect the 'popstate' event - e.g. user clicking the back button
       $(window).on('popstate', function() {
         if( firstLoad ) {
  	
           //Safari emits a popstate event on page load - check if firstLoad is true before animating
           //if it's false - the page has just been loaded 
  	
             var newPageArray = location.pathname.split('/'),
             //this is the url of the page to be loaded 
             newPage = newPageArray[newPageArray.length - 1].replace('.asp', '');
             if( !isAnimating ) triggerAnimation(newPage, false);
         }
         firstLoad = true;
     });


     //start animation
     function triggerAnimation(newSection, bool) {
       isAnimating =  true;
       newSection = ( newSection == '' ) ? 'index' : newSection;
     	
       //update dashboard
       dashboard.find('*[data-menu="'+newSection+'"]').addClass('selected').parent('li').siblings('li').children('.selected').removeClass('selected');
     	
          //trigger loading bar animation
     	
       //load new content
       loadNewContent(newSection, bool);
          
     }

     function loadNewContent(newSection, bool) {
                  gnbClose();        
                  $('.page-wrap').empty();
                  $('body').addClass('loading').removeClass('page-load');
          
       setTimeout(function(){
         //animate loading bar
         //create a new section element and insert it into the DOM
         var section = $('<div class="wrap '+newSection+'"></div>').appendTo('.page-wrap');
         //load the new content from the proper html file
              
         section.load(newSection+'.asp .wrap > *', function(event){
           //finish up the animation and then make the new section visible
           var scaleMax = loadingBar.data('scale');
         	
                  
                  
             $(function(){
             //add the .visible class to the new section element -> it will cover the old one
             section.prev('.visible').removeClass('visible').end().addClass('visible').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
               resetAfterAnimation(section);
             });

             //if browser doesn't support transition
             if( $('.no-csstransitions').length > 0 ) {
               resetAfterAnimation(section);
             }

             var url = newSection+'.asp';

             if(url!=window.location && bool){
                   //add the new page to the window.history
                   //if the new page was triggered by a 'popstate' event, don't add it
                   window.history.pushState({path: url},'',url);
               }
           });
         });
              resetAfterAnimation();
       }, 1500);
     }

     function loadingBarAnimation() {
          
          gnbClose();        
          
     }

     function resetAfterAnimation(newSection) {
       //once the new section animation is over, remove the old section and make the new one scrollable
       $('body').removeClass('loading').addClass('page-load');
          pageLoad();
          mainAnimation();
       isAnimating =  false;
       //reset your loading bar
  	
          
     }*/

  $('.page-link').on('click', function (e) {
    e.preventDefault();
    var target = $(this).attr('href');
    gnbClose();
    $('body').addClass('loading');

    setTimeout(function () {
      location.href = target;
    }, 2500);

  });


  $('.btn-menu').click(function () {
    $(this).toggleClass('active');
    $(this).toggleClass('default');
    if ($(this).hasClass('active')) {
      gnbOpen();
    } else {
      gnbClose();
    }
  });
  smoothScroll(1.1, 210);
  scrollEffect();

  $(window).scroll(function () {

    scrollEffect();

  });


  $('.input-t').on('blur', function () {
    var v = $(this).val();
    if (!v == '') {
      $(this).parent().addClass('fill');
    } else {
      $(this).parent().removeClass('fill');
    }
  });
});



var tl = new TimelineMax,
  tw = TweenMax;

function gnbOpen() {
  var gnb = $('.gnb');

  tl.to(gnb, 0.1, {
    display: 'block'
  });
  tw.to(gnb, 0.4, {
    height: '100vh',
    ease: Quint.easeInOut
  })
  tw.to(gnb, 0.8, {
    'max-width': '100%',
    ease: Quint.easeInOut
  });
  tw.staggerTo($('.site-menu li a'), 0.8, {
    alpha: 1,
    'margin-top': 0,
    ease: Quint.easeInOut
  }, 0.1);

}

function gnbClose() {
  var gnb = $('.gnb');
  tl.staggerTo($('.site-menu li a'), 0.5, {
    alpha: 0,
    'margin-top': '-100%',
    ease: Quint.easeInOut
  }, 0.1)
  tw.to(gnb, 0.5, {
    'max-width': '0%',
    ease: Quint.easeInOut,
    delay: 0.2
  });
  tw.to(gnb, 0.4, {
    height: '0',
    ease: Quint.easeInOut,
    delay: 0.5
  });
  tw.to(gnb, 0.1, {
    display: 'none',
    delay: 0.9
  });
  $('.btn-menu').removeClass('active');
  $('.btn-menu').addClass('default');

}

function pageLoad() {
  setTimeout(function () {
    tw.to($('.page-top .bg'), 0.6, {
      x: 0,
      ease: Quint.easeInOut
    });
    tw.to($('.page-top .page-img'), 0.6, {
      x: 0,
      alpha: 1,
      ease: Quint.easeInOut
    });
    tw.to($('.page-top .bg'), 0.6, {
      x: '100%',
      ease: Quint.easeInOut,
      delay: 0.65
    });
    tw.to($('.page-top .info-bg'), 0.6, {
      x: '0%',
      ease: Quint.easeInOut,
      delay: 0.65
    });
  }, 200)
}

function smoothScroll(time, distance) {

  var $window = $(window);
  var scrollTime = time;
  var scrollDistance = distance;

  $window.on("mousewheel.smooth DOMMouseScroll.smooth", function (event) {

    event.preventDefault();
    var delta = event.originalEvent.wheelDelta / 60 || -event.originalEvent.detail / 3;
    var scrollTop = $window.scrollTop();
    var finalScroll = scrollTop - parseInt(delta * scrollDistance);

    TweenMax.to($window, scrollTime, {
      scrollTo: {
        y: finalScroll,
        autoKill: true
      },
      ease: Power1.easeOut,
      overwrite: 5
    });

  });
}

function mainAnimation() {
  var l = $('.load-animation'),
    t = $('.load-animation .transition01');
  tw.to($('#first-slide'), 0.8, {
    scale: 1,
    ease: Expo.easeInOut
  });
  tw.to(t, 0.5, {
    x: 0,
    ease: Quint.easeInOut,
    delay: 0.5
  });
  tw.to($('.line'), 0.5, {
    scale: 1,
    ease: Quint.easeInOut
  })
  tw.to($('.load-animation .hidden'), 0.1, {
    alpha: 1,
    delay: 0.9
  });
  tw.to(t, 0.5, {
    x: '110%',
    ease: Quint.easeInOut,
    delay: 0.9
  });
  tw.from($('.page-progress'), 1, {
    scaleX: 0,
    ease: Quint.easeInOut
  });
  tw.staggerTo($('.main-txt .perspective-ani span'), 0.8, {
    rotationY: '0deg',
    alpha: 1,
    ease: Power1.easeOut,
    delay: 1
  }, 0.2);
  tw.to($('.btn-about'), 0.5, {
    alpha: 1,
    bottom: '0px',
    ease: Power1.easeInOut,
    delay: 1.8
  })
}

function scrollEffect() {
  var sc = $(window).scrollTop(),
    documentH = $(document).height(),
    ds = sc / 10,
    windowH = window.innerHeight,
    progress = $('.progress-inner'),
    value = (sc / (documentH - windowH)) * 100;
  progress.css('width', value + '%');

  if (sc >= ((documentH - windowH) - 100)) {
    $('.scrolltop').addClass('page-end');
    $('.bottom-contents').addClass('viewport');
  } else {
    $('.scrolltop').removeClass('page-end');
  }
  if (sc >= $('.site-header').height()) {
    $('.site-header').addClass('sticky')
  } else {
    $('.site-header').removeClass('sticky')
  }



  $('.project-list li, .prx').each(function () {
    var i = $(this).attr('data-distance');
    $(this).css({
      'transform': 'translate(0,' + -(ds * i) + '%)'
    });
  });

  $(".parallax-item").each(function () {
    if ($(window).scrollTop() >= $(this).offset().top - 800) {
      $(this).addClass("viewport");
    }
  });

}

function scroll_Top() {
  $('body,html').stop().animate({
    scrollTop: 0
  }, 800, 'easeInOutQuint');
}

function scrollDown() {
  $('body,html').stop().animate({
    scrollTop: $('.project-main').offset().top
  }, 800, 'easeInOutQuint');
}



function particle() {
  var Partallan = (function (window) {

    var W = window.innerWidth,
      H = window.innerHeight,
      text = "YOUR TEXT",
      stage = new PIXI.Container(),
      renderer = PIXI.autoDetectRenderer(W, H, {
        view: document.getElementById("particle"),
        backgroundColor: 0xf4f4f4,
        antialias: true,
        résolution: 1
      }),

      //Play with this parameter for the number of particle 
      //lower make more particle.
      skipCount = renderer instanceof PIXI.WebGLRenderer ? 2 : 7,
      particlesLength = 0,
      mouseX = -100,
      mouseY = -100,
      PI_2 = Math.PI * 2,
      particles = [],

      //Play with this parameter for the particle speed
      viscosity = 0.001,
      minDistSq = 3000;


    var explode = false;

    var _private = {
      randomise: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      },
      setrequest: function () {
        window.requestAnimFrame = (function () {
          return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
              window.setTimeout(callback, 1000 / 60);
            };
        })();
      },
    };

    var Partallan = {
      init: function (textInput) {
        text = textInput;
        _private.setrequest();
        this.writeText();
      },
      writeText: function () {
        var textSample = new PIXI.Text(text, {
          font: 'bold 300px ns, sans-serif',
          align: 'left'
        });
        textSample.position.x = (W / 2) - (textSample.width / 2);
        textSample.position.y = (H + 500) - (textSample.height / 2);


        // Now, we need to save the positions of black pixels and then use it to move particule
        var imageData = textSample.context.getImageData(0, 0, textSample.width, textSample.width);
        var data = imageData.data;


        // We'll now iterate over the data array going through rows and columns
        // Instead of reading each pixel, we can skip over some to increase the performance
        for (var i = 0; i < imageData.height; i += skipCount) {
          for (var j = 0; j < imageData.width; j += skipCount) {
            var color = data[(j * imageData.width * 4) + (i * 4) - 1];
            // Now if the color is black, we'll do our stuff
            if (color === 255) {
              particles[particles.length] = this.createParticle();
              particles[particles.length - 1].setPos(i + ((W / 2) - (textSample.width / 2)), j + ((H / 2) - textSample.height - 40));
            }
          }
        }

        particlesLength = particles.length;

        // ctx.shadowBlur = 6;
        // ctx.shadowColor = '#CCC';
        renderer.view.onmousemove = function (evt) {
          mouseX = evt.clientX;
          mouseY = evt.clientY;
        };
      },

      createParticle: function () {
        var particle = {};
        particle.random = Math.random();
        particle.valX = 0;
        particle.valY = 0;
        particle.vitesse = _private.randomise(3, 10) / 1000;
        particle.degree = Math.random() * 2;
        particle.rayon = Math.random() * 2;
        particle.direct = Math.random() < 0.5 ? (particle.vitesse = particle.vitesse * (-1)) : true;
        particle.r = _private.randomise(1, 3);
        particle.opacity = Math.random();
        particle.mass = 0.05 + Math.random() * 0.9;
        particle.x = 10;
        particle.y = 10;
        particle.fx = 0;
        particle.fy = 0;
        particle.vx = 0;
        particle.vy = 0;
        particle.ox = 0;
        particle.oy = 0;
        particle.dx = 0;
        particle.dy = 0;
        particle.dSq = 0;
        particle.f = 0;
        particle.a = 0;
        particle.pointTexture = new PIXI.Texture.fromImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzI5N0RBNUIyNzI1MTFFNUEyM0NGMUQzQTNGN0U3MDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzI5N0RBNUMyNzI1MTFFNUEyM0NGMUQzQTNGN0U3MDciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjk3REE1OTI3MjUxMUU1QTIzQ0YxRDNBM0Y3RTcwNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjk3REE1QTI3MjUxMUU1QTIzQ0YxRDNBM0Y3RTcwNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpC1KzoAAAA/SURBVHjaYszNzZVjYGCYA8SWQHwciFNYgMRcIHZhgABXIF7IBCQsGFCBFUjwBJrgMZBgMhDvAeKvUDoBIMAAKs0KaIFOO1cAAAAASUVORK5CYII=");
        particle.pixiCircle = new PIXI.Sprite(particle.pointTexture, {
          x: 0,
          y: 0,
          width: 5,
          height: 5
        });
        particle.pixiCircle.scale.x = particle.random;
        particle.pixiCircle.scale.y = particle.random;
        particle.pixiCircle.alpha = particle.random > .99 ? 1 : Math.random();
        stage.addChild(particle.pixiCircle);
        // create a filter



        // Finally a function to set particle's function and save original pos
        particle.setPos = function (x, y) {
          this.ox = x;
          this.oy = y;
          this.x = _private.randomise(-100, W + 100);
          this.y = _private.randomise(-100, H + 100);
        };

        //Function to (re)move particule
        particle.move = function () {
          this.dx = mouseX - this.ox;
          this.dy = mouseY - this.oy;
          this.dSqr = this.dx * this.dx + this.dy * this.dy;

          //if particule is in the repulsion area 
          if (this.dSqr < minDistSq) {
            this.dx = mouseX - this.x;
            this.dy = mouseY - this.y;
            this.dSqr = this.dx * this.dx + this.dy * this.dy;

            // Force is proportional to distance
            this.f = this.dSqr / minDistSq;
            this.f = this.f < 0 ? 0 : this.f > 1 ? 1 : this.f;

            // Find angle for velocity
            this.a = Math.atan2(this.dy, this.dx);

            //attraction ou repulsion
            this.f = -this.f;

            // Sum forces
            this.fx += Math.cos(this.a) * this.f;
            this.fy += Math.sin(this.a) * this.f;
          }

          this.fx += (this.ox - this.x) * viscosity * this.mass;
          this.fy += (this.oy - this.y) * viscosity * this.mass;

          // Euler integration step
          this.vx += this.fx / this.mass;
          this.vy += this.fy / this.mass;

          this.x += this.vx;
          this.y += this.vy;

          // Dampen velocity
          this.vx *= 0.95;
          this.vy *= 0.95;

          // Clear forces
          this.fx = this.fy = 0;
          // Compute squared distance

          //make particule move (turn) by itself
          this.valX = this.x + (this.rayon * Math.cos(Math.PI * this.degree));
          this.valY = this.y + (this.rayon * Math.sin(Math.PI * this.degree));
          //increment to the next degree
          this.degree += this.vitesse;
          this.pixiCircle.position.x = this.valX;
          this.pixiCircle.position.y = this.valY;


        };
        return particle;
      },
      step: function () {
        for (var i = 0; i < particlesLength; i++) {
          particles[i].move();
        }
        renderer.render(stage);
        window.requestAnimFrame(Partallan.step);
      },
      start: function () {
        window.requestAnimFrame(Partallan.step);
      },
      setExplode: function (val) {
        explode = val;
        if (val) {
          minDistSq = 120000;
          mouseX = (W / 2);
          mouseY = (H / 2);
        } else {
          setTimeout(function () {
            minDistSq = 3000;
            mouseX = 0;
            mouseY = 0;
          }, 1500);
        }
      }
    };
    return Partallan;
  })(window);
  Partallan.init("M A D");
  Partallan.start();
}


 /*function particle(){
     var init = function(){
       var isMobile = navigator.userAgent &&
         navigator.userAgent.toLowerCase().indexOf('mobile') >= 0;
       var isSmall = window.innerWidth < 1000;

       var ps = new ParticleSlider({
         ptlGap: isMobile || isSmall ? 3 : 0,
         ptlSize: isMobile || isSmall ? 3 : 1,
         width: 1e9,
         height: 1e9
       });


       
       (window.addEventListener
        ? window.addEventListener('click', function(){ps.init(true)}, false)
        : window.onclick = function(){ps.init(true)});
     }

         var initParticleSlider = function(){
           var psScript = document.createElement('script');
           (psScript.addEventListener
             ? psScript.addEventListener('load', init, false)
             : psScript.onload = init);
           psScript.src = '/js/particleslider.js';
             psScript.setAttribute('type', 'text/javascript');
           document.body.appendChild(psScript);
         }

         (window.addEventListener
           ? window.addEventListener('load', initParticleSlider, false)
           : window.onload = initParticleSlider);

 }*/


