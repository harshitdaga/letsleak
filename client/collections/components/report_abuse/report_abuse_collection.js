/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var ReportAbuse = new Meteor.Collection('c_report_abuse');

/*
 * Add query methods
 */
/*
 ReportAbuse.reportCount = function (postId) {
 var result = ReportAbuse.findOne({ "_id": postId});
 return  AppCommon._isEmpty(result) ? 0 : result.count;
 };
 */

_.extend(AppCollection, {
    ReportAbuse: ReportAbuse
});

