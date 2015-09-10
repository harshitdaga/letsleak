/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* DeleteBucket: Event Handlers and Helpers */
/*****************************************************************************/
Template.DeleteBucket.events({
    'click #deleteButton': function (event, selector) {
        deleteBucket.hideErrors();
        deleteBucket.deleteBucket(event, selector);
    }
});

Template.DeleteBucket.helpers({
    _showDeleteModal: function (event, selector) {
        log.debug("show delete modal");
        var bucketId = event.currentTarget.value;
        deleteBucket.bucket = AppCollection.Local.findOne({
            $and: [
                {"_id": bucketId},
                {"f_local_type": "BUCKET"}
            ]
        });
        log.debug("_showDeleteModal delete bucket:" + AppCommon._toJSON(deleteBucket.bucket));
        $("#" + deleteBucket.templateName + " #bucketName").html(deleteBucket.bucket.f_bucket.f_name.trim());
        $("#" + deleteBucket.templateName + " #bucketId").val(bucketId);
        $("#" + deleteBucket.templateName + " #deleteModal").modal();
    }
});

/*****************************************************************************/
/* DeleteBucket: Helper Model  */
/*****************************************************************************/
function DeleteBucketModel() {
    this.bucket = {};
}

DeleteBucketModel.prototype = {
    constructor: DeleteBucketModel,
    templateName: "deleteBucketTemplate",
    errorPrefix: "deleteBucket",

    deleteBucket: function (event, selector) {
        log.debug("delete bucket : " + this.bucket);
        App.extensions._call("/bucket/delete", this.bucket._id, this.deleteBucketHandler);
    },

    deleteBucketHandler: function (error, result) {
        log.debug("deleteBucketHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            log.error("deleteBucketHandler : " + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            errors.showCustomBlockError(deleteBucket.templateName, deleteBucket.errorPrefix, error.error);
            return;
        }
        //removing the delete one from local collection,
        // since we are getting bucket list by method
        // call and not via subscription
        AppCollection.Local.remove({
            $and: [
                {"_id": deleteBucket.bucket._id},
                {"f_local_type": "BUCKET"}
            ]
        });
        deleteBucket.bucket = {};
        Template.UserBucketList._updateUserBucketList();
        $("#" + deleteBucket.templateName + " #deleteModal").modal('hide');
    },

    hideErrors: function () {
        $("#" + this.templateName + " #generic-error").html("");
    }
};

var deleteBucket = new DeleteBucketModel();
var log = new AppLogger("DeleteBucket");

/*****************************************************************************/
/* DeleteBucket: Lifecycle Hooks */
/*****************************************************************************/
Template.DeleteBucket.created = function () {
};

Template.DeleteBucket.rendered = function () {
};

Template.DeleteBucket.destroyed = function () {
};
