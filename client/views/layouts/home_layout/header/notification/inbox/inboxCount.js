/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* InboxCount: Event Handlers and Helpers */
/*****************************************************************************/
Template.InboxCount.events({
});

Template.InboxCount.helpers({
    mailExist : function(){
        return AppCollection.Notification.getUnreadInboxCount() > 0;
    },
    unreadInboxCount: function () {
        return AppCollection.Notification.getUnreadInboxCount();
    }
});

/*****************************************************************************/
/* InboxCount: Lifecycle Hooks */
/*****************************************************************************/
Template.InboxCount.created = function () {
};

Template.InboxCount.rendered = function () {
};

Template.InboxCount.destroyed = function () {
};
