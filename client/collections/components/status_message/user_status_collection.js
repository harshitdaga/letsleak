/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var UserStatus = new Meteor.Collection('c_user_status');

/*
 * Add query methods like this:
 *  UserStatus.findPublic = function () {
 *    return UserStatus.find({is_public: true});
 *  }
 */
UserStatus.isPostAuthor = function (post_id) {
    var result = UserStatus.findOne({"_id": post_id});
    return !AppCommon._isEmpty(result);
};


_.extend(AppCollection, {
    UserStatus: UserStatus
});
