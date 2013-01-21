;(function ( $, window, document, undefined ) {

	var _name = 'scrollspy'
	,	_defaults = {
			itemSelector: 'li',
			offset: 2,
			animation: true
		}

	Scrollspy = function(element, options) {
		this.name = _name;
		
		this.element = element;
		this.options = $.extend({}, _defaults, options);

		var process = $.proxy( this.process, this );
		this.$scrollable = $(this.element).is('body') ? $(window) : $(this.element);
		$(window).on( 'scroll.' + this.name, process );
		$(window).on( 'resize.' + this.name, $.proxy(this.refresh, this) );

		this.init();
		process();
	}

	Scrollspy.prototype = new $.kit();
	Scrollspy.prototype.constructor = Scrollspy;

	Scrollspy.prototype.init = function() {
		var me = this,
			$me = $(me.element);
		
		me.refresh();
	}

	Scrollspy.prototype.refresh = function() {
		var me = this
		,	$me = $(me.element)
		,	$targets;

		me.targets = $([]);
		me.offsets = $([]);

		$targets = me.$scrollable
			.find( me.options.itemSelector )
			.map( function() {
				var $el = $(this)
				,	href = $el.data('target') || $el.attr('href')
				,	$href = /^#\w/.test(href) && $(href);

				return ( $href
							&& $href.length
							&& [[ $href.position().top, href ]] ) || null 
			})
			.sort( function( a, b ) { return a[0] - b[0] } )
			.each( function() {
				me.offsets.push(this[0]);
				me.targets.push(this[1]);
			});
	}

	Scrollspy.prototype.process = function() {
		var me = this
		,	$me = $(me.element)
		,	scrollTop = $(window).scrollTop() + me.options.offset
		,	i;

		for( i = 0; i < me.offsets.length - 1; i++ ) {
			if( scrollTop < me.offsets[0] )
				me.activate( me.targets[0] );
			if( me.offsets[i] < scrollTop && scrollTop <= me.offsets[i+1] )
				me.activate( me.targets[i] );
			if( scrollTop > me.offsets[i+1] )
				me.activate( me.targets[i+1] );
		}
	}

	Scrollspy.prototype.activate = function( target_ ) {
		var me = this
		,	$me = $(me.element)
		,	selector
		,	active,
			classes = me.options.animation ? '_active_ -mx-start' : '_active_';

		me.active = target_;
		
		$me
			.find( '._active_' )
				.removeClass( classes );

		$( '[data-target="'+ target_ +'"]' )
					.addClass( classes );
		
		active = $('body').find( target_ ).trigger( 'activate' );
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Scrollspy( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}

})( jQuery, window, document );