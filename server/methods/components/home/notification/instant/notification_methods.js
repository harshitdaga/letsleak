/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Status Methods */
/*****************************************************************************/
var log = AppLogger.getLogger(AppLogger.loggerName.NOTIFICATION_LOGGER);

//TODO https://groups.google.com/forum/#!topic/meteor-talk/66fyml22itQ
Meteor.methods(App.wrapMethods([AppInterceptor.ValidSession], [], {
    '/notification/read': function (request) {
        log.info("/notification/read", request);
        return AppCollection.NotificationInstant.archive(request.data, request.agent.userId);
    },
    '/notification/readAll': function (request) {
        log.info("/notification/readAll", request);
        return AppCollection.NotificationInstant.archiveAll(request.agent.userId);
    }
}));