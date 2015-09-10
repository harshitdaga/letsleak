/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* StatusMessage: Event Handlers and Helpers */
/*****************************************************************************/
Template.StatusMessage.events({
    'click #addToBucketButton': function (event, selector) {
        statusMessage.hideErrors();
        Template.AddToBucket._showAddToBucketModal(event, selector);
    },
    'click #deletePostButton': function (event, selector) {
        statusMessage.hideErrors();
        $("#"+statusMessage.templateName+ " #deleteStatusModal").modal("show");
    }
});

Template.StatusMessage.helpers({
    postFetchStatus: function () {
        log.debug(Session.get("postFetchedStatus"));
        return Session.get("postFetchedStatus");
    },

    getMessage: function () {
        var self = this;
        return AppCollection.Local.findOne({ _id: self.postId}).f_message;
    },

    getTimestamp: function () {
        var self = this;
        return AppCollection.Local.findOne({ _id: self.postId}).f_timestamp;
    },

    isCommentAllowed: function () {
        var self = this;
        var message = AppCollection.Local.findOne({ _id: self.postId});
        if (!AppCommon._isEmpty(message)) {
            return message.f_isCommentAllowed ? true : false;
        }
        return false;
    },

    getColor: function () {
        return Session.get("postColor");
    },

    isNotPostAuthor: function (postId) {
        var post = AppCollection.Local.findOne({"_id": postId});
        var result = true;
        if (post) {
            result = _.isEqual(post.f_author, App.extensions._getUserId());
        }
        return !result;
    },

    isPostAuthor: function () {
        var postId = this.postId;
        var post = AppCollection.Local.findOne({"_id": postId});
        var result = true;
        if (post) {
            result = _.isEqual(post.f_author, App.extensions._getUserId());
        }
        return result;
    },
    isExpires : function(){
        var postId = this.postId;
        var post = AppCollection.Local.findOne({"_id": postId});
        if(post){
            return post.f_expires;
        }
    },
    expiryTime : function(){
        var postId = this.postId;
        var post = AppCollection.Local.findOne({"_id": postId});
        if(post){
            return post.f_expiryTime;
        }
    },
    addExpiryTimer : function(){
        var postId = this.postId;
        var post = AppCollection.Local.findOne({"_id": postId});
        var expiryTime = post.f_expiryTime;
        var timeRemaining = expiryTime - Date.now();

        if(timeRemaining<0){
            timeRemaining = 0;
        }
        Meteor.setTimeout(function () {
            Session.set("postFetchedStatus","POST_NO_LONGER_EXIST");
            Session.set("postColor", "white");
        }, timeRemaining);
    }
});

/*****************************************************************************/
/* StatusMessage: Helper Model */
/*****************************************************************************/
function StatusMessageModel() {
}

StatusMessageModel.prototype = {
    constructor: StatusMessageModel,
    templateName: "statusMessageTemplate",
    errorPrefix: "statusMessage",

    deletePost : function(event,selector){
        var postId = event.target.value;
        log.debug("deletePost postId:"+postId);
        App.extensions._call("/status/deletePost", {"postId":postId}, this.deletePostHandler);
    },

    deletePostHandler : function(error, result){
        log.debug("deletePostHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if(error){
            log.error("deletePostHandler :" + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            errors.showCustomBlockError(statusMessage.templateName, statusMessage.errorPrefix, error.error);
        }
    },
    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var statusMessage = new StatusMessageModel();
var log = new AppLogger("StatusMessage");
/*****************************************************************************/
/* StatusMessage: Lifecycle Hooks */
/*****************************************************************************/
Template.StatusMessage.created = function () {
};

Template.StatusMessage.rendered = function () {
    Session.setDefault("postColor", "white");
};

Template.StatusMessage.destroyed = function () {
    AppCollection.Local.remove({});
    AppCollection.StatusMeta.remove();
    AppCollection.StatusComment.remove();
    AppCollection.UserStatusComment.remove();
    App.extensions._deleteSessionKeys(["postColor","postFetchedStatus"]);
};