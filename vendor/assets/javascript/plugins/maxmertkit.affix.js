;(function ( $, window, document, undefined ) {

	var _name = 'affix'
	,	_defaults = {
			offset: 0	// Y
		,	inside: 'parent'
		}

	Affix = function(element, options) {
		this.name = _name;
		
		this.element = element;
		this.options = $.extend({}, _defaults, options);
		this._setOptions( this.options );

		this.init();
	}

	Affix.prototype = new $.kit();
	Affix.prototype.constructor = Affix;

	Affix.prototype.init = function() {
		var me = this,
			$me = $(me.element);

		me.$window = $(window);
		
		me.$window.on( 'scroll.' + me.name, $.proxy(me.checkPosition, this) );
		me.$window.on( 'click.' + me.name, $.proxy( function() { setTimeout( $.proxy(me.checkPosition, this) , 1 ) }, this ) );

		me.$parent = me.options.inside === 'parent' ? $me.parent() : $me.closest( me.options.inside );
		$me.css({ top: me.$parent.offset().top + me.options.offset });

		me.checkPosition();
	}

	Affix.prototype.checkPosition = function() {
		var me = this
		,	$me = $(me.element);

		if( ! $me.is(':visible') ) return;
		
		
		var scrollHeight = $(document).height()
		,	scrollTop = me.$window.scrollTop()
		,	position = $me.offset()
		,	height = $me.outerHeight()
		,	offset = me.options.offset

		,	$parentHeight = me.$parent.outerHeight()
		,	$parentOffset = me.$parent.offset();
		
		var q = scrollTop + me.options.offset;
		
		if( q <= $parentOffset.top ) {
			$me.css({
				position: 'absolute',
				top: $parentOffset.top
			});
		} else if( $parentOffset.top + me.$parent.outerHeight() - height <= q && q >= $parentOffset.top ) {
			$me.css({
				position: 'absolute',
				top: $parentOffset.top + $parentHeight - height
			});
		} else {
			$me.css({
				position: 'fixed',
				top: offset
			});
		}
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Affix( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}

})( jQuery, window, document );