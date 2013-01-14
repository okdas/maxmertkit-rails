;(function ( $, window, document, undefined ) {
	var _name = 'button'
	,	_defaults = {
			theme: 'default'
		,	beforeAction: $.noop()
		,	action: $.noop()
		,	clicked: $.noop()
		,	ifNotAction: $.noop()
		,	beforeUnset: $.noop()
		,	ifNotUnsetted: $.noop()
		,	ifUnsettedOrNot: $.noop()
		,	unsetted: $.noop()
	}

	Button = function( element_, options_ ) {
		this.element = element_;
		this.name = _name;
		this.state = 'unactive';
		this.options = $.extend( {}, this.options, _defaults, options_ );
		this._setOptions( this.options );

		if( typeof $.button === 'undefined' )
			$.button = [];
		if( this.element !== 'undefined' )
			$.button.push( this.element );

		this.init();
	}

	Button.prototype = new $.kit();
	Button.prototype.constructor = Button;

	Button.prototype.__setOption = function( key_, value_ ) {
		var me  = this
		,	$me = $(me.element);
		
		switch( key_ ) {
			case 'theme':
				$me.addClass( '-' + value_ + '-' );
			break;

			case 'enabled':
				value_ === true ? $me.removeClass( '-disabled-' ) : $me.addClass( '-disabled-' );
			break;
		}

		me.options[ key_ ] = value_;
	}

	Button.prototype.init = function() {
		var me  = this;
		
		$(me.element).on( 'click.' + me.name, function( event_ ) {
			me._toggle( me.element );
			event_.preventDefault();
		});
	}

	Button.prototype._toggle = function( btn_ ) {
		var me  = this
		,	$me = $(me.element);

		if( btn_ === me.element ) {
			if( me.state === 'unactive' )
				me.action()
			else
			if( me.state === 'active' )
				me.unset();
		}
	}

	Button.prototype.action = function() {
		var me  = this
		,	$me = $(me.element);

		if( me.options.enabled === true && me.state !== 'loading' ) {
			
			me.state = 'loading';

			if( me.options.beforeAction !== 'undefined' && (typeof me.options.beforeAction === 'object' || typeof me.options.beforeAction === 'function' )) {
				
				try {
					var deferred = me.options.beforeAction.call( $me );
					deferred
						.done(function(){
							me._action();
						})
						.fail(function(){
							me.state = 'unactive';
							$me.trigger('ifNotAction.' + me.name);
							$me.trigger('clicked.' + me.name);
						})
				} catch( e ) {
					me._action();
				}
				
			}
			else {
				me._action();
			}
		}
	}

	Button.prototype._action = function() {
		var me  = this;
		var $me = $(me.element);

		if( me.state === 'loading' ) {
			
			if( $me.data('radio') )
			{
				var _radio = $me.data('radio');
				$.each( me._getOtherInstanses( $.button ), function() {
					var _plugin = $.data( this, 'kit-' + me.name )
					,	_el = $( _plugin.element );

					if( _plugin.element !== me.element && _el.data('radio') && _el.data('radio') === _radio && _plugin.getState() === 'active' )
						_plugin.unset();
				});
			}
			
			me.state = 'active';
			$me.trigger('action.' + me.name);
		}

		$me.trigger('clicked.' + me.name);
	}

	Button.prototype.unset = function() {
		var me  = this;
		var $me = $(me.element);

		if( me.options.enabled === true && me.state !== 'unset' ) {

			if( me.options.beforeUnset != 'undefined' && (typeof me.options.beforeUnset === 'object' || typeof me.options.beforeUnset === 'function' ))
			{
				try {
					var deferred = me.options.beforeUnset.call( $me );
					deferred
						.done(function(){
							me._unset();
						})
						.fail(function(){
							$me.trigger('ifNotUnsetted.' + me.name);
							$me.trigger('ifUnsettedOrNot.' + me.name);
							me.state = 'active';
						})
				} catch( e ) {
					me._unset();
				}
				
			}
			else {
				me._unset();
			}
		}
	}

	Button.prototype._unset = function() {
		var me  = this;
		var $me = $(me.element);

		if( me.state === 'active' ) {			
			me.state = 'unactive';
			$me.trigger('unsetted');	
		}
		$me.trigger('ifUnsettedOrNot.' + me.name);
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Button( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}

})( jQuery, window, document );