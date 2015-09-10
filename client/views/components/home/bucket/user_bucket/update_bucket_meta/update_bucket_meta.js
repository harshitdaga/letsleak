/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* UpdateBucketMeta: Event Handlers and Helpers */
/*****************************************************************************/
Template.UpdateBucketMeta.events({
    'click #saveAction': function (event, selector) {
        updateBucket.clear();
        updateBucket.save(event,selector);
    }
});

Template.UpdateBucketMeta.helpers({

    //Getting call from user_bucket_list passing the event/selector where update was clicked
    //Will fetch the information from target element and store it into a variable which is
    //then used to populate the modal box.
    _showUpdateModal: function (event, selector) {
        log.debug("show update model");
        var bucketId = event.currentTarget.value;
        updateBucket.bucket = AppCollection.Local.findOne({
            $and: [
                {"_id": bucketId},
                {"f_local_type": "BUCKET"}
            ]
        });
        log.debug(AppCommon._toJSON(updateBucket.bucket));
        $("#" + updateBucket.templateName + " #editModal").modal();
    },

    _closeUpdateModal: function () {
        log.debug("close update modal");
        $("#" + updateBucket.templateName + " #editModal").modal('hide');
    }
});

function UpdateBucketModel() {
    this.bucket = {};
}
UpdateBucketModel.prototype = {
    constructor: UpdateBucketModel,
    templateName: "updateBucketMetaTemplate",
    errorPrefix : "updateBucket",
    init: function () {
        this.registerOnShow();
        this.registerOnHide();
    },

    registerOnShow: function () {
        $("#" + updateBucket.templateName + " #editModal").on("show.bs.modal", function (e) {
            log.debug("selected bucket : " + AppCommon._toJSON(updateBucket.bucketDetails));
            if (AppCommon._isEmpty(updateBucket.bucket)) {
                alert("Technical error occurred");
                return;
            }
            Template.AddUpdateBucket._setTemplateName(updateBucket.templateName);

            var bucket = updateBucket.bucket;
            $("#" + updateBucket.templateName + " #bucketName").val(bucket.f_bucket.f_name).prop('disabled', true);
            $("#" + updateBucket.templateName + " #bucketDesc").val(bucket.f_bucket.f_desc);
            $("#" + updateBucket.templateName + " #bucketId").val(bucket._id);

            if (bucket.f_bucket.f_isEditable == true) {
                $("#" + updateBucket.templateName + " #yes_editable").click();
            } else {
                $("#" + updateBucket.templateName + " #no_editable").click();
            }

            if (_.isEqual(bucket.f_bucket.f_access, "PRIVATE")) {
                $("#" + updateBucket.templateName + " #no_public").click();
            } else {
                $("#" + updateBucket.templateName + " #yes_public").click();
            }

            updateBucket.clear();
        });
    },

    registerOnHide: function () {
        $("#" + updateBucket.templateName + " #editModal").on("hidden.bs.modal", function (e) {
            //clear the bucket details.
            updateBucket.bucket = {};
            Template.AddUpdateBucket._setTemplateName();
            App.extensions._toggleDisableButton(updateBucket.templateName, "saveAction" , false);
            updateBucket.clear();
        });
    },

    save : function(event,selector){
        var formData = App.extensions._getFormData(selector);
        var addUpdateBucketData = Template.AddUpdateBucket._getModalData();
        /*
         ex : f_bucket:
         f_access: "PUBLIC"
         f_desc: "bucketDescription"
         f_isEditable: true
         f_name: "bucketname"
         */
        var updatedBucket = {
            f_name: formData.bucketName.value,
            f_desc: formData.bucketDesc.value,
            f_access: addUpdateBucketData.accessType,
            f_isEditable: addUpdateBucketData.editableByPublic
        };

        if (_.isEqual(updateBucket.bucket.f_bucket, updatedBucket)) {
            log.error("updatedBucket no change current:" + AppCommon._toJSON(updateBucket.bucket.f_bucket) + " updatedBucket:" + AppCommon._toJSON(updatedBucket));
            var errors = new AppClass.GenericError();
            errors.showBlockError(updateBucket.templateName, updateBucket.errorPrefix, "UB_101");
        } else {
            //App.extensions._toggleDisableButton(updateBucket.templateName, "saveAction" , true);
            Template.AddUpdateBucket._updateBucket(event, selector);
        }
        return false;
    },

    clear : function(){
        $("#" + updateBucket.templateName + " #generic-error").html("");
        $("#" + updateBucket.templateName + " #" + updateBucket.errorPrefix + "-generic-error").html("");
    }
};
var updateBucket = new UpdateBucketModel();
var log = new AppLogger("UpdateBucketModel");
/*****************************************************************************/
/* UpdateBucketMeta: Lifecycle Hooks */
/*****************************************************************************/
Template.UpdateBucketMeta.created = function () {
};

Template.UpdateBucketMeta.rendered = function () {
    updateBucket.init();
};

Template.UpdateBucketMeta.destroyed = function () {
};
