/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Report Methods */
/*****************************************************************************/

var log = AppLogger.getLogger(AppLogger.loggerName.REPORT_PROBLEM_LOGGER);

Meteor.methods({
    '/report': function (request) {
        var self = this;
        log.info("/report", request);
        var reportWrapper = new AppWrapper.ReportWrapper();
        return reportWrapper.report(request);
    }
});
