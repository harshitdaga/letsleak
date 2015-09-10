/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var StatusMeta = new Meteor.Collection('c_status_meta');

/*
 * Add query methods
 */
StatusMeta.likeCount = function (id) {
    return StatusMeta.findOne({"_id": id});
};

_.extend(AppCollection, {
    StatusMeta: StatusMeta
});
