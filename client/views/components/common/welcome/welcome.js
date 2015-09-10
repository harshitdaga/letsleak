/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Welcome: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.Welcome.events({
    /*
     * Example:
     *  'click .selector': function (e, tmpl) {
     *
     *  }
     */
});

Template.Welcome.helpers({
    init : function(){
        $("#welcomeTour").modal();
    }
});

var Welcome = function Welcome() {
};
Welcome.prototype = {
    constructor: Welcome,
};
var log = new AppLogger("Welcome");
var welcome = new Welcome();
/*****************************************************************************/
/* Welcome: Lifecycle Hooks */
/*****************************************************************************/
Template.Welcome.created = function () {
};

Template.Welcome.rendered = function () {
    $('.carousel').carousel({
        wrap : false,
        interval : 8000
    });

    var $carosel = $('#carousel-welcome-tour');
    $carosel.on('slid.bs.carousel', function (event) {
        var totalItems = $('.item').length;
        var currentIndex = $('div.active').index() + 1;

        var START = 1;
        var END = totalItems;

        //showing and hiding the navigation arrows when it is on start or end
        if(currentIndex == START ) {
            $(this).find(".left").addClass("hide");
        }else{
            $(this).find(".left").removeClass("hide");
        }

        if(currentIndex == END) {
            $(this).find(".right").addClass("hide");
        }else {
            $(this).find(".right").removeClass("hide");
        }
    });


    $("#welcomeTour").on('shown.bs.modal', function (event) {
        //Making welcome carousle to always start from slide 0
        $('#carousel-welcome-tour').carousel(0);
    });

};

Template.Welcome.destroyed = function () {
};