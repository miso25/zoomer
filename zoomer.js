/*
 *  Project: 
 *  Description: 
 *  Author: 
 *  License: 
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window is passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'zoomer',
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function zoomerPlugin( element, options ) {
        //this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        
		this.elem = element;
		this.$elem = $(element);
		this.$elem_original = this.$elem
		this.options = options;
		
		
		// This next line takes advantage of HTML5 data attributes
		// to support customization of the plugin on a per-element
		// basis. For example,
		// <div class=item' data-plugin-options='{"message":"Goodbye World!"}'></div>
		//this.metadata = this.$elem.data( 'plugin-options' );
		this.metadata = this.$elem.data( );
		
		this._init();
		
    }

	
	//Plugin.prototype = 
	zoomerPlugin.prototype = 
	{
	
		defaults: { 
			zoomLevel : 0,
			minZoom : 0,
			maxZoom : 20,
			zoomSpan : 300,
			
			zoom: false
			//width : 600
		},
		
		
		lang: {
			textSelectAll: function () { return "Select all"; }
		},
		
		_init: function() {
			// Introduce defaults that can be extended either 
			// globally or using an object literal. 
			this.config = $.extend({}, this.defaults, this.options, 
			this.metadata);
			//alert( JSON.stringify( this.lang.textSearching() ) )


			var self = this
			
			
			
			self._onImgLoad(self.$elem, function(img){
			
				
				
				
				
				var w0 = img.width
				var h0 = img.height
				
				var w1 = self.$elem.width();
				var h1 = self.$elem.height();
				
				var w2 = self.$elem.parent().width();
				var h2 = self.$elem.parent().height();
				
				var w3 = self.$elem.css('width');
				
				self.$elem.attr('width', w0 ) 
				self.$elem.attr('height', h0 ) 
					
				
				//var w2 = self.$elem.parent().width();
				
				
				var origW = w1
				var origH = h1
				
				self.equalWidth = false
				if(w1 >= w2)
				{
					self.equalWidth = true
					
					//if (w1 > w2)
					self.$elem.width(w2);
					
					origW = w2
					//origH = h2
				}
				//else 
				
				console.log( w0 + ' - ' + w1 + ' - ' + w2 + ' - ' + w3 )
				
				
				var wrapp = $("<div class='zwrp' style='position:relative;overflow:hidden;'></div>")
				//var wrapp = $("<div class='zwrp' style='position:relative; border:3px solid red;z-index:999'> </div>")
				
				self.minWidth = self.$elem.width()
				
				self.$elem.wrap(wrapp)

				
				self.image = self.$elem
				//this.image.css('position','absolute')			
				self.image.css('position','absolute')			
				self.image.css('max-width','none')	
				
				self.image.before("<div class='slider' style='position:absolute; z-index:1; width:20%;'><input style='width:100%; margin:0; padding:0;' type='range' min='"+self.config.minZoom+"' max='"+self.config.maxZoom+"' value='"+self.config.zoomLevel+"' /></div>")
				
				self.$elem = self.image.closest('div')		
				self.$elem.width( origW )
				self.$elem.height( origH )				
				//this.image.css('opacity','.5')
				//this.imageWidth = this.$elem.width()			
				//this.imageHeight = this.$elem.height()
				
				if(w0 > w2)
				{
				//self.$elem.width(w2);
				//self.image.width(w2);
				}
				
				
				self.imageOrigWidth = origW			
				self.imageOrigHeight = origH
				
				
				//this.image.css('left','0px')
				
				$(window).resize(function(){
					//alert( self.$elem.closest('div').width() )
					var d = self.$elem.closest('div')
					//self.image.width( d.width() )
					
					
					//var w1 = self.image.width();
					var w2 = self.$elem.parent().width();
					//var w3 = self.image.css('width');
					var width = self.image.width();
					var parentWidth = self.$elem.offsetParent().width();
					var percent = 100*width/parentWidth;
					
					console.log( w1 + ' - ' + w2 + ' - ' + w3 )
					
					//if(w1 >= w2)
					if( self.equalWidth )
					{
					self.image.css( 'width',  w2+'px' )
					self.$elem.css( 'width',  w2+'px' )
					self.$elem.css( 'height', self.image.height() )
					
					self.imageOrigWidth = self.image.width()			
					self.imageOrigHeight = self.image.height()
					
					//self.$elem.find('.slider').width('30%')
					self.setZoom(0)
					//self.zoomOut()
					//self.zoomIn(0)
					//self.zoomOut(0)
					}
					//self.image.css( 'height', 'auto' )
					
				}); 		
				
				//this.image.hide()
				//alert( wrapp.prop('tagName') )
				//alert(wrapp)
				
				
				self.zoomLevel = 0		
				self.zoomCenter = true		
				//alert( this.$elem.width() )
				//alert( this.image.width() )
				//alert( this.$elem.height() )
				//alert( this.image.height() )
				
				var zoomInit = self.config.zoomLevel >= self.config.minZoom ? self.config.zoomLevel : self.config.minZoom
				for(var i = 0; i < zoomInit; i++){
				
					self.zoomIn()
				
				}
				
				//setInterval(function(){	self.zoomIn(); 	},1)	

				
				self._initEvents();
				
				
				return self;
				
				
			})
			
		},
		
		
		_onImgLoad: function ( image, cb )
		{
			var self = this
			var img = new Image;
			//img.src = areaImg;
			
			img.src = ( image[0].getAttribute ? image[0].getAttribute("src") : false) || image[0].src;
			
			img.onload = function() {
				
				cb(img)

			}
			
			
			//_getOrigImgSize : function( img ){
			//var t = new Image();
			//t.src = (img.getAttribute ? img.getAttribute("src") : false) || img.src;
			//return {'w':t.width, 'h':t.height};
			//},
			
		},
		
		_zoom : function(z){
			var self = this	
			
			var zoom = self.config.zoomSpan * z
			var zoomph = zoom/2
			//self.image.width( self.image.width() + zoom )
					
			self.zoomLevel = self.zoomLevel + z
			//if(hRatio <= 0)
			//hRatio = zoomph
			if(typeof self.config.zoom === 'function' )
			self.config.zoom( self.zoomLevel )
			//console.log( self.image.height() )
			//console.log( self.imageHeight )
			//console.log( hRatio )
			
			
			//self.config.zoom = self.zoomLevel
			//self.image.css( 'margin-top', '-'+hRatio+'px' )
			//self.image.css( 'margin-left', '-'+hRatio+'px' )
			var width = self.image.width() + zoom
			var left = '-='+zoomph 
			var top = '-='+zoomph 
			
			
			self._setZoom( width, top, left, self.zoomLevel )
			
			
		},
		
		
		_setZoom : function(w,t,l,lv){
			var self = this	
			
			self.image.width( w )
			
			if(self.zoomCenter && lv>0)
			{
				var hRatio = ( self.image.height() - self.imageOrigHeight ) / 2
				t = '-'+hRatio
			}
			
			self.image.css( 'margin-top', t+'px' )
			self.image.css( 'margin-left', l+'px' )
			self.zoomLevel = lv
			self.$elem.find(".slider input").val( self.zoomLevel )					
		},
		
		
		setZoom : function(zoom){
			var self = this	
			
			//self.image.width( self.imageOrigWidth )
			//self.image.css( 'margin-top', '0px' )
			//self.image.css( 'margin-left', '0px' )
			//self.zoomLevel = 0
			//self._setZoom( self.imageOrigWidth, 0, 0, 0 )
			
			self.resetZoom()
			
			for(var i = 0; i < zoom; i++){
			
				self.zoomIn()
			
			}
			
			
		},
		
		resetZoom : function(){
			var self = this	
		
			self._setZoom( self.imageOrigWidth, 0, 0, 0 )
			
		},
		
		
		
		zoomIn : function(){
			var self = this	
			
			if( self.zoomLevel < self.config.maxZoom )
			{
			
				//self.zoomLevel ++
				//self.config.zoom ++
				
				
				
				self._zoom( 1 )
				
				this.image.css('cursor','move')
			}
			
		},
		
		
		zoomOut : function(){
			var self = this	
			
			if(self.minWidth < self.image.width() && self.zoomLevel > self.config.minZoom )
			{
				
				//self.zoomLevel --
				
				//self.$elem.find(".slider input").val( self.zoomLevel )
				
				self._zoom( -1 )
			
				
			
				//console.log( self.zoomLevel )
				
				var ml  = 1 * self.image.css( 'margin-left' ).replace("px", "")
				var mt  = 1 * self.image.css( 'margin-top' ).replace("px", "")
				//console.log(  mt )
				if(mt >=0 )
				self.image.css( 'margin-top', '0px' )
				if(ml >=0 )
				self.image.css( 'margin-left', '0px' )
				
				
				var rw = (self.imageOrigWidth - self.image.width())
				var rh = (self.imageOrigHeight - self.image.height())
				//var move = x 
				if( ml <= rw )
				self.image.css( 'margin-left', rw+'px' )
				if( mt <= rh )
				self.image.css( 'margin-top', rh+'px' )
				
				if(self.zoomLevel == 0)
				{
				this.image.css('cursor','default')
				self.zoomCenter = true
				}
				//console.log(ml)
				//console.log(rw)
			}
					
			
		},
		
		
		
		slds : function(){
			var self = this	
			
			
			
			setInterval(function(){	self.zoomIn()	},1)	
			
		},
		
		_initEvents : function(){
			var self = this	

			
			self.$elem.on('change', '.slider input', function (e) {

				var val = $(this).val()
				
				//alert(val)
				
				return false;

			})
			
			
			self.$elem.on('input', '.slider input', function (e) {
				
				
				var val = 1 * $(this).val()
				
				if(val > self.zoomLevel)
				self.zoomIn()
				else if(val < self.zoomLevel)
				self.zoomOut()
				//self.
				//if(val )
				console.log(val)
				
				return false;

			})

			self.image.on('dragstart', function (e) {
			   
			   self.zoomCenter = false
			   //alert(4)
					//console.log( e.pageX )
			   
			   return false;

			})

			self.image.bind('mousewheel DOMMouseScroll', function(event) {
			 

				event.preventDefault();
				if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
					// scroll up
					self.zoomIn( )
					
				}
				else {
					// scroll down
					self.zoomOut( )
				}	

				
				
						
				//console.log(self.zoomLevel)
			}); 
			

			//var pos = self.$elem.position();
			//var pos = self.$elem.offset();
			//alert(pos.left)

			var $dragging = null;

		
			
			//self.image.on("mousemove", function(e) {
			 self.image.on("mousemove", function(e) {
				if ($dragging)
				{
					//moveXY(e.pageX,e.pageY, e.clientX,  e.clientY)
					moveXY(e.pageX,e.pageY)
					//console.log( e.pageX )
					//console.log( JSON.stringify( e ) )
				}
			});
			
			
			
			var posX = null
			var posY = null
				
		   self.image.on("mousedown",function (e) {
				$dragging = $(e.target);
				
				var ml  = 1 * self.image.css( 'margin-left' ).replace("px", "")
				var mt  = 1 * self.image.css( 'margin-top' ).replace("px", "")
				posX = e.pageX - ml
				posY = e.pageY - mt
				
				//alert(posX)
				
			});
			
			//self.image.on("mouseup", function (e) {
			 $(document).on("mouseup", function (e) {
				$dragging = null;
				posX = null
				posY = null
			});	

			//var ml = 0
			
			function moveXY(x, y, x2, y2)
			{
							
				//var move = x - ( rw / 1.5 )
				var movex = x - posX 
				var movey = y - posY 
				//if(movex)
				
				var rw = (self.imageOrigWidth - self.image.width())
				var rh = (self.imageOrigHeight - self.image.height())
				//var move = x 
				//if(movex < 0 && movex > rw )
				if(movex < 0 && movex > rw )
				self.elem.style.marginLeft = (movex) + 'px';
				
				if(movey < 0 && movey > rh )
				self.elem.style.marginTop = (movey) + 'px';
				
				
				//console.log(hl)
				//console.log(movex)
			}
			
			
			
			
			
			
			return;


			
			
			
				
			
		
		}
		
		



	}
	
    // You don't need to change something below:
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (ie. a function whose name doesn't start
    // with an underscore) to be called via the jQuery plugin,
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    $.fn[pluginName] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_' + pluginName)) {
					
                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new zoomerPlugin( this, options ));
                }
            });

        // If the first parameter is a string and it doesn't start
        // with an underscore or "contains" the `init`-function,
        // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			
            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof zoomerPlugin && typeof instance[options] === 'function') {
					//alert( options )
                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                  $.data(this, 'plugin_' + pluginName, null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

}(jQuery, window, document));
