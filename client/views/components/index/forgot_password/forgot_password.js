/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* ForgotPassword: Event Handlers and Helpers */
/*****************************************************************************/
Template.ForgotPassword.events({
    'click, focusin input': function (event, selector) {
        //$("#forgotPassword-generic-success").fadeOut(1000);
        App.extensions._toggleHelpText(event);
    },

    'focusout input': function (event, selector) {
        var elemId = event.target.id;

        var errors = new AppClass.GenericError();
        var value = $("#" + elemId).val();

        switch (elemId) {
            case "userName" :
                forgotPassword.userNameCheck(value, errors);
                break;
            case "newPassword" :
                forgotPassword.passwordCheck(value, errors);
                break;
            case "confirmNewPassword" :
                forgotPassword.confirmPasswordCheck(value, $("#newPassword").val(), errors);
                break;
            case "securityPin" :
                forgotPassword.securityPinCheck(value, errors);
                break;
        }
        if (!errors.isEmpty) {
            log.debug("showElementError : value:" + value + " errors:" + errors + " elemId:" + elemId);
            errors.showElementError(errors.errorArray, forgotPassword.templateName);
        } else {
            log.debug("else : value:" + value + " errors:" + errors + " elemId:" + elemId);
            errors.removeElementError(elemId, forgotPassword.templateName);
            $("#" + elemId + "Group").addClass("has-success");
        }

    },

    'click #requestResetButton': function (event, selector) {
        event.preventDefault();
        forgotPassword.hideErrors();
        forgotPassword.forgotPassword(event, selector);
    }
});

Template.ForgotPassword.helpers({
});

/*****************************************************************************/
/* ForgotPassword: Helper Model */
/*****************************************************************************/
function ForgotPasswordModel() {
}
ForgotPasswordModel.prototype = {
    constructor: ForgotPasswordModel,
    templateName: "forgotPasswordTemplate",
    errorPrefix: "forgotPassword",

    forgotPassword: function (event, selector) {
        var self = this;
        var _self = selector;
        var formData = App.extensions._getFormData(selector);

        if (this.isValidForgotPasswordForm(formData)) {
            var request = {
                username: formData.userName.value,
                password: formData.newPassword.value,
                securityPin: formData.securityPin.value
            };
            log.debug(AppCommon._toJSON(request));
            App.extensions._toggleDisableButton(self.templateName, "requestResetButton" , true);
            Meteor.apply('/forgotPassword/resetForgotPassword', [request], this.forgotPasswordHandler);
        }
    },

    forgotPasswordHandler: function (error, result) {
        log.debug("forgotPasswordHandler error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        App.extensions._toggleDisableButton(forgotPassword.templateName, "requestResetButton" , false);
        if (error) {
            log.error("forgotPasswordHandler : " + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();

            var accountError = ["A_1001"];
            var passwordError = ["FP_1003","A_1004","A_1005","A_1006"];
            var securityPinError = ["A_1003"];

            if (accountError.indexOf(error.error) != -1) {
                errors.add(error.error, "userName");
            }
            if (passwordError.indexOf(error.error) != -1) {
                errors.add(error.error, "newPassword");
                errors.add(error.error, "confirmNewPassword");
            }
            if (securityPinError.indexOf(error.error) != -1) {
                errors.add(error.error, "securityPin");
            }

            if (!errors.isEmpty) {
                errors.showElementError(errors.errorArray, forgotPassword.templateName);
            } else {
                errors.showCustomBlockError(forgotPassword.templateName, forgotPassword.errorPrefix, error.error);
            }
            return;
        }

        $("input").val("");
        $("#forgotPasswordForm .has-success").removeClass("has-success");
        $("#forgotPassword-generic-success").fadeIn(100).delay(60000).fadeOut('fast');
    },

    isValidForgotPasswordForm: function (formData) {
        var errors = new AppClass.GenericError();
        var userName = formData.userName.value;
        var password = formData.newPassword.value;
        var confirmPassword = formData.confirmNewPassword.value;
        var securityPin = formData.securityPin.value;

        this.userNameCheck(userName, errors);
        this.passwordCheck(password, errors);
        this.confirmPasswordCheck(confirmPassword, password, errors);
        this.securityPinCheck(securityPin, errors);

        log.debug(errors);
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, this.templateName);
        } else {
            $("#forgotPasswordForm .has-error").removeClass("has-error");
            $("#forgotPasswordForm .error-text").html("").hide();
        }
        return errors.isEmpty;
    },

    userNameCheck: function (username, errors) {
        log.debug("usernameCheck");
        if (AppCommon._isEmpty(username)) {
            errors.add("FP_101", "userName");
        }
    },


    passwordCheck: function (password, errors) {
        log.debug("passwordCheck");
        if (AppCommon._isEmpty(password)) {
            errors.add("FP_101", "newPassword");
        }
        if (password) {
            var regexPassword = /(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+/g;
            if (!regexPassword.test(password)) {
                errors.add("FP_102", "newPassword");
            }
            if (password.length < 8) {
                errors.add("FP_103", "newPassword");
            }
        }
    },

    confirmPasswordCheck: function (confirmPassword, password, errors) {
        log.debug("confirmPasswordCheck");
        if (AppCommon._isEmpty(confirmPassword)) {
            errors.add("FP_101", "confirmNewPassword");
        }

        if (!_.isEqual(password, confirmPassword)) {
            errors.add("FP_104", "confirmNewPassword");
        }
    },

    securityPinCheck: function (securityPin, errors) {
        log.debug("securityPinCheck");
        if (AppCommon._isEmpty(securityPin)) {
            errors.add("FP_101", "securityPin");
        }
        if (securityPin && securityPin.length < 5) {
            errors.add("FP_105", "securityPin");
        }
    },
    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var forgotPassword = new ForgotPasswordModel();
var log = new AppLogger("ForgotPassword");
/*****************************************************************************/
/* ForgotPassword: Lifecycle Hooks */
/*****************************************************************************/
Template.ForgotPassword.created = function () {
};

Template.ForgotPassword.rendered = function () {
};

Template.ForgotPassword.destroyed = function () {
};
