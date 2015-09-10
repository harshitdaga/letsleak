/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/

/*****************************************************************************/
/* Report: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.Report.events({
    "change #reportOptions" : function(event, selector){
        var optionSelected = event.target.value;
        var $usernameEmailLabel = $("#usernameOremailGroup label");
        var $usernameEmailInput = $("#usernameOremailGroup input");
        report.optionSelected = optionSelected;

        //clean up
        $("#questionsContentGroup").addClass("hide");
        report.clear();

        switch (optionSelected){
            case report.options.FORGOT_SECURITY_PIN:
            case report.options.FORGOT_USERNAME:
                $usernameEmailLabel.html("Email address");
                break;
            case  report.options.QUESTION :
                $usernameEmailLabel.html("Username");
                $("#questionsContentGroup").removeClass("hide");
                break;
        }

        switch (optionSelected){
            case report.options.FORGOT_SECURITY_PIN:
            case report.options.FORGOT_USERNAME:
            case  report.options.QUESTION :
                $("#"+report.templateName+" #queryFields").removeClass("hide");
                break;
            default :
                $("#"+report.templateName+" #queryFields").addClass("hide");
                break;
        }
    },

    'focusout textarea,input': function (event, selector) {
        var elemId = event.target.id;
        var errors = new AppClass.GenericError();
        var value = $("#" + elemId).val();
        switch (elemId) {
            case "usernameOremail" :
                report.usernameOremail(value, errors);
                break;
            case "questionsContent" :
                report.questionsContent(value, errors);
                break;
        }
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, report.templateName);
        } else {
            errors.removeElementError(elemId, report.templateName);
           //$("#" + elemId + "Group").addClass("has-success");
        }
    },

    "click #sendReportButton" : function(event,selector){
        event.preventDefault();
        report.reportSubmit(event,selector);
    }
});

Template.Report.helpers({
});

/*****************************************************************************/
/* Report: Helper Model */
/*****************************************************************************/
function ReportModel() {
    var optionSelected = "";
}
ReportModel.prototype = {
    constructor: ReportModel,
    templateName: "reportTemplate",
    errorPrefix : "report",
    options : {
        "FORGOT_USERNAME" : "forgotUsername",
        "FORGOT_SECURITY_PIN" : "forgotSecurityPin",
        "QUESTION" : "questions"
    },
    reportSubmit : function(event,selector){
        var _self = selector;
        var self = this;
        var formData = App.extensions._getFormData(selector);
        if(self.isValid(formData)){
            var data = {
                optionSelected : self.optionSelected,
                usernameOremail : formData.usernameOremail.value,
                questionsContent : formData.questionsContent.value
            };

            log.debug(AppCommon._toJSON(data));
            //$("#sendReportButton").addClass("disabled");
            App.extensions._toggleDisableButton(self.templateName, "sendReportButton" , true);
            $("#generic-error").fadeOut();
            Meteor.call("/report", data, this.reportSubmitHandler);
        }
    },

    reportSubmitHandler : function (error, result) {
        log.debug("reportSubmitHandler error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        //$("#sendReportButton").removeClass("disabled");
        App.extensions._toggleDisableButton(report.templateName, "sendReportButton" , false);
        if (error) {
            log.error("reportSubmitHandler : " + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            var usernameOremail = ["R_1003", "R_1004", "R_102"];
            var questionsContent = ["R_1005", "R_1006"];

            if (usernameOremail.indexOf(error.error) != -1) {
                errors.add(error.error, "usernameOremail");
            }
            if (questionsContent.indexOf(error.error) != -1) {
                errors.add(error.error, "questionsContent");
            }
            if (!errors.isEmpty) {
                errors.showElementError(errors.errorArray, report.templateName);
            } else {
                errors.showCustomBlockError(report.templateName, report.errorPrefix, error.error);
            }
            return;
        }
        report.clear();
        $("#"+report.errorPrefix+"-generic-success").fadeIn(10).delay(5000).fadeOut('fast');
    },

    isValid : function(formData){
        return true;
        var errors = new AppClass.GenericError();
        var userNameOremail = formData.usernameOremail.value;
        var questionsContent = formData.questionsContent.value;
        this.usernameOremail(userNameOremail, errors);
        this.questionsContent(questionsContent, errors);

        log.debug(errors);
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, this.templateName);
        }

        return errors.isEmpty;
    },
    usernameOremail : function(value, errors){
        if(AppCommon._isEmpty(value)){
            errors.add("R_101", "usernameOremail");
        }else {
            switch (report.optionSelected){
                case report.options.FORGOT_SECURITY_PIN:
                case report.options.FORGOT_USERNAME:
                    if(!AppHelper.isVaildEmail(value)){
                        errors.add("R_102", "usernameOremail");
                    }
                    break;
                case  report.options.QUESTION :
                    break;
            }
        }

    },
    questionsContent : function(value,errors){
        if(_.isEqual(report.options.QUESTION,report.optionSelected)) {
            if(AppCommon._isEmpty(value)){
                errors.add("R_101", "questionsContent");
            }else{
                var len = value.length;
                if(len<15 || len>150){
                    errors.add("R_103", "questionsContent");
                }
            }
        }
    },

    clear : function(){
        $("textarea").val("");
        $("input").val("");
        $("#usernameOremailGroup label").html("");
        var errors = new AppClass.GenericError();
        errors.removeElementError("usernameOremail", report.templateName);
        errors.removeElementError("questionsContent", report.templateName);
    }
};

var report = new ReportModel();
var log = new AppLogger("ReportModel");


/*****************************************************************************/
/* Report: Lifecycle Hooks */
/*****************************************************************************/
Template.Report.created = function () {
};

Template.Report.rendered = function () {
};

Template.Report.destroyed = function () {
};


