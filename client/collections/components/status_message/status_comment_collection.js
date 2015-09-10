/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var StatusComment = new Meteor.Collection('c_status_comment');

/*
 * Add query methods
 */
StatusComment.getPublicComment = function (postId) {
    return StatusComment.find(
        {
            $and: [
                {"f_postId": postId},
                {f_type: "PUBLIC"}
            ]
        },
        {
            sort: { f_timestamp: -1}
        }
    );
};

StatusComment.getPrivateComment = function (postId) {
    return StatusComment.find(
        {
            $and: [
                {"f_postId": postId},
                {f_type: "PRIVATE"}
            ]
        },
        {
            sort: { f_timestamp: -1}
        }
    );
};

StatusComment.filter = function (userCommentArray, status_id) {
    if (!AppCommon._isEmpty(userCommentArray)) {
        var commentCursor = this.allComments(status_id);
        commentCursor.map(function (comment) {
            if (comment.type == "PRIVATE" && userCommentArray.indexOf[comment._id] != -1) {
                //StatusComment.remove({"_id" : comment._id});
            }
        });
    }
};


_.extend(AppCollection, {
    StatusComment: StatusComment
});
