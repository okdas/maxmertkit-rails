;(function ( $, window, document, undefined ) {

	var _name = 'affix'
	,	_defaults = {
			offset: 0	// Y
		,	inside: 'parent'
		,	fixHorizontal: true
		,	enabled: true
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
		if( me.options.fixHorizontal )
			me.$window.on( 'resize.' + me.name, $.proxy(me.checkPositionHorizontal, this) );

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
			if( me.$parent.css('position') === 'relative' )
			{
				$me.css({
					position: 'absolute',
					top: 0,
					bottom: 'auto'
				});
			}
			else
			{
				$me.css({
					position: 'absolute',
					top: $parentOffset.top,
					bottom: 'auto'
				});
			}
		} else if( $parentOffset.top + me.$parent.outerHeight() - height <= q && q >= $parentOffset.top ) {
			if( me.$parent.css('position') === 'relative' )
			{
				$me.css({
					position: 'absolute',
					top: 'auto',
					bottom: 0
				});
			}
			else
			{
				$me.css({
					position: 'absolute',
					top: $parentOffset.top + $parentHeight - height,
					bottom: 'auto'
				});
			}


		} else {
			if( $me.css('position') === 'absolute' && me.$parent.css('position') === 'relative' ) {
				
				mewidth = $me.width();
				if( ! $me.data('memargin') )
					$me.data('memargin', parseFloat($me.css('margin-left')) + 1 );
				
				
				$me.css({
					position: 'fixed',
					top: offset,
					bottom: 'auto',
					width: mewidth,
					marginLeft: $me.data('memargin')
				});

			}
			else
			{
				$me.css({
					position: 'fixed',
					top: offset,
					bottom: 'auto'
				});
			}
		}


		if( $me.css('position') === 'absolute' && me.$parent.css('position') === 'relative' ) 
				$me.css({left: 0})
			else
				// if( $me.css('position') === 'fixed' ) 
					$me.css({left: $parentOffset.left})
	}

	Affix.prototype.isenable = function() {
		return this.options.enabled;
	}

	Affix.prototype.checkPositionHorizontal = function() {
		var me = this
		,	$me = $(me.element);

		parentOffset = me.$parent.offset();
		
		if( me.options.enabled === true ) {
			if( $me.css('position') === 'absolute' && me.$parent.css('position') === 'relative' ) 
				$me.css({left: 0})
			else
				// if( $me.css('position') === 'fixed' ) 
					$me.css({left: parentOffset.left})
				// else
		}
	}

	Affix.prototype.__setOption = function( key_, value_ ) {
		var me = this
		,	$me = $(me.element);
		
		switch( key_ ) {
			case 'enable':
				if( value_ === false )
				{
					me.$window.off( 'scroll.' + me.name );
					me.$window.off( 'click.' + me.name );
					if( me.options.fixHorizontal )
						me.$window.off( 'resize.' + me.name );
					$me.css({ position: 'relative', top: 0, left: 0 });
					$me.removeAttr('style');
					this.options.enabled = false;
				}
				else
				{
					me.$window.on( 'scroll.' + me.name, $.proxy(me.checkPosition, this) );
					me.$window.on( 'click.' + me.name, $.proxy( function() { setTimeout( $.proxy(me.checkPosition, this) , 1 ) }, this ) );
					if( me.options.fixHorizontal )
						me.$window.on( 'resize.' + me.name, $.proxy(me.checkPositionHorizontal, this) );
					this.options.enabled = true;
				}
			break;
		}
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Affix( this, options_ ) );
			}
			else {
				if( typeof options_ === 'object' )
					$.data( this, 'kit-' + _name )._setOptions( options_ )
				else
				{
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
				}
			}
		});
	}

})( jQuery, window, document );