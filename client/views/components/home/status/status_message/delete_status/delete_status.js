/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/

/*****************************************************************************/
/* DeleteStatus: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.DeleteStatus.events({
    'click #deleteButton': function (event, selector) {
        deleteStatus.hideErrors();
        deleteStatus.deletePost(event,selector);
    }
});

Template.DeleteStatus.helpers({
});


/*****************************************************************************/
/* deleteStatus: Helper Model */
/*****************************************************************************/
function DeleteStatusModel() {
}

DeleteStatusModel.prototype = {
    constructor: DeleteStatusModel,
    templateName: "deleteStatusTemplate",
    errorPrefix: "deleteStatus",

    deletePost : function(event,selector){
        postId = event.target.value;
        log.debug("deletePost postId:"+postId);
        App.extensions._toggleDisableButton(deleteStatus.templateName,"deleteButton",true);
        App.extensions._call("/status/deletePost", {"postId":postId}, this.deletePostHandler);
    },

    deletePostHandler : function(error, result){
        App.extensions._toggleDisableButton(deleteStatus.templateName,"deleteButton",false);
        log.debug("deletePostHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if(error){
            log.error("deletePostHandler :" + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            errors.showCustomBlockError(deleteStatus.templateName, deleteStatus.errorPrefix, error.error);
        }else {
            $("#" + deleteStatus.templateName + " #deleteStatusModal").modal('hide');
            Session.set("postFetchedStatus","NOT_VALID");
            AppCollection.Local.remove({
                $and : [
                    { type: "POST_MESSAGE" },
                    { _id : postId}
                ]
            });
        }
    },
    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var deleteStatus = new DeleteStatusModel();
var log = new AppLogger("deleteStatus");
var postId = "";
/*****************************************************************************/
/* DeleteStatus: Lifecycle Hooks */
/*****************************************************************************/
Template.DeleteStatus.created = function () {
};

Template.DeleteStatus.rendered = function () {
    $("#" + deleteStatus.templateName + " #deleteStatusModal").on("show.bs.modal", function (e) {
        deleteStatus.hideErrors();
    });

};

Template.DeleteStatus.destroyed = function () {
};


