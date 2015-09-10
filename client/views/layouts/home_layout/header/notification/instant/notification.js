/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Notification: Event Handlers and Helpers */
/*****************************************************************************/
Template.Notification.events({
    'click .dropdown-menu': function (event, selector) {
        event.stopPropagation();
    },
    'click #markAsRead' : function(event, selector){
        notification.read(event.currentTarget.value);
    },
    'click #markAllAsRead' : function(event, selector){
        //selector.$("#markAllAsRead").addClass("disabled");
        notification.readAll(selector);
    },
    'click #seeAllButton' : function(){
        var $dropDown = $("#instantNotificationDropDown .dropdown-toggle");
        $dropDown.dropdown('toggle');
        Router.go('see.all.notification');
    },
    "click span[action=BUCKET], click span[action=STATUS]" : function(event,selector){
        var _id = $(event.currentTarget).attr("value");
        var action = $(event.currentTarget).attr("action");

        if(!AppCommon._isEmpty(action)){
            action = action.toUpperCase();
            switch (action) {
                case "STATUS" :
                    Router.go("status.message",{"_id" : _id});
                break;
                case "BUCKET" :
                    Router.go("bucket.insight",{"_id" : _id});
                break;
            }
            Template.Notification.toggleNotificationDropDown();
            notification.read($(event.currentTarget).attr("notificaitonId"));
        }

    }
});

Template.Notification.helpers({
    notificationExist: function () {
        return AppCollection.Notification.getUnreadNotification().count() > 0;
    },

    unreadCount: function () {
        return AppCollection.Notification.getUnreadNotification().count();
    },

    unreadNotification: function () {
        return AppCollection.Notification.getUnreadNotification();
    },
    toggleNotificationDropDown : function(){
        $('#instantNotificationDropDown .dropdown-toggle').dropdown('toggle');
    }
});

Template._ReportAbuseNotification.helpers({
    reportAbuseReason: function (abuseCode) {
        log.debug("abuseCode: " + abuseCode + " message:" + AppClass.ReportAbuse.getMessage(abuseCode));
        return AppClass.ReportAbuse.getMessage(abuseCode);
    }
});

function NotificationModal() {
}

NotificationModal.prototype = {
    constructor: NotificationModal,
    templateName: "notificationTemplate",
    errorPrefix : "notification",

    read : function(notificationId){
        log.debug("read notificationId:"+notificationId);
        App.extensions._call("/notification/read", { "notificationId" :notificationId, timestamp: new Date().getTime()}, function (error, result) {
         log.debug("/notification/read error : " + AppCommon._toJSON(error) + " result : " + AppCommon._toJSON(result));
            if(error) {
                notification.showError(error);
            }
        });
    },

    readAll : function(selector){
        var self = selector;
        log.debug("readAll notification");
        App.extensions._toggleDisableButton(notification.templateName, "markAllAsRead" , true);
        App.extensions._call("/notification/readAll",{},function (error, result) {
            log.debug("/notification/read error : " + AppCommon._toJSON(error) + " result : " + AppCommon._toJSON(result));
            //self.$("#markAllAsRead").removeClass("disabled");
            App.extensions._toggleDisableButton(notification.templateName, "markAllAsRead" , false);
            if(error) {
                notification.showError(error);
            }
        });
    },
    showError : function(error){
        var errors = new AppClass.GenericError();
        errors.showCustomFadeOutBlockError(this.templateName, this.errorPrefix,{"fadeOutTime" : 5000});
    },

    init : function(){
        $('#instantNotificationDropDown').on('shown.bs.dropdown', function () {
            //if notification exist
            if(AppCollection.Notification.getUnreadNotification().count() > 0){
                var toolbox = $(this).find("ul"),
                    height = toolbox.height(),
                    scrollHeight = toolbox.get(0).scrollHeight;

                toolbox.bind('mousewheel', function(e, d) {
                    if((this.scrollTop === (scrollHeight - height) && d < 0) || (this.scrollTop === 0 && d > 0)) {
                        e.preventDefault();
                    }
                });
            }
        });
    }
};
var log = new AppLogger("Notification");
var notification = new NotificationModal();

/*****************************************************************************/
/* Notification: Lifecycle Hooks */
/*****************************************************************************/
Template.Notification.created = function () {
};

Template.Notification.rendered = function () {
    notification.init();

};

Template.Notification.destroyed = function () {
};
