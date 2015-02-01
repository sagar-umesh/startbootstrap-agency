/**
 * cbpAnimatedHeader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpAnimatedHeader = (function() {

	var docElem = document.documentElement,
		navbar = document.querySelector( '.navbar-default' ),
		didScroll = false,

		// fraction of the width occupied by the header. Have a buffer of 2%. This value will be overriden based on the height of the header, if it exists.
		documentHeightPercent = 0.1; // 

	var header = document.querySelector("header");
	if( header !== null) {
		documentHeightPercent = (document.querySelector("header").offsetHeight / docElem.offsetHeight) - 0.02;
	}

	function init() {
		window.addEventListener( 'scroll', function( event ) {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( scrollPage, 250 );
			}
		}, false );
	}

	function scrollPage() {
		var sy = scrollY();
		var percentCovered = sy / docElem.offsetHeight;
		navbar.style.backgroundColor = "rgba(0, 0, 0, " + percentCovered / documentHeightPercent + ")";

		if ( percentCovered >= documentHeightPercent ) {
			classie.add(navbar, 'navbar-shrink');
		}
		else {
			classie.remove(navbar, 'navbar-shrink');
		}
		didScroll = false;
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	init();

})();