/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* AddUpdateBucket: Event Handlers and Helpers */
/*****************************************************************************/
Template.AddUpdateBucket.events({
    "click #addAction": function (event, selector) {
        event.preventDefault();
        addUpdateBucket.hideError();
        addUpdateBucket.addUpdateBucket(event, selector);
    },
    "click #yes_editable, click #no_editable": function (event, selector) {
        addUpdateBucket.editableByPublic = _.isEqual("yes_editable", event.currentTarget.id);
        log.debug("editable clicked editableByPublic: " + addUpdateBucket.editableByPublic);

        var activeElem = "yes_editable";
        var inactiveElem = "no_editable";

        if (!addUpdateBucket.editableByPublic) {
            activeElem = "no_editable";
            inactiveElem = "yes_editable";
        }

        var activeClass = "btn-options";
        var inactiveClass = "btn-options inactive";
        var parentDOM = "#editableByPublic";
        $(parentDOM + " #" + activeElem).removeClass(inactiveClass).addClass(activeClass);
        $(parentDOM + " #" + inactiveElem).removeClass(activeClass).addClass(inactiveClass);

    },

    "click #yes_public, click #no_public": function (event, selector) {
        var activeElem = "";
        var inactiveElem = "";

        if (_.isEqual("yes_public", event.currentTarget.id)) {
            activeElem = "yes_public";
            inactiveElem = "no_public";
            addUpdateBucket.accessType = "PUBLIC";
            selector.$("#editableByPublic").show();
        } else {
            activeElem = "no_public";
            inactiveElem = "yes_public";
            addUpdateBucket.accessType = "PRIVATE";
            selector.$("#editableByPublic").hide();
        }

        var activeClass = "btn-options";
        var inactiveClass = "btn-options inactive";
        var parentDOM = "#access";
        $(parentDOM + " #" + activeElem).removeClass(inactiveClass).addClass(activeClass);
        $(parentDOM + " #" + inactiveElem).removeClass(activeClass).addClass(inactiveClass);

        log.debug("isPublic clicked accessType:" + addUpdateBucket.accessType);
    },

    'focus input, focus textarea': function (event, selector) {
        App.extensions._toggleHelpText(event, selector);
    },

    'focusout input, focusout textarea': function (event, selector) {
        var elemId = event.target.id;
        var errors = new AppClass.GenericError();
        var value = selector.$("#" + elemId).val();

        switch (elemId) {
            case "bucketName" :
                addUpdateBucket.bucketNameCheck(value, errors);
                break;
            case "bucketDesc" :
                addUpdateBucket.bucketDescCheck(value, errors);
                break;
        }
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, addUpdateBucket.templateName);
        } else {
            errors.removeElementError(elemId, addUpdateBucket.templateName);
            selector.$("#" + elemId + "Group").addClass("has-success");
        }
        log.debug("focusout input elemId:" + elemId);
    }
});

Template.AddUpdateBucket.helpers({

    /* helper fnctions getting called twice :-/ so doing the stuff in render method
     show : function(){
     return !addUpdateBucket.isTemplateTypeUpdate;
     },

     disabled : function(){
     log.debug(addUpdateBucket.isTemplateTypeUpdate);
     log.debug(addUpdateBucket.templateType+"\n");
     return addUpdateBucket.isTemplateTypeUpdate ? "disabled" : "";
     },

     action : function(){
     return addUpdateBucket.isTemplateTypeUpdate ? "UPDATE" : "ADD";
     },
     */

    //Method call to be used by update_bucket_meta template.
    _updateBucket: function (event, selector) {
        addUpdateBucket.addUpdateBucket(event, selector);
    },

    /**
     * Private helper function for thridpart caller for
     * setting the template as template name is used in many
     * place to locate a  element ex. generic error block
     * or setting elements to has-error etc ...
     *
     * used by : Update_bucket_meta
     * @param templateName
     * @private
     */
    _setTemplateName: function (templateName) {
        if (!AppCommon._isEmpty(templateName)) {
            log.debug("_setTemplateName setting new template");
            oldValues.editableByPublic = addUpdateBucket.editableByPublic;
            oldValues.accessType = addUpdateBucket.accessType;
            addUpdateBucket.templateName = templateName;
            addUpdateBucket.clear();
        } else {
            addUpdateBucket.templateName = "addUpdateBucketTemplate";
            addUpdateBucket.editableByPublic = oldValues.editableByPublic;
            addUpdateBucket.accessType = oldValues.accessType;
        }

        log.debug("_setTemplateName templateName:" + addUpdateBucket.templateName);
    },

    /**
     * This is private helper method that will return "selected"
     * field values of addUpdateBucketModel to be accessable by
     * thirdParty caller
     *
     * used by ex : update_Bucket_Meta
     */
    _getModalData: function () {
        return {
            editableByPublic: addUpdateBucket.editableByPublic,
            accessType: addUpdateBucket.accessType
        };
    }
});

/*****************************************************************************/
/* AddUpdateBucket : Helper Model */
/*****************************************************************************/
function AddUpdateBucketModel() {
    this.editableByPublic = true;
    this.accessType = "PUBLIC";

    //private field to store details about new bucket or updated bucket
    this._bucket = {};
}

AddUpdateBucketModel.prototype = {
    constructor: AddUpdateBucketModel,
    templateName: "addUpdateBucketTemplate",
    errorPrefix: "addUpdateBucket",

    addUpdateBucket: function (event, selector) {
        var self = this;
        var formData = App.extensions._getFormData(selector);
        if (this.isValidBucket(formData)) {
            var name = formData.bucketName.value;
            var description = formData.bucketDesc.value;
            var bucketId = formData.bucketId.value;
            var action = formData.action.value;

            //TODO Also alert if same bucket name is entered ... this is only frontend validation
            var bucket = new AppClass.Bucket(name, description, self.accessType, self.editableByPublic, bucketId, action);
            log.debug("call /bucket/addUpdateBucket bucket : " + bucket);
            //selector.$("#addAction").addClass("disabled");
            App.extensions._toggleDisableButton(self.templateName, "addAction", true);
            App.extensions._toggleDisableButton(self.templateName, "saveAction" , true);
            this._bucket = bucket;
            App.extensions._call("/bucket/addUpdateBucket", bucket, self.addUpdateBucketHandler);
        }
    },

    addUpdateBucketHandler: function (error, result) {
        log.debug("addUpdateBucketHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        //$("#" + addUpdateBucket.templateName + " #addAction").removeClass("disabled");
        App.extensions._toggleDisableButton(addUpdateBucket.templateName, "addAction", false);
        App.extensions._toggleDisableButton(addUpdateBucket.templateName, "saveAction", false); //for updateMeta save button
        if (error) {
            log.error("addUpdateBucketHandler : " + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            var bucketName = ["B_101", "B_102", "B_103"];
            var bucketDesc = ["B_104", "B_105"];

            if (bucketName.indexOf(error.error) != -1) {
                errors.add(error.error, "bucketName");
            }
            if (bucketDesc.indexOf(error.error) != -1) {
                errors.add(error.error, "bucketDesc");
            }
            if (!errors.isEmpty) {
                errors.showElementError(errors.errorArray, addUpdateBucket.templateName);
            } else {
                errors.showCustomBlockError(addUpdateBucket.templateName, addUpdateBucket.errorPrefix, error.error);
            }
            if(_.isEqual(error.error,"B_1004") && !_.isEqual(addUpdateBucket.templateName, "updateBucketMetaTemplate")){
                addUpdateBucket.clear();
            }
            return;
        }
        //TODO show success message for successful addition.

        //After successful update/addtion of bucket
        //updating the local collection data
        var selector = {};
        var bucket = addUpdateBucket._bucket;
        if (_.isEqual(addUpdateBucket.templateName, "updateBucketMetaTemplate")) {
            selector = {
                $and: [
                    {"f_local_type": "BUCKET"},
                    {"_id": bucket.bucketId}
                ]
            };
            var modifier = {
                $set: {
                    "f_bucket.f_desc": bucket.getDesc(),
                    "f_bucket.f_access": bucket.getAccess(),
                    "f_bucket.f_isEditable": bucket.isBucketEditable(),
                    f_lastUpdated: new Date().getTime()
                }
            };
            AppCollection.Local.update(selector, modifier);
            Template.UpdateBucketMeta._closeUpdateModal();
        } else {
            var bucketID = result.message;
            var timestamp = new Date().getTime();
            var data = {
                _id: bucketID,
                f_userId: App.extensions._getUserId(),
                f_bucket: {
                    f_name: bucket.name,
                    f_desc: bucket.desc,
                    f_access: bucket.access,
                    f_isEditable: bucket.isEditable
                },
                f_timestamp: timestamp,
                f_lastUpdated: timestamp,
                f_local_type: "BUCKET"
            };
            AppCollection.Local.insert(data);
            addUpdateBucket.clear();
        }

        // silently try to fetch and update it from server also
        Template.UserBucketList._updateUserBucketList();
    },

    isValidBucket: function (formData) {
        var errors = new AppClass.GenericError();
        this.bucketNameCheck(formData.bucketName.value, errors);
        this.bucketDescCheck(formData.bucketDesc.value, errors);

        log.debug(errors);
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, this.templateName);
        }
        return errors.isEmpty;
    },

    bucketNameCheck: function (bucketName, errors) {
        log.debug("bucketNameCheck");
        if (AppCommon._isEmpty(bucketName)) {
            errors.add("B_101", "bucketName");
        }
        if (bucketName && bucketName.length > 50) {
            errors.add("B_102", "bucketName");
        }
        //allows . * ! & ' , - also
        if (bucketName && (bucketName != bucketName.match(/^[a-zA-Z0-9\s\.\*\!\&\'\,\-\?\(\)\:]+$/))) {
            errors.add("B_103", "bucketName");
        }
    },

    bucketDescCheck: function (bucketDesc, errors) {
        log.debug("bucketDescCheck");
        if (AppCommon._isEmpty(bucketDesc)) {
            errors.add("B_104", "bucketDesc");
        }
        if (bucketDesc && bucketDesc.length > 150) {
            errors.add("B_105", "bucketDesc");
        }
    },

    clear: function () {
        var self = this;
        log.debug("clearing add bucket template");
        $("#" + self.templateName + " #bucketName").val("");
        $("#" + self.templateName + " #bucketDesc").val("");
        $("#" + self.templateName + " #yes_public").click();
        $("#" + self.templateName + " #yes_editable").click();

        self.editableByPublic = true;
        self.accessType = "PUBLIC";

        $("#" + self.templateName + " .has-error").each(function () {
            $(this).removeClass("has-error");
            $(this).find(".error-text").html("");
        });

        $("#" + self.templateName + " .has-success").each(function () {
            $(this).removeClass("has-success");
        });

        this.hideError();
    },

    hideError: function () {
        $("#" + this.templateName + " #generic-error").html("");
    }
};

var addUpdateBucket = new AddUpdateBucketModel();
var log = new AppLogger("AddUpdateBucket");
var oldValues = {};
/*****************************************************************************/
/* AddUpdateBucket: Lifecycle Hooks */
/*****************************************************************************/
Template.AddUpdateBucket.created = function () {
};

Template.AddUpdateBucket.rendered = function () {
    /*
     since {{disabled}} was getting called twice https://github.com/meteor/meteor/issues/1999
     <input type="text" class="form-control" id="name" placeholder="Bucket Name" maxlength="25" value="bucket1" {{disabled}}>
     */
    if (!AppCommon._isEmpty(this.data) && this.data.templateType === "update") {
        //this.$("#addBucketForm #name").prop("disabled",true);
        this.$("#actionButtons").remove();
        this.$("#action").val("UPDATE");
    } else {
        this.$("#action").val("ADD");
    }
};

Template.AddUpdateBucket.destroyed = function () {
    log.debug("destroy called");
    //TODO remove collection data
};
