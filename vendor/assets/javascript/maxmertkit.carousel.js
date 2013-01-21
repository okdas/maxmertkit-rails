;(function ( $, window, document, undefined ) {
	var _name = 'carousel'
	,	_defaults = {
		enabled: true
	,	theme: 'info'
	,	itemSelector: '.js-carousel-item'
	,	itemAnimation: 'css' 						// if true – jquery animation, if string – name of jquery or css animation
	,	controlSelector: '.js-carousel-control'
	,	navigationSelector: '#js-carousel-nav'
	,	hideControlsDistance: 200 					// if 0 – always show controls

	,	autoSlide: 15000							// im ms, if 0 – no autoscroll

	,	imageFill: true 							// Fill image by width and height of carousel
	,	imageFillAnimationInterval: 20000					// im ms, if 0 – no img scroll
	,	imageFillAnimation: true 					// if true – animate by jquery, else – name jquery animation. NO CSS animation (to stop animation in any time)
	,	imageFillMouseMove: false
	,	imageFillMouseMoveDelay: 5000
	
	,	captionAnimation: 'blurIn'					// if true – animate by jquery, else – name of css animation
	,	captionAnimationDelay: 1000 				// in ms, interval between several captions show animation
	}

	Carousel = function(element, options) {
		var me = this;

		this.name = _name;		
		this.element = element;
		this.options = $.extend({}, _defaults, options);
		this.active = 0;

		this._setOptions( this.options );

		this.init();
	}

	Carousel.prototype = new $.kit();
	Carousel.prototype.constructor = Carousel;

	Carousel.prototype.enable = function() {
		var me = this;

		me.__setOption( 'enabled', true )
	}

	Carousel.prototype.disable = function() {
		var me = this;

		me.__setOption( 'enabled', false )
	}

	Carousel.prototype.__setOption = function ( key_, value_ ) {
		var me  = this;
		var $me = $(me.element);

		switch( key_ ) {

			case 'enabled':
				if( ! value_ ) {
					clearInterval( me.timer );
					me.clearImageSlide();
				}
			break;
			
			case 'controlSelector':
				// Remove old controls events
				me.controls && me.controls.length > 0 && $.each( me.controls, function( index_, control_ ) { control_.off( '.' + me.name ) });
				
				// Find new controls
				me.controls = $( value_ ).map( function( index_, control_ ) {
					// Check if in 'href' is id of our carousel
					if( $(control_).attr( 'href' ).replace(/#/g, '') === $me.attr( 'id' ) ) {
						
						// Create new click event
						$(control_).on( 'click.' + me.name, function( event_ ) {
							
							// Use data-slide to find out where to slide. It should be 'prev' or 'next'
							me.options.enabled && $(this).data( 'slide' ) && me[ $(this).data( 'slide' ) ]();

							event_.preventDefault();
						});

						return $(control_);	
					} 
				});
				
			break;

			case 'navigationSelector':
				me.nav && me.nav.length > 0 && $.each( me.nav, function( index_, nav_ ) { nav_.off( '.' + me.name ) });
				me.nav = $( value_ ).map( function( index_, item_ ) {
					for( var i = 0; i < me.items.length; i++ )
						$(item_).append('<i></i>')

					$(item_).addClass( '-' + me.options.theme + '-' );

					$(item_).on( 'click.' + me.name, function( event_ ) {
						if( me.options.enabled && $(event_.target).is('i') ) {
							me.active = $(event_.target).index();
							me.to();
						}
					});

					return $(item_);
				});
			break;

			case 'itemSelector':
				// Get an array of items
				me.items = $me.find( value_ ).map( function( index_, item_ ) { return $(item_) });
			break;

			case 'hideControlsDistance':
				value_ && value_ > 0 && $me.off( 'mousemove.' + me.name ) && $me.on( 'mousemove.' + me.name, function( event_ ) { $.proxy( me.trackMouseControls( event_ ), me ) });
			break;

			case 'autoSlide':
				clearInterval( me.timer );
				if( value_ > 0) me.timer = setInterval( $.proxy(me.next, me), value_ );
			break;

			case 'imageFill':
				if( value_ ) {
					$me.addClass('-carousel-imageFill');
					$me.imagesLoaded( function() {
						var carouselHeight = $me.innerHeight()
						,	carouselWidth = $me.innerWidth();
						
						$.each(me.items, function( index_, item_ ) {
							var image_ = item_.find(' > img ')
							,	imageWidth = $(image_).width()
							,	imageHeight = $(image_).height()
							,	aspectRatio = imageWidth / imageHeight;
							
							item_.css({ height: '100%' });
							
							$(image_).css({ position: 'absolute', top: 0, left: 0, maxHeight: 'none', maxWidth: 'none' });

							carouselWidth / carouselHeight < aspectRatio ?
								$(image_).css({ width: 'auto', height: '100%' }) :
								$(image_).css({ width: '100%', height: 'auto' }) ;
						});
					});
				}
			break;

			case 'imageFillAnimation':
				if( value_ ) $me.on( 'slide.' + me.name, $.proxy( me.imageSlide, me ) );
			break;

			case 'imageFillMouseMove':
				$me.off( 'mouseenter.mousecontrol.' + me.name );
				$me.off( 'mouseleave.mousecontrol.' + me.name );
				if( value_ ) $me.on( 'mousemove.mousecontrol.' + me.name, $.proxy( me.imageSlideByMouse, me ) );
				if( value_ ) $me.on( 'mouseleave.mousecontrol.' + me.name, $.proxy( me.imageSlide, me ) );
			break;

			case 'captionAnimation':
				$me.on( 'slide.' + me.name, function() {
					me.items[ me.active ].find('.-carousel-caption').each( function( index_, caption_ ) {
						$(caption_).find('div').each( function( index__, captionPart_ ) {
							if( typeof value_ === 'boolean' )
								$(captionPart_).fadeIn();
							
							if( typeof value_ === 'string' ) {
								$(captionPart_).addClass('-mx-' + value_);
								setTimeout(function(){
									$(captionPart_).addClass('-mx-start');
								}, me.options.captionAnimationDelay * (index__ + 1))
							}
						});
					});
				});
			break;
		}
		me.options[ key_ ] = value_;
	}

	Carousel.prototype.init = function() {
		var me = this
		,	$me = $(me.element);

		$me.show().animate( {opacity: 1 });
		me.imageSlide();
		
		// Set autoscroll. Always check mouseenter and mouseleave, because autoSlide can change any time.
		$me.on( 'mouseenter.' + me.name, function() {
			if( me.options.autoSlide > 0 ) clearInterval( me.timer );
		});

		$me.on( 'mouseleave.' + me.name, function( event_ ) {
			if( me.options.autoSlide > 0 ) me.timer = setInterval( $.proxy(me.next, me), me.options.autoSlide );
			$me.find( me.options.controlSelector ).each( function( index_, control_ ) { $(control_).fadeOut(100) });
		});

		me.to();
	}

	// If we need to update items without change 'itemSelector' option
	Carousel.prototype.update = function() {
		var me = this;
		me.__setOption( 'itemSelector', me.options.itemSelector );
	}

	Carousel.prototype.next = function() {
		var me = this;

		var clearSliders = me.clearImageSlide();

		clearSliders.done(function() {
			me.active !== undefined && me.active + 1 === me.items.length ? 
				me.active = 0 :
				me.active++;

			me.to();
		});
	}

	Carousel.prototype.prev = function() {
		var me = this;

		var clearSliders = me.clearImageSlide();

		clearSliders.done(function() {
			me.active !== undefined && me.active - 1 < 0 ? 
				me.active = me.items.length - 1 :
				me.active--;

			me.to();
		});
	}

	Carousel.prototype.to = function( number_ ) {
		var me = this
		,	$me = $(me.element)
		,	carouselWidth = $me.innerWidth();

		if(number_) me.active = number_;

		var offsetMove = me.active * -carouselWidth;

		typeof me.options.itemAnimation == 'boolean' ?
			me.items[0].animate({ marginLeft: offsetMove }) :
			$.easing && me.options.itemAnimation in $.easing ?
				me.items[0].animate({ marginLeft: offsetMove }, { easing: me.options.itemAnimation }) :
				me.items[0].css({ marginLeft: offsetMove });

		me.nav && me.nav.length > 0 && $.each( me.nav, function( index_, nav_ ) {
			$(nav_).find('._active_').removeClass( '_active_' );
			$(nav_).find('i').eq(me.active).addClass(' _active_ ');
		});

		$me.trigger( 'slide.' + me.name );
	}

	Carousel.prototype.trackMouseControls = function( event_ ) {
		var me = this
		,	$me = $(me.element)
		,	x = event_.pageX - $me.offset().left
		,	carouselWidth = $me.width();
		
		// We should hide only controls inside slider!!! Not good to use find every time, but...
		$me.find( me.options.controlSelector ).each( function( index_, control_ ) {
			// Just in case check if in href if id of our carousel
			if( me.options.enabled && $(control_).attr( 'href' ).replace(/#/g, '') === $me.attr( 'id' ) )
				if( $( control_ ).data('slide') === 'prev' ) 
					me.options.hideControlsDistance > x ?
						$( control_ ).fadeIn(100) :
						$( control_ ).fadeOut(100)
				else
					me.options.hideControlsDistance > carouselWidth - x  ?
						$( control_ ).fadeIn(100) :
						$( control_ ).fadeOut(100);
		});
		
	}

	Carousel.prototype.imageSlide = function() {
		var me = this
		,	$me = $(me.element)
		,	carouselHeight = $me.innerHeight()
		,	carouselWidth = $me.innerWidth();

		if( me.options.enabled && me.options.imageFillAnimation ) {
			$me.imagesLoaded( function() {
				var img = $( me.items[ me.active ].find( 'img' )[0] )
				,	imgWidth = img.width()
				,	imgHeight = img.height()
				,	heightDelta = carouselHeight - imgHeight
				,	widthDelta = carouselWidth - imgWidth;

				typeof me.options.imageFillAnimation === 'boolean' ?
					img.animate({ top: heightDelta, left: widthDelta }, me.options.imageFillAnimationInterval) :
					$.easing && me.options.imageFillAnimation in $.easing &&
						img.animate({ top: heightDelta, left: widthDelta }, { duration: me.options.imageFillAnimationInterval, easing: me.options.imageFillAnimation });
			});
		}
	}

	Carousel.prototype.clearImageSlide = function() {
		var me = this
		,	$me = $(me.element)
		,	finished = new $.Deferred();

		me.options.imageFillAnimation ?
			me.items.each( function( index_, item_ ) {
				index_ !== me.active && item_.find('img').stop().css({ top: 0, left: 0 });

				me.options.captionAnimation && index_ !== me.active && item_.find('.-carousel-caption').each( function( index_, caption_ ) {
					$(caption_).find('div').each( function( index__, captionPart_ ) {
						if( typeof me.options.captionAnimation === 'boolean' )
							$(captionPart_).hide();
						if( typeof me.options.captionAnimation === 'string' ) {
							// debugger;
							$(captionPart_).removeClass('-mx-start ' + me.options.captionAnimation);
						}
					});
				});	

				index_ === me.items.length - 1 && finished.resolve();
			}) :
			finished.resolve();

		return finished.promise();
	}

	Carousel.prototype.imageSlideByMouse = function( event_ ) {
		var me = this
		,	$me = $(me.element);

		me.options.enabled && $me.imagesLoaded( function() {
			var	x = event_.pageX - $me.offset().left
			,	y = event_.pageY - $me.offset().top
			,	img = me.items[ me.active ].find('img')
			,	imgWidth = img.width()
			,	imgHeight = img.height()
			,	carouselWidth = $me.innerWidth()
			,	carouselHeight = $me.innerHeight()
			,	deltaX = carouselWidth - imgWidth
			,	deltaY = carouselHeight - imgHeight
			,	percentX = x * 100 / carouselWidth
			,	percentY = y * 100 / carouselHeight;

			img.stop().css({ top: percentY * deltaY / 100, left: percentX * deltaX / 100 });
		});
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Carousel( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}

})( jQuery, window, document );