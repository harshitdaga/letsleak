/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* UserBucketList: Event Handlers and Helpers */
/*****************************************************************************/
Template.UserBucketList.events({
    'click #editBucketButton': function (event, selector) {
        Template.UpdateBucketMeta._showUpdateModal(event, selector);
    },
    'click #deleteBucketButton': function (event, selector) {
        Template.DeleteBucket._showDeleteModal(event, selector);
    },
    'click #refreshButton': function (event, selector) {
        userBucket.hideErrors();
        userBucket.getUserBucketList();
    },
    'click #unFollowButton': function (event, selector) {
        userBucket.hideErrors();
        userBucket.unfollowBucket(event, selector);
    },
    'click #postListBucketButton': function (event, selector) {
        var bucketId = event.currentTarget.value;
        Session.set("bucketDataContext", AppCollection.Local.findOne(
            {
                $and: [
                    {"f_local_type": "BUCKET"},
                    {"_id": bucketId}
                ]
            }
        ));
        /*var templateName = "BucketPostList";
         var template = UI.renderWithData(Template[templateName],Session.get("bucketDataContext"));
         var parent = $("#postListModal .modal-content").html("");
         UI.insert(template, parent.get(0));*/
        $("#postListModal").modal('show');
    },

    'mouseenter #userBucketList #created .alterColor': function (event, selector) {
        $(event.currentTarget).addClass('optionsOverlay');
        $(event.currentTarget).find(".options").removeClass("hide");
    },

    'mouseleave #userBucketList #created .alterColor': function (event, selector) {
        $(event.currentTarget).removeClass('optionsOverlay');
        $(event.currentTarget).find(".options").addClass("hide");
    }
});

Template._PrintBucket.helpers({
//    postCount : function(postList){
//        return AppCommon._isEmpty(postList) ? 0 : postList.length;
//    }
});

Template.UserBucketList.helpers({
    getCreateBucketList: function () {
        return AppCollection.Local.find({
            $and: [
                {"f_local_type": "BUCKET"},
                {"f_isUsersCreatedBucket": true}
            ]
        });
    },

    getFollowedBucketList: function () {
        return AppCollection.Local.find({
            $and: [
                {"f_local_type": "BUCKET"},
                {"f_isUsersCreatedBucket": false}
            ]
        });
    },
    _updateUserBucketList: function () {
        userBucket.getUserBucketList(true);
    },
    templateData: function () {
        return {
            "template": "BucketPostList",
            "dataContext": Session.get("bucketDataContext")
        };
    }
});


/*****************************************************************************/
/* UserBucketList: Helper Model */
/*****************************************************************************/
function UserBucketList() {
    //this is a private field that is used to process/not process
    //the error if occurred when fetching user bucket list
    this._silent = false;
}

UserBucketList.prototype = {
    constructor: UserBucketList,
    templateName: "userBucketListTemplate",
    errorPrefix: "userBucketList",

    getUserBucketList: function (silent) {
        log.debug("/UserBucketList/getUserBucketList");
        this._silent = true;
        if (!silent) {
            this._silent = false;
            $("#" + this.templateName + " #userBucketList").addClass("hide");
            $("#" + this.templateName + " #userBucketListWaiting").removeClass("hide");
        }
        //$("#noBucketMessage").hide();
        //$("#bucketList").hide();

        App.extensions._call("/bucket/getUserBuckets", {callerAgent: "USER_BUCKET"}, this.getUserBucketListHandler);
    },

    getUserBucketListHandler: function (error, result) {
        log.debug("/getUserBucketListHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            log.error("/getUserBucketListHandler error:" + AppCommon._toJSON(error));
            if (!userBucket._silent) {
                var errors = new AppClass.GenericError();
                var validError = [];
                if (validError.indexOf(error.error) != -1) {
                    errors.showBlockError(userBucket.templateName, userBucket.errorPrefix, "UBL_101");
                } else {
                    errors.showCustomBlockError(userBucket.templateName, userBucket.errorPrefix, error.error);
                }
            }
            $("#" + userBucket.templateName + " #userBucketListWaiting").addClass("hide");
            return;
        }
        try {
            var bucketList = result.message;
            AppCollection.Local.remove({"f_local_type": "BUCKET"});
            _.each(bucketList, function (item) {
                _.extend(item, {
                    f_local_type: "BUCKET"
                });
                /*try{
                 AppCollection.Local.insert(item);
                 } catch (error){
                 //insert faild because item already present.
                 //So perform update on the same.

                 }*/
                AppCollection.Local.insert(item);
            });
        } catch (err) {
            log.error(err);
        } finally {
            $("#" + userBucket.templateName + " #userBucketListWaiting").addClass("hide");
            $("#" + userBucket.templateName + " #userBucketList").removeClass("hide");
        }
    },

    unfollowBucket: function (event, selector, action) {
        var self = selector;
        var bucketId = event.currentTarget.getAttribute("bucket");
        App.extensions._call("/bucket/unFollowBucket", bucketId, function (error, result) {
            log.debug("unFollowBucketHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
            if (error) {
                log.error("unFollowBucketHandler error:" + AppCommon._toJSON(error));
                var errors = new AppClass.GenericError();
                errors.showBlockError(userBucket.templateName, userBucket.errorPrefix, "BUF_101");
                return;
            }
            AppCollection.Local.remove({"_id": bucketId});
        });
    },

    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    },

    register: function () {
        $("#postListModal").on('hide.bs.modal', function (event) {
            //$("#postListModal #bucketPostList-generic-error").html("");
        });
    }
};
var log = new AppLogger("UserBucketList");
var userBucket = new UserBucketList();

/*****************************************************************************/
/* UserBucketList: Lifecycle Hooks */
/*****************************************************************************/
Template.UserBucketList.created = function () {
    userBucket.getUserBucketList();
};

Template.UserBucketList.rendered = function () {
    Session.setDefault("bucketDataContext", "");
    userBucket.register();
};

Template.UserBucketList.destroyed = function () {
    App.extensions._deleteSessionKeys(["bucketDataContext"]);
};
