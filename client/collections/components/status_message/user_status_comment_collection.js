/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var UserStatusComment = new Meteor.Collection('c_user_status_comment');

UserStatusComment.byUser = function (postId, commentId) {
    var userComment = this.getStatusComment(postId);
    if (!AppCommon._isEmpty(userComment)) {
        return userComment.commentList.indexOf(commentId) != -1;
    }
    return false;
};

UserStatusComment.getCommentArray = function () {
    console.error("refacotr");
    var user_id = App.extensions._getUserId();
    var userComment = this.getStatusComment();
    return AppCommon._isEmpty(userComment) ? undefined : userComment.commentList;
};

UserStatusComment.getStatusComment = function (postId) {
    var userId = App.extensions._getUserId();
    return UserStatusComment.findOne(
        {
            $and: [
                {"userId": userId},
                {"postId": postId}
            ]
        }
    );
};

_.extend(AppCollection, {
    UserStatusComment: UserStatusComment
});
