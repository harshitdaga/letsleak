/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* StatusComment: Event Handlers and Helpers */
/*****************************************************************************/
Template.StatusComment.events({
    "click #postComment": function (event, selector) {
        comment.hideErrors();
        comment.postComment(event, selector);

    },
    "click #deleteComment": function (event, selector) {
        comment.hideErrors();
        comment.deleteComment(event, selector);
    },

    "focusout #commentText": function (event, selector) {
        var errors = new AppClass.GenericError();
        var commentText = selector.$("#commentText").val().trim();
        if (commentText && commentText.length > 0) {
            errors.removeElementError("commentText", comment.templateName);
        }
    },

    "click #commentsPanel" : function(event,selector){
        var id = event.target.id;
        var activeId = id;
        var otherId = _.isEqual(activeId,"publicTab") ? "privateTab" : "publicTab";
        $("#commentsPanel #"+activeId).parent().find("i").removeClass("hide");
        $("#commentsPanel #"+otherId).parent().find("i").addClass("hide");
        var i = 1;
    }
});

Template.StatusComment.helpers({
    getPublicComments: function () {
        var self = this;
        return AppCollection.StatusComment.getPublicComment(self.postId);
    },

    getPrivateComments: function () {
        var self = this;
        return AppCollection.StatusComment.getPrivateComment(self.postId);
    },

    isPostAuthor: function () {
        var self = this;
        return comment.isPostAuthor(self.postId);
    },

    isNotPostAuthor: function () {
        var self = this;
        return !comment.isPostAuthor(self.postId);
    },

    showDeleteOption: function () {
        var self = this;
        var isCommentAuthor = AppCollection.UserStatusComment.byUser(self.f_postId, self._id);
        return isCommentAuthor || comment.isPostAuthor(self.f_postId);
    }
});

/*****************************************************************************/
/* StatusMessageComment : Helper Model */
/*****************************************************************************/
function CommentModel() {
}

CommentModel.prototype = {
    constructor: CommentModel,
    templateName: "statusCommentTemplate",
    errorPrefix: "statusComment",

    postComment: function (event, selector) {
        //TODO validate comment
        var comment = selector.$("#commentText").val().trim();
        var byAuthor = AppCollection.UserStatus.isPostAuthor();
        var type = selector.$("#commentType option:selected").val();

        var data = new AppClass.Comment(selector.data.postId, comment, byAuthor, type, AppClass.Comment.prototype.actions.ADD);

        var errors = new AppClass.GenericError();
        if (AppCommon._isEmpty(comment)) {
            errors.add("C_101", "commentText");
        }
        if (comment && comment.length > 150) {
            errors.add("C_103", "commentText");
        }
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, this.templateName);
            return;
        }

        $("#postComment").addClass('disabled');
        log.debug("postComment data:" + AppCommon._toJSON(data));
        App.extensions._call("/status/postComment", data, this.postCommentHandler);
    },

    postCommentHandler: function (error, result) {
        log.debug("postCommentHandler error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        $("#postComment").removeClass('disabled');
        if (error) {
            log.error("postCommentHandler : " + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            var validError = ["C_101", "C_102", "C_103","PS_1006"];
            if (validError.indexOf(error.error) != -1) {
                errors.showBlockError(comment.templateName, comment.errorPrefix, error.error);
            } else {
                errors.showCustomBlockError(comment.templateName, comment.errorPrefix, error.error);
            }
            if(_.isEqual(error.error, "PS_1006")){
                comment.clear();
            }
            return;
        }
        comment.clear();
    },

    deleteComment: function (event, selector) {
        //TODO show alert box
        var self = selector;
        var data = new AppClass.Comment(self.data.postId, null, null, null, AppClass.Comment.prototype.actions.DELETE);
        data.commentId = event.currentTarget.value;
        log.debug("deleteComment data " + AppCommon._toJSON(data));
        App.extensions._call("/status/deleteComment", data, this.deleteCommentHandler);
    },

    deleteCommentHandler: function (error, result) {
        log.debug("deleteCommentHandler error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            log.error("deleteCommentHandler :" + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            var validError = [];
            if (validError.indexOf(error.error) != -1) {
                errors.showBlockError(comment.templateName, comment.errorPrefix, error.error);
            } else {
                errors.showCustomBlockError(comment.templateName, comment.errorPrefix, error.error);
            }
        }
    },

    isPostAuthor: function (postId) {
        var post = AppCollection.Local.findOne({"_id": postId});
        if (post) {
            return _.isEqual(post.f_author, App.extensions._getUserId());
        }
        return false;
    },

    clear : function(){
        var self = this;
        $("#" + self.templateName + " #commentText").val("");
    },

    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var comment = new CommentModel();
var log = new AppLogger("StatusMessageComment");
/*****************************************************************************/
/* StatusComment: Lifecycle Hooks */
/*****************************************************************************/
Template.StatusComment.created = function () {

};

Template.StatusComment.rendered = function () {
};

Template.StatusComment.destroyed = function () {
};
