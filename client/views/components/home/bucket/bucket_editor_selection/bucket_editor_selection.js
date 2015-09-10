/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* BucketEditorSelection: Event Handlers and Helpers */
/*****************************************************************************/
Template.BucketEditorSelection.events({
    'click #followButton': function (event, selector) {
        bucketEditorSelection.hideErrors();
        bucketEditorSelection.followBucket(event, selector, "FOLLOW");
    },
    'click #unFollowButton': function (event, selector) {
        bucketEditorSelection.hideErrors();
        bucketEditorSelection.followBucket(event, selector, "UNFOLLOW");
    },
    'click #bucketInsightButton': function (event, selector) {
        Router.go("bucket.insight", {_id: event.currentTarget.value});
    }

});

Template.BucketEditorSelection.helpers({
    bucketList: function () {
        return AppCollection.Bucket.getEditorSelection();
    },
    isUserBucket: function (userId) {
        return userId && _.isEqual(userId, App.extensions._getUserId());
    },
    isFollowing: function (bucketId) {
        return AppCollection.UserBucket.isUserFollowingBucket(bucketId);
    },
    isFollowed: function (bucketId, buttonValue) {
        var result = AppCollection.UserBucket.isUserFollowingBucket(bucketId);
        if (buttonValue && _.isEqual(buttonValue.toLowerCase(), "followbutton")) {
            return result ? "hide" : "show";
        }
        else if (buttonValue && _.isEqual(buttonValue.toLowerCase(), "unfollowbutton")) {
            return result ? "show" : "hide";
        }
    },
    postCount: function (bucketId) {
        return AppCollection.Bucket.getPostIdList(bucketId).length;
    },
    attachToolTip: function () {
        $("[data-toggle='tooltip']").tooltip();
    }
});

/*****************************************************************************/
/* BucketEditorSelection: Helper Model */
/*****************************************************************************/
function BucketEditorSelection() {
}

BucketEditorSelection.prototype = {
    constructor: BucketEditorSelection,
    templateName: "bucketEditorSelectionTemplate",
    errorPrefix: "bucketEditorSelection",

    followBucket: function (event, selector, action) {
        var self = selector;
        var bucketId = event.currentTarget.getAttribute("bucket");
        if (action && _.isEqual(action, "FOLLOW")) {
            App.extensions._toggleDisableButton(bucketEditorSelection.templateName, bucketId+" #followButton" , true);
            App.extensions._call("/bucket/followBucket", bucketId, function (error, result) {
                App.extensions._toggleDisableButton(bucketEditorSelection.templateName, bucketId+" #followButton" , false);
                log.debug("followBucketHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
                if (error) {
                    log.error("followBucketHandler error:" + AppCommon._toJSON(error));
                    var errors = new AppClass.GenericError();
                    errors.showBlockError(bucketEditorSelection.templateName, bucketEditorSelection.errorPrefix, "BF_101");
                }
            });
        }
        else if (action && _.isEqual(action, "UNFOLLOW")) {
            App.extensions._toggleDisableButton(bucketEditorSelection.templateName, bucketId+" #unFollowButton" , true);
            App.extensions._call("/bucket/unFollowBucket", bucketId, function (error, result) {
                App.extensions._toggleDisableButton(bucketEditorSelection.templateName, bucketId+" #unFollowButton" , false);
                log.debug("unFollowBucketHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
                if (error) {
                    log.error("unFollowBucketHandler error:" + AppCommon._toJSON(error));
                    var errors = new AppClass.GenericError();
                    errors.showBlockError(bucketEditorSelection.templateName, bucketEditorSelection.errorPrefix, "BUF_101");
                }
            });
        }
    },

    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var bucketEditorSelection = new BucketEditorSelection();
var log = new AppLogger("BucketEditorSelection");
/*****************************************************************************/
/* BucketEditorSelection: Lifecycle Hooks */
/*****************************************************************************/
Template.BucketEditorSelection.created = function () {
};

Template.BucketEditorSelection.rendered = function () {

};

Template.BucketEditorSelection.destroyed = function () {
    $("[data-toggle='tooltip']").tooltip('destroy');
};
