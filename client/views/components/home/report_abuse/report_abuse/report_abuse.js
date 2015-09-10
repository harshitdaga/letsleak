/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* ReportAbuse: Event Handlers and Helpers */
/*****************************************************************************/
Template.ReportAbuse.events({
    'click #reportButton': function (event, selector) {
        reportAbuse.report(event, selector, "ADD");
    },

    'click #cancelButton': function () {
        reportAbuse.clear();
    },

    'click #undoReportButton': function (event, selector) {
        reportAbuse.report(event, selector, "DELETE");
    }
});

Template.ReportAbuse.helpers({
    reportOptions: function (postType) {
        return AppClass.ReportAbuse.getReportOptions();
    },
    reportedAbuse: function (postId, option) {
        log.debug("reportedAbuse called : " + postId + " option:" + option);
        var post = AppCollection.Local.findOne({"_id": postId});
        var result = "hide";

        if (_.isEqual(option, "undo")) {
            result = AppCommon._isEmpty(post.reportAbuseData) ? "hide" : "show";
        } else {
            result = AppCommon._isEmpty(post.reportAbuseData) ? "show" : "hide";
        }
        log.debug("reportedAbuse option:"+option + " result:"+result);
        return result;
    }
});

/*****************************************************************************/
/* ReportAbuse: Helper Model */
/*****************************************************************************/
function ReportAbuseModel() {
}
ReportAbuseModel.prototype = {
    constructor: ReportAbuseModel,
    templateName: "reportAbuseTemplate",
    errorPrefix: "reportAbuse",

    init: function () {
        log.debug("binding on hidden events");
        $('#reportAbuseBox').on('hidden.bs.modal', function (event) {
            // Since due to reactive query on reportedAbuse helper
            // once we report abuse a post modal reloads it self and
            // is not getting closed properly. Thus update the local
            // collection when modal is closed
            if (!AppCommon._isEmpty(reportAbuseDoc)) {
                AppCollection.Local.update(
                    { _id: reportAbuseDoc.postId},
                    { $set: { "reportAbuseData": reportAbuseDoc } }
                );
            }
        });

        $('#reportAbuseBox').on('shown.bs.modal', function (event) {
            reportAbuseDoc = {};
        });
    },

    report: function (event, selector, action) {
        var self = this;
        var data = {
            postId: event.currentTarget.value,
            postType: selector.$(event.currentTarget).attr("posttype"),
            reasonCode: selector.$("input[name=abuseOption]:checked").val(),
            action: action
        };

        log.debug("data : " + AppCommon._toJSON(data));
        //$("#reportButton").addClass("disabled");
        App.extensions._toggleDisableButton(self.templateName, "reportButton" , true);
        App.extensions._call("/reportAbuse", data, this.reportHandler);
    },

    reportHandler: function (error, result) {
        log.debug("error : " + AppCommon._toJSON(error) + " result : " + AppCommon._toJSON(result));
        $("#reportButton").removeClass("disabled");
        App.extensions._toggleDisableButton(reportAbuse.templateName, "reportButton" , false);
        if (error) {
            log.error(AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            var validErrors = ["RA_102"];
            if (validErrors.indexOf(error.error) != -1) {
                errors.showBlockError(reportAbuse.templateName, reportAbuse.errorPrefix, error.error);
            } else {
                errors.showCustomBlockError(reportAbuse.templateName, reportAbuse.errorPrefix, error.error);
            }
            return;
        }
        var reportAbuseData = result.message;
        if (reportAbuseData) {
            if (_.isEqual(reportAbuseData.action, "ADD")) {
                reportAbuseDoc = {
                    timestamp: reportAbuseData.timestamp,
                    reasonCode: reportAbuseData.reasonCode,
                    postId: reportAbuseData.postId
                };
                log.debug("reportAbuseDoc : " + AppCommon._toJSON(reportAbuseDoc));
            } else if (_.isEqual(reportAbuseData.action, "DELETE")) {
                AppCollection.Local.update(
                    { _id: result.message.postId},
                    { $set: { "reportAbuseData": "" } }
                );
            }
        }
        $("#" + reportAbuse.templateName + " #cancelButton").click();
    },
    clear: function () {
        $("input[name=abuseOption]:checked").removeAttr("checked");
        this.hideErrors();
    },

    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var reportAbuse = new ReportAbuseModel();
var log = new AppLogger("ReportAbuse");
var reportAbuseDoc = {};
/*****************************************************************************/
/* ReportAbuse: Lifecycle Hooks */
/*****************************************************************************/
Template.ReportAbuse.created = function () {
};

Template.ReportAbuse.rendered = function () {
    reportAbuse.init();
};

Template.ReportAbuse.destroyed = function () {
};
