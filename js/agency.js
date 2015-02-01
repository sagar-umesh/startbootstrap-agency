// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutQuart');
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});


// Parallax Effect on the background images
$('[data-parallax]').each(function() {
	var scroll = $(this);
	scroll.speed = 0.75; // this parameter indicates the speed at which the background should move, relative to scrolling speed.
	$(window).scroll(function() {
        var yPos = - $(window).scrollTop() * scroll.speed; 
         
        // background position
        var coords = '50% '+ yPos + 'px';
 
		// move the background
		scroll.css({ backgroundPosition: coords });
	}); // end window scroll
});  // end section function

// Building images
var numberOfImages = 45;
var photosDiv = $('#photographs')
for(var i = 1; i <= numberOfImages; i++) {
	photosDiv.append('<a href="img/photography/' + i + '.jpg" title="'+ '' + '" data-gallery><img src="img/photography/thumbs/' + i + '.jpg" alt="Banana"></a>');
}

// set initial configuration for the slideshow.
// Note that the fullscreen and borderless controls are not yet given to the user.
// See this for example: https://blueimp.github.io/Bootstrap-Image-Gallery/
var fullscreen = true;
var borderless = true;
$('#blueimp-gallery').data('useBootstrapModal', !borderless);
$('#blueimp-gallery').toggleClass('blueimp-gallery-controls', borderless);
$('#blueimp-gallery').data('fullscreen', fullscreen);
// blueimp.Gallery($('#photographs a'), $('#blueimp-gallery').data());