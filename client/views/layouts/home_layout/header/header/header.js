/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Header: Event Handlers and Helpers */
/*****************************************************************************/
Template.Header.events({
    'click #logout': function (event, selector) {
        logout();
    },

    'click #settingsPanelButton': function (event, selector) {
        $("#settings-toggle").toggle("slide");
    },

    'mouseenter .bucketNav' : function (event,selector){
        $("#bucketOption").popover('show');
    },

    'mouseleave .bucketNav' : function(event,selector){
        $("#bucketOption").popover('hide');
    },

    'click #productTour' : function(event,selector){
        Template.Welcome.init();
    }
});

Template.Header.helpers({
    username: function () {
        return App.extensions._getUserId();
    }
});

function logout() {
    App.extensions._call("/logout", "", function (error, result) {
        log.debug("/logout : " + "error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
    });
    App.extensions._logout();
}
var log = new AppLogger("Logout");
/*****************************************************************************/
/* Header: Lifecycle Hooks */
/*****************************************************************************/
Template.Header.created = function () {
};

Template.Header.rendered = function () {
    $("#bucketOption").popover({
        html: true,
        content: $("#bucketPopover #content").html(),
        placement: 'bottom',
        title : "Buckets"
    });
};

Template.Header.destroyed = function () {
};
