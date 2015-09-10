/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var UserStatusMeta = new Meteor.Collection('c_user_status_meta');

/*
 * Add query methods like this:
 *  UserStatusMeta.findPublic = function () {
 *    return UserStatusMeta.find({is_public: true});
 *  }
 */
UserStatusMeta.isLiked = function (status_id) {
    var userId = App.extensions._getUserId();
    var result = UserStatusMeta.findOne(userId);
    if (result) {
        var likedArray = result.statusLiked;
        return likedArray && likedArray.indexOf(status_id) != -1;
    }
    return false;
};

_.extend(AppCollection, {
    UserStatusMeta: UserStatusMeta
});
