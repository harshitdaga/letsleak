/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Index: Event Handlers and Helpers */
/*****************************************************************************/
Template.Index.events({
    "click #knowMoreButton" : function(){
        $(".homeContainer").fadeIn(300,function(){
            $("html,body").animate({scrollTop: $(".homeContainer").offset().top},700);
            return false;
        });
    }
});

Template.Index.helpers({
    /*
     * Example:
     *  items: function () {
     *    return Items.find();
     *  }
     */

});
/*****************************************************************************/
/* Index: Lifecycle Hooks */
/*****************************************************************************/
Template.Index.created = function () {
};

Template.Index.rendered = function () {

};

Template.Index.destroyed = function () {
};


/*********************************/
/* Index: Parallax */
/*********************************/

/**
 * Cache
 */
var $content = $('header .content')
    , $blur    = $('header .overlay')
    , wHeight  = $(window).height();

$(window).on('resize', function(){
    wHeight = $(window).height();
});

/**
 * requestAnimationFrame Shim
 */
window.requestAnimFrame = (function()
{
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * Scroller
 */
function Scroller()
{
    this.latestKnownScrollY = 0;
    this.ticking            = false;
}

Scroller.prototype = {
    /**
     * Initialize
     */
    init: function() {
        window.addEventListener('scroll', this.onScroll.bind(this), false);
    },

    /**
     * Capture Scroll
     */
    onScroll: function() {
        this.latestKnownScrollY = window.scrollY;
        this.requestTick();
    },

    /**
     * Request a Tick
     */
    requestTick: function() {
        if( !this.ticking ) {
            window.requestAnimFrame(this.update.bind(this));
        }
        this.ticking = true;
    },

    /**
     * Update.
     */
    update: function() {
        var currentScrollY = this.latestKnownScrollY;
        this.ticking       = false;

        /**
         * Do The Dirty Work Here
         */
        var slowScroll = currentScrollY / 2
            , blurScroll = currentScrollY * 2;

        $content.css({
            'transform'         : 'translateY(-' + slowScroll + 'px)',
            '-moz-transform'    : 'translateY(-' + slowScroll + 'px)',
            '-webkit-transform' : 'translateY(-' + slowScroll + 'px)'
        });

        $blur.css({
            'opacity' : blurScroll / wHeight
        });
    }
};

/**
 * Attach!
 */
var scroller = new Scroller();
scroller.init();


/**
 * Parallax
 */

(function(){

    var parallax = document.querySelectorAll(".parallax"),
        speed = .9;

    window.onscroll = function(){
        [].slice.call(parallax).forEach(function(el,i){

            var windowYOffset = window.pageYOffset,
                elBackgrounPos = "0 " + (windowYOffset * speed) + "px";

            el.style.backgroundPosition = elBackgrounPos;

        });
    };

})();
