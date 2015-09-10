/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* StatusLikeUnlike: Event Handlers and Helpers */
/*****************************************************************************/
Template.StatusLikeUnlike.events({
    "click #like": function (event, selector) {
        statusLikeUnlike.hideErrors();
        statusLikeUnlike.likeUnlike(event, selector, "ADD");
    },
    "click #unlike": function (event, selector) {
        statusLikeUnlike.hideErrors();
        statusLikeUnlike.likeUnlike(event, selector, "DELETE");
    }
});

Template.StatusLikeUnlike.helpers({
    getLikeCount: function (postId) {
        var result = AppCollection.StatusMeta.likeCount(postId);
        return _.isUndefined(result) ? 0 : result.likeCount;
    },

    isLiked: function (postId, option) {
        var self = this;

        //When updating like/unlike if we get an exception from server we wont be able
        //to know the postId thus it will be hard for us to find the elements which contain
        //like/unlike button. Thus we use Sessions which acts as a reload button
        //whenever likeUnlikeHandler recieves an error from server.
        var lastUpdated = Session.get("lastUpdated");
        $("#" + statusLikeUnlike.templateName + " #" + self.postId + " .btn").removeClass('disabled');
        var isLiked = AppCollection.UserStatusMeta.isLiked(self.postId);
        var classValue = "hide";
        switch (option) {
            case "like" :
                classValue = isLiked ? "hide" : "show";
                break;
            case "unlike" :
                classValue = !isLiked ? "hide" : "show";
                break;
        }
        return classValue;
    },

    init: function (parentTemplateName, errorPrefix) {
        statusLikeUnlike.parentTemplateName = parentTemplateName;
        statusLikeUnlike.errorPrefix = errorPrefix;
        Session.setDefault("lastUpdated", new Date());
    }
});

/*****************************************************************************/
/* statusLikeUnlike: Helper Model */
/*****************************************************************************/
function StatusLikeUnlikeModel() {
}

StatusLikeUnlikeModel.prototype = {
    constructor: StatusLikeUnlikeModel,
    templateName: "statusLikeUnlikeTemplate",

    //this template trys to find the parent error div,
    //and this value is populated at time of template rendering using init method
    errorPrefix: "",
    parentTemplateName: "",

    likeUnlike: function (event, selector, type) {
        var data = new AppClass.StatusMeta(selector.data.postId);
        switch (type) {
            case "ADD" :
                data.action = data.actions.ADD;
                break;
            case "DELETE" :
                data.action = data.actions.DELETE;
                break;
        }
        log.debug("like/unlike data:" + AppCommon._toJSON(data));
        selector.$(".btn").addClass('disabled');
        App.extensions._call("/status/updateMeta", data, this.likeUnlikeHandler);
    },

    likeUnlikeHandler: function (error, result) {
        log.debug("likeUnlikeHandler error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            log.error("likeUnlikeHandler : " + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            errors.showCustomBlockError(statusLikeUnlike.parentTemplateName, statusLikeUnlike.errorPrefix, error.error);
            Session.set("lastUpdated", new Date());
            return;
        }
        $("#" + statusLikeUnlike.templateName + " #" + result.postId + " .btn").removeClass('disabled');
        $("#" + statusLikeUnlike.templateName + " #" + result.postId + " #like").toggle();
        $("#" + statusLikeUnlike.templateName + " #" + result.postId + " #unlike").toggle();
    },

    hideErrors: function () {
        $("#" + this.parentTemplateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var statusLikeUnlike = new StatusLikeUnlikeModel();
var log = new AppLogger("statusLikeUnlike");

/*****************************************************************************/
/* StatusLikeUnlike: Lifecycle Hooks */
/*****************************************************************************/
Template.StatusLikeUnlike.created = function () {
};

Template.StatusLikeUnlike.rendered = function () {
};

Template.StatusLikeUnlike.destroyed = function () {
    delete Session.keys['lastUpdated'];
};
