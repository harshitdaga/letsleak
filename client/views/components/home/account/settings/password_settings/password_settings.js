/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* PasswordSettings: Event Handlers and Helpers */
/*****************************************************************************/
Template.PasswordSettings.events({
    'click #changePasswordButton': function (event, selector) {
        event.preventDefault();
        passwordSetting.hideErrors();
        passwordSetting.changePassword(event, selector);
    },

    'focus input': function (event, selector) {
        App.extensions._toggleHelpText(event);
    },

    'focusout input': function (event, selector) {
        var elemId = event.target.id;

        var errors = new AppClass.GenericError();
        var value = $("#" + elemId).val();

        switch (elemId) {
            case "currentPassword" :
                passwordSetting.currentPasswordCheck(value, errors);
                break;
            case "newPassword" :
                passwordSetting.newPasswordCheck(value, errors);
                break;
            case "confirmNewPassword" :
                passwordSetting.confirmNewPasswordCheck(value, $("#newPassword").val(), errors);
                break;
        }

        if (!errors.isEmpty) {
            log.debug("showElementError : value:" + value + " errors:" + errors + " elemId:" + elemId);
            errors.showElementError(errors.errorArray, passwordSetting.templateName);
        } else {
            log.debug("else : value:" + value + " errors:" + errors + " elemId:" + elemId);
            errors.removeElementError(elemId, passwordSetting.templateName);
            $("#" + elemId + "Group").addClass("has-success");
        }

    }

});

Template.PasswordSettings.helpers({
});

/*****************************************************************************/
/* PasswordSettings: Helper Model*/
/*****************************************************************************/
function PasswordSettingModel() {
}
PasswordSettingModel.prototype = {
    constructor: PasswordSettingModel,
    templateName: "passwordSettingsTemplate",
    errorPrefix: "passwordSettings",

    changePassword: function (event, selector) {
        var self = this;
        var formData = App.extensions._getFormData(selector);
        log.debug(AppCommon._toJSON(formData));
        if (this.isValidForm(formData)) {
            var request = {
                currentPassword: formData.currentPassword.value,
                password: formData.newPassword.value
            };
            log.debug(AppCommon._toJSON(request));
            //$("#changePasswordButton").addClass("disabled");
            App.extensions._toggleDisableButton(self.templateName, "changePasswordButton" , true);
            App.extensions._call('/account/changePassword', request, this.changePasswordHandler);
        }
    },

    changePasswordHandler: function (error, result) {
        App.extensions._toggleDisableButton(passwordSetting.templateName, "changePasswordButton" , false);
        log.debug("changePasswordHandler : " + "error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            log.error("changePasswordHandler : " + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();

            var currentPasswordError = ["L_102"];
            var passwordError = [""];

            if (currentPasswordError.indexOf(error.error) != -1) {
                errors.add(error.error, "currentPassword");
            }
            if (passwordError.indexOf(error.error) != -1) {
                errors.add(error.error, "newPassword");
                errors.add(error.error, "confirmNewPassword");
            }

            if (!errors.isEmpty) {
                errors.showElementError(errors.errorArray, passwordSetting.templateName);
            } else {
                errors.showCustomBlockError(passwordSetting.templateName, passwordSetting.errorPrefix, error.error);
            }
            return;
        }

        $("input").val("");
        $("#changePasswordForm .has-success").removeClass("has-success");
        $("#passwordSettings-generic-success").fadeIn(10).delay(5000).fadeOut('fast');
    },

    isValidForm: function (data) {
        var errors = new AppClass.GenericError();
        var currentPassword = data.currentPassword.value;
        var newPassword = data.newPassword.value;
        var confirmPassword = data.confirmNewPassword.value;

        this.currentPasswordCheck(currentPassword, errors);
        this.newPasswordCheck(newPassword, errors);
        this.confirmNewPasswordCheck(confirmPassword, newPassword, errors);

        log.debug("isValidForm errors : " + AppCommon._toJSON(errors));
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, this.templateName);
        } else {
            $("#changePasswordForm .has-error").removeClass("has-error");
            $("#changePasswordForm .error-text").html("").hide();
        }
        return errors.isEmpty;
    },

    currentPasswordCheck: function (password, errors) {
        log.debug("currentPasswordCheck");
        if (AppCommon._isEmpty(password)) {
            errors.add("PS_101", "currentPassword");
        }
    },

    newPasswordCheck: function (password, errors) {
        log.debug("newPasswordCheck");
        if (AppCommon._isEmpty(password)) {
            errors.add("PS_101", "newPassword");
        }
        if (password) {
            var regexPassword = /(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+/g;
            if (!regexPassword.test(password)) {
                errors.add("PS_103", "newPassword");
            }
            if (password.length < 8) {
                errors.add("PS_104", "newPassword");
            }
        }
    },

    confirmNewPasswordCheck: function (confirmPassword, password, errors) {
        log.debug("confirmNewPasswordCheck");
        if (AppCommon._isEmpty(confirmPassword)) {
            errors.add("PS_101", "confirmNewPassword");
        }

        else if (!_.isEqual(password, confirmPassword)) {
            errors.add("PS_102", "confirmNewPassword");
        }

    },
    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var passwordSetting = new PasswordSettingModel();
var log = new AppLogger("PasswordSettings");
/*****************************************************************************/
/* PasswordSettings: Lifecycle Hooks */
/*****************************************************************************/
Template.PasswordSettings.created = function () {
};

Template.PasswordSettings.rendered = function () {
};

Template.PasswordSettings.destroyed = function () {
};
