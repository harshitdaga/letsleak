/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* SeeAllNotification: Event Handlers and Helpers */
/*****************************************************************************/
Template.SeeAllNotification.events({
    'click #markAsRead' : function(event, selector){
        var notificationId = event.currentTarget.value;
        notification.read(notificationId);
    },
    'click #markAllAsRead' : function(event, selector){
        notification.readAll(selector);
    }
});

Template.SeeAllNotification.helpers({
    allNotification : function(){
        return AppCollection.Notification.getAllNotification();
    },
    isAnyUnreadNotification : function(){
         if(AppCollection.Notification.getUnreadNotification().count() != 0){
             log.debug("isAnyUnreadNotification exist an unread notification");
             App.extensions._toggleDisableButton(notification.templateName,"markAllAsRead",false);
         }else {
             log.debug("isAnyUnreadNotification no an unread notification");
             App.extensions._toggleDisableButton(notification.templateName,"markAllAsRead",true);
         }
    }
});

/*****************************************************************************/
/* SeeAllNotification: Helper Model */
/*****************************************************************************/
function SeeAllNotificationModal(){}

SeeAllNotificationModal.prototype = {
    constructor: SeeAllNotificationModal,
    templateName: "seeAllNotificationTemplate",
    errorPrefix : "seeAllNotification",

    read : function(notificationId){
        log.debug("read notificationId:"+notificationId);
        App.extensions._call("/notification/read", { "notificationId" :notificationId, timestamp: new Date().getTime()}, function (error, result) {
            log.debug("/notification/read error : " +notificationId + AppCommon._toJSON(error) + " result : " + AppCommon._toJSON(result));
            if(error) {
                notification.showError(error);
            }
        });
    },

    readAll : function(){
        log.debug("readAll notification");
        App.extensions._toggleDisableButton(notification.templateName, "markAllAsRead" , true);
        App.extensions._call("/notification/readAll",{},function (error, result) {
            log.debug("/notification/read error : " + AppCommon._toJSON(error) + " result : " + AppCommon._toJSON(result));
            //$("#"+notification.templateName + " #markAllAsRead").removeClass("disabled");
            App.extensions._toggleDisableButton(notification.templateName, "markAllAsRead" , false);
            if(error) {
                notification.showError(error);
            }
        });
    },

    showError : function(error){
        var errors = new AppClass.GenericError();
        errors.showCustomFadeOutBlockError(this.templateName, this.errorPrefix,{"fadeOutTime" : 8000});
    }
};
var log = new AppLogger("SeeAllNotification");
var notification = new SeeAllNotificationModal();

/*****************************************************************************/
/* SeeAllNotification: Lifecycle Hooks */
/*****************************************************************************/
Template.SeeAllNotification.created = function () {
};

Template.SeeAllNotification.rendered = function () {

};

Template.SeeAllNotification.destroyed = function () {
    AppCollection.Notification.remove();
};
