/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var UserBucket = new Meteor.Collection('c_user_bucket');

UserBucket.getUserFollowingBucket = function () {
    return UserBucket.findOne({
        "f_userId": App.extensions._getUserId()
    });
};

UserBucket.isUserFollowingBucket = function (bucketId) {
    var userBucket = UserBucket.getUserFollowingBucket();
    if (userBucket) {
        var list = userBucket && userBucket.f_bucket_id_list;
        return list.indexOf(bucketId) != -1;
    }
    return false;
};

_.extend(AppCollection, {
    UserBucket: UserBucket
});
