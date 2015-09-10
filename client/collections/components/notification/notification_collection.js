/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var Notification = new Meteor.Collection('c_notification_instant');

Notification.getUnreadNotification = function () {
    return Notification.find({
        "f_archived" : false
    }, {
        sort: { "f_message.f_event_timestamp" : -1}
    });
};

Notification.getAllNotification = function () {
    var userId = App.extensions._getUserId();
    var options = {
        sort : {
            "f_timestamp" : -1
        },
        limit: 20,
        fields: {
            f_userId: 0
        }
    };
    return Notification.find({}, options);
};

Notification.getUnreadInboxCount = function(){
    var inboxData = AppCollection.Notification.findOne({"f_notify_type" : "INBOX"});
    return _.isUndefined(inboxData) ? 0 : inboxData.f_inbox_count;
}

_.extend(AppCollection, {
    Notification: Notification
});