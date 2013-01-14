;(function ( $, window, document, undefined ) {

	var _name = 'tabs',
		_defaults = {
			itemsSelector: undefined 	// Priority!!! (if not set, then will search be data-<temsData>) You can use "data-<selector name>" to find elements everywhere in the document, or ".<class name>" and "#<id name>" to look for items inside tabs container.
		,	itemsData: undefined			// All items are with data-tabs="<itemsData>"
		,	dataTarget: 'tabs-target'		// Inside $item.data(<dataTarget>) we will find selector of the container with tab content.
		,	trigger: 'click'

		,	beforeOpen: $.noop()
		,	open: $.noop()
		,	ifOpenedOrNot: $.noop()
		,	ifNotOpened: $.noop()
		,	beforeClose: $.noop()
		,	close: $.noop()
		,	ifClosedOrNot: $.noop()
		,	ifNotClosed: $.noop()
		}

	Tabs = function( element_, options_ ) {
		this.element = element_;
		this.name = _name;
		this.state = 'closed';
		this.options = $.extend( {}, this.options, _defaults, options_ );
		this.items = [];

		this._setOptions( this.options );


		this.init();
	}

	Tabs.prototype = new $.kit();
	Tabs.prototype.constructor = Tabs;

	Tabs.prototype.__setOption = function ( key_, value_ ) {
		var me  = this;
		var $me = $(me.element);
		
		switch( key_ ) {
			case 'itemsSelector', 'itemsData', 'trigger':
				me._setEvents();
			break;
		}

		me.options[ key_ ] = value_;
	}

	Tabs.prototype._getItems = function() {
		var me  = this
		,	$me = $(me.element)
		,	_items = [];

		
		me.options.itemsSelector !== undefined ?
			$me.find( me.options.itemsSelector ).each( function( index_, item_ ) { _items.push( $(item_) ) }) :
			$me.find( '[data-tabs="' + me.options.itemsData + '"]' ).each( function( index_, item_ ) { _items.push( $(item_) ) })

		return _items;
	}

	Tabs.prototype._getItem = function( event_ ) {
		var me  = this
		,	$me = $(me.element)
		,	_el = undefined
		, _target;

		_target = $(event_.target);
		
		if( _target.closest(me.options.itemsSelector).length > 0 ) _el = $(_target.closest(me.options.itemsSelector));
		if( _target.closest('[data-tabs="'+me.options.itemsData+'"]').length > 0 ) _el = $(_target.closest('[data-tabs="'+me.options.itemsData+'"]').get(0));
		if( _target.hasClass(me.options.itemsSelector) ) _el = $(_target);

		return _el;
	}

	Tabs.prototype._unsetEvents = function() {
		var me  = this;
		var $me = $(me.element);

		$me.off( '.' + me.name );

		return me;
	}

	Tabs.prototype._setEvents = function() {
		var me  = this
		,	$me = $(me.element)
		,	_eventIn
		,	_eventOut;

		me._unsetEvents();

		switch( me.options.trigger ) {
			case 'hover':
				_eventIn = 'mouseenter.' + me.name;
			break;

			case 'click':
				_eventIn = 'click.' + me.name;
			break;
		}

		$me.on( _eventIn, function( event_ ) {
			var $_element = me._getItem( event_ );

			if(  $_element && ! me._isOpen( $_element ) )
				me.open( $_element );
		});

	}

	Tabs.prototype.init = function() {
		var me  = this;
		var $me = $(me.element);
		
	}

	Tabs.prototype.open = function( item_ ) {
		var me  = this;
		var $me = $(me.element);

		if( me.options.enabled === true ) {
			
			try {
				var deferred = me.options.beforeOpen.call( item_ );
				deferred
					.done(function(){
						me._open( item_ );
					})
					.fail(function(){
						me.state = 'closed';
						$me.trigger('ifNotOpened.' + me.name);
						$me.trigger('ifOpenedOrNot.' + me.name);
					})
			} catch( e ) {
				me._open( item_ );
			}

		}
	}

	Tabs.prototype._open = function( item_ ) {
		var me  = this
		,	$me = $(me.element)
		,	_target = $(document).find( item_.data( me.options.dataTarget ) )

		
		if( me.options.dataTarget ) {
			
			if( item_.data('tabs-data') !== undefined ) {
				try {
					$.get( item_.data('tabs-data') )
						.done( function( document_, result_, answer_ ) {
							if( me.close() ) {
								_target.html( answer_.responseText );
								me._openAnimation( item_, _target );
								$me.trigger('ifOpenedOrNot.' + me.name);
							}
						})
						.fail( function( answer_ ) {
							$me.trigger('ifNotOpened.' + me.name);
							$me.trigger('ifOpenedOrNot.' + me.name);
						})
				} catch( e ) {
					$me.trigger('ifNotOpened.' + me.name);
					$me.trigger('ifOpenedOrNot.' + me.name);
				}
			}
			else
				if( me.close() ) {
					me._openAnimation( item_, _target );
				}
		}
	}

	Tabs.prototype._openAnimation = function( item_, target_ ) {
		var me  = this
		,	$me = $(me.element);

			item_.addClass('_active_');
			
			if( me.options.animation ) {
				target_.fadeIn();
			}
			else {
				target_.show();
			}

			$me.trigger('open.' + me.name);
	}

	Tabs.prototype.close = function() {
		var me  = this;
		var $me = $(me.element);

		$.each( me._getItems(), function( index_, item_ ) {
			if( me._isOpen( item_ ) ) {
				$(document).find( item_.data( me.options.dataTarget ) ).hide();
				item_.removeClass('_active_');
			}
		});

		$me.trigger('close.' + me.name);

		return true;
	}

	Tabs.prototype._isOpen = function( item_ ) {
		var me  = this;
		var $me = $(me.element);

		return item_.hasClass( '_active_' );
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Tabs( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}

})( jQuery, window, document );