/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* HomeLayout: Event Handlers and Helpers */
/*****************************************************************************/
Template.HomeLayout.events({
    /*
     * Example:
     *  'click .selector': function (e, tmpl) {
     *
     *  }
     */
});

Template.HomeLayout.helpers({
    /*
     * Example:
     *  items: function () {
     *    return Items.find();
     *  }
     */
    getUsername: function () {
        return App.extensions._getUserId();
    }
});

/*****************************************************************************/
/* HomeLayout: Lifecycle Hooks */
/*****************************************************************************/
Template.HomeLayout.created = function () {
//    $(window).on("orientationchange",function(event){
//        //alert(event.orientation);
//        var orientation = event.orientation;
//        orientation = AppCommon._isEmpty(orientation) ? orientation : orientation.toLowerCase();
//        if(_.isEqual("landscape", orientation)){
//            navigator.screenOrientation.set('portrait');
//        }
//    });
//
//

   /* $(window).bind('orientationchange resize', function(event){
        if (event.orientation) {
            if (event.orientation == 'landscape') {
                if (window.rotation == 90) {
                    rotate(this, -90);
                } else {
                    rotate(this, 90);
                }


                if(window.innerHeight > window.innerWidth){
                    document.getElementsByTagName("body").style.transform = "rotate(90deg)";
                }
            }
        }
    });
*/

};

Template.HomeLayout.rendered = function () {
    $("#username").text(App.extensions._getUserId());
    $('input').attr('autocomplete','off');
    //$.mobile.zoom.disable();
};

Template.HomeLayout.destroyed = function () {
};


/*
function rotate(el, degs) {
    iedegs = degs/90;
    if (iedegs < 0) iedegs += 4;
    transform = 'rotate('+degs+'deg)';
    iefilter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+iedegs+')';
    styles = {
        transform: transform,
        '-webkit-transform': transform,
        '-moz-transform': transform,
        '-o-transform': transform,
        filter: iefilter,
        '-ms-filter': iefilter
    };
    $(el).css(styles);
    //alert(styles);
}*/
