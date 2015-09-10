/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* AddToBucket: Event Handlers and Helpers */
/*****************************************************************************/
Template.AddToBucket.events({
    'click #addButton': function (event, selector) {
        addToBucket.hideError();
        addToBucket.addToBucket(event, selector);
    },
    'click #refreshButton': function (event, selector) {
        addToBucket.hideError();
        addToBucket.getUserBucketList();
    },

    'change input:checkbox': function (event, selector) {
        addToBucket.hideError();
    }
});

Template.AddToBucket.helpers({

    /*
     //Cannot use this as helper function is getting called twice :-/ #bug same issue in add_update_bucket case
     showButton : function(){
     //if _id is not present that means it is added in feeds template or similar template
     //which only needs modal functionality and calls showAddToBucketModal
     return !AppCommon._isEmpty(this.post_id);
     },
     */
    aBucketExist: function () {
        var bucketItem = AppCollection.Local.findOne({
            "f_local_type": "BUCKET"
        });
        log.debug("aBucketExist :" + !_.isUndefined(bucketItem));
        return !_.isUndefined(bucketItem);
    },

    getUserCreateBucketList: function () {
        return AppCollection.Local.find({
            $and: [
                {"f_local_type": "BUCKET"},
                {"f_isUsersCreatedBucket": true}
            ]
        });
    },

    getUserFollowedBucketList: function () {
        return AppCollection.Local.find({
            $and: [
                {"f_local_type": "BUCKET"},
                {"f_isUsersCreatedBucket": false}
            ]
        });
    },

    _showAddToBucketModal: function (event, selector) {
        var postId = event.currentTarget.value;
        $("#" + addToBucket.templateName + " #postId").val(postId);
        $("#" + addToBucket.templateName + " #addToBucketModal").modal();
        log.debug("show add to bucket modal for postId:" + postId);
    }
});

/*****************************************************************************/
/* AddToBucket: Helper Model */
/*****************************************************************************/
function AddToBucketModel() {
    //this is a private field which stores the status
    //of getUserBucket list operation if its success
    //_bucketFetchError will be false else true.
    //It is used to show technical error whenever
    //addToBucketModal is open.
    this._bucketFetchError = false;

    //this is a private field that is used to process/not process
    //the error if occurred when fetching user bucket list
    this._silent = false;
}

AddToBucketModel.prototype = {
    constructor: AddToBucketModel,
    templateName: "addToBucketTemplate",
    errorPrefix: "addToBucket",

    init: function () {
        this.registerModalOnShow();
        this.registerModalOnHide();
    },

    addToBucket: function (event, selector) {
        var self = this;
        var postId = selector.$("#postId").val();
        var bucketArray = selector.$("#bucketList input:checked");
        var bucketIdList = _.map(bucketArray, function (bucket) {
            return $(bucket).val();
        });

        if (AppCommon._isEmpty(bucketIdList)) {
            var errors = new AppClass.GenericError();
            errors.showBlockError(addToBucket.templateName, addToBucket.errorPrefix, "AB_101");
        }

        var addToBucketRequest = new AppClass.BucketDataRequest(bucketIdList, postId, AppClass.BucketDataRequest.prototype.itemType.STATUS);
        log.debug("addToBucketRequest : " + addToBucketRequest);
        //selector.$("#addButton").addClass("disabled");
        App.extensions._toggleDisableButton(self.templateName, "addButton" , true);
        App.extensions._call("/bucket/addToBucket", addToBucketRequest, this.addToBucketHandler);
    },

    addToBucketHandler: function (error, result) {
        log.debug("/addToBucket error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        //$("#" + addToBucket.templateName + " #addButton").removeClass("disabled");
        App.extensions._toggleDisableButton(addToBucket.templateName, "addButton" , false);
        if (error) {
            log.error("/addToBucket error:" + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            var validError = ["AB_101", "AB_1002"];
            if (validError.indexOf(error.error) != -1) {
                errors.showBlockError(addToBucket.templateName, addToBucket.errorPrefix, error.error);
            } else {
                errors.showCustomBlockError(addToBucket.templateName, addToBucket.errorPrefix, error.error);
            }
            return;
        }
        $("#addToBucketModal").modal('hide');
    },

    getUserBucketList: function (silent) {
        this._bucketFetchError = false;
        this._silent = true;
        if (!silent) {
            this._silent = false;
            $("#" + this.templateName + " #userBucketListWaiting").removeClass("hide");
            $("#" + this.templateName + " #noBucketMessage").addClass("hide");
            $("#" + this.templateName + " #bucketList").addClass("hide");
        }
        App.extensions._call("/bucket/getUserBuckets", {callerAgent: "ADD_TO_BUCKET"}, this.getUserBucketListHandler);
    },

    getUserBucketListHandler: function (error, result) {
        log.debug("/getUserBucketListHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            log.error("/getUserBucketListHandler error:" + AppCommon._toJSON(error));
            this._bucketFetchError = true;
            if (!addToBucket._silent) {
                var errors = new AppClass.GenericError();
                errors.showCustomBlockError(addToBucket.templateName, addToBucket.errorPrefix, error.error);
            }
            $("#" + addToBucket.templateName + " #userBucketListWaiting").addClass("hide");
            return;
        }
        try {
            var bucketList = result.message;
            AppCollection.Local.remove({"f_local_type": "BUCKET"});
            _.each(bucketList, function (item) {
                _.extend(item, {
                    f_local_type: "BUCKET"
                });
                AppCollection.Local.insert(item);
            });
        } catch (err) {
            log.error(err);
        } finally {
            $("#" + addToBucket.templateName + " #userBucketListWaiting").addClass("hide");
            $("#" + addToBucket.templateName + " #bucketList").removeClass("hide");
            //Since at time of modal box open we are clearing all the errors
            // then we are adding tech error if earlier fetch returned error
            // then we are going to do a silent fetch, to get the updated list
            // not doing what above is written it as modal is rendering slow
            //addToBucket.hideError();
        }
    },

    /**
     * This function will clear all the errors present in case earlier action result into some.
     * Then will add a custom error if earlier fetch return some error.
     * Then will do a new silent update to get the latest user bucket list. -- no doing as modal is
     * rendering slow.
     */
    registerModalOnShow: function () {
        var self = this;
        $("#" + addToBucket.templateName + " #addToBucketModal").on("show.bs.modal", function (e) {
            $("#" + addToBucket.templateName + "#bucketList input").removeAttr('checked', 'checked');
            self.hideError();
            if (self._bucketFetchError) {
                var errors = new AppClass.GenericError();
                errors.showBlockError(addToBucket.templateName, addToBucket.errorPrefix, "AB_1");
            }
        });
    },

    registerModalOnHide: function () {
        $("#" + addToBucket.templateName + " #addToBucketModal").on("hidden.bs.modal", function (e) {
            $("#" + addToBucket.templateName + " input:checkbox").each(function () {
                $(this).prop("checked", false);
            });
        });
    },

    hideError: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var addToBucket = new AddToBucketModel();
var log = new AppLogger("AddToBucket");
/*****************************************************************************/
/* AddToBucket: Lifecycle Hooks */
/*****************************************************************************/
Template.AddToBucket.created = function () {
    log.debug("getUserBucketList");
    addToBucket.getUserBucketList();
};

Template.AddToBucket.rendered = function () {
    addToBucket.init();
};

Template.AddToBucket.destroyed = function () {
    //TODO destroy handler to modal
    log.debug("AddToBucket destroyed called");
    $(".modal-backdrop").remove();  //hack to remove shadow of modal box.
};
