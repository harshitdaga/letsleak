/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* SecuritySettings: Event Handlers and Helpers */
/*****************************************************************************/
Template.SecuritySettings.events({
    'focus input': function (event, selector) {
        App.extensions._toggleHelpText(event);
    },

    'focusout input': function (event, selector) {
        var elemId = event.target.id;

        var errors = new AppClass.GenericError();
        var value = $("#" + elemId).val();

        switch (elemId) {
            case "currentPassword" :
                securitySetting.currentPasswordCheck(value, errors);
                break;
            case "newPin" :
                securitySetting.pinCheck(value, errors);
                break;
            case "confirmNewPin" :
                securitySetting.confirmPinCheck(value, $("#newPin").val(), errors);
                break;
        }
        if (!errors.isEmpty) {
            log.debug("showElementError : value:" + value + " errors:" + errors + " elemId:" + elemId);
            errors.showElementError(errors.errorArray, securitySetting.templateName);
        } else {
            log.debug("else : value:" + value + " errors:" + errors + " elemId:" + elemId);
            errors.removeElementError(elemId, securitySetting.templateName);
            $("#" + elemId + "Group").addClass("has-success");
        }

    },

    'click #changePinButton': function (event, selector) {
        event.preventDefault();
        securitySetting.hideErrors();
        securitySetting.changePin(event, selector);
    }
});

Template.SecuritySettings.helpers({
});

/*****************************************************************************/
/* SecuritySetting: Helper Model */
/*****************************************************************************/
function SecuritySettingModel() {
}
SecuritySettingModel.prototype = {
    constructor: SecuritySettingModel,
    templateName: "securitySettingsTemplate",
    errorPrefix: "securitySettings",

    changePin: function (event, selector) {
        var self= this;
        var formData = App.extensions._getFormData(selector);
        log.debug(AppCommon._toJSON(formData));
        if (this.isValidForm(formData)) {
            var request = {
                currentPassword: formData.currentPassword.value,
                pin: formData.newPin.value
            };
            log.debug(AppCommon._toJSON(request));

            //$("#changePinButton").addClass("disabled");
            App.extensions._toggleDisableButton(self.templateName, "changePinButton" , true);
            App.extensions._call('/account/changePin', request, this.changePindHandler);
        }
    },

    changePindHandler: function (error, result) {
        //$("#changePinButton").removeClass("disabled");
        App.extensions._toggleDisableButton(securitySetting.templateName, "changePinButton" , false);
        log.debug("changePindHandler : " + "error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            log.error("changePindHandler : " + AppCommon._toJSON(error));
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
                errors.showElementError(errors.errorArray, securitySetting.templateName);
            } else {
                errors.showCustomBlockError(securitySetting.templateName, securitySetting.errorPrefix, error.error);
            }
            return;
        }
        securitySetting.reset();
    },

    isValidForm: function (data) {
        var errors = new AppClass.GenericError();
        var currentPassword = data.currentPassword.value;
        var newPin = data.newPin.value;
        var confirmNewPin = data.confirmNewPin.value;

        this.currentPasswordCheck(currentPassword, errors);
        this.pinCheck(newPin, errors);
        this.confirmPinCheck(confirmNewPin, newPin, errors);

        log.debug("isValidForm errors : " + AppCommon._toJSON(errors));
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, this.templateName);
        } else {
            $("#securityPinChangeForm .has-error").removeClass("has-error");
            $("#securityPinChangeForm .error-text").html("").hide();
        }
        return errors.isEmpty;
    },

    currentPasswordCheck: function (password, errors) {
        log.debug("usernameCheck");
        if (AppCommon._isEmpty(password)) {
            errors.add("SS_101", "currentPassword");
        }
    },

    pinCheck: function (securityPin, errors) {
        log.debug("pinCheck");
        if (AppCommon._isEmpty(securityPin)) {
            errors.add("SS_101", "newPin");
        }
        if (securityPin && securityPin.length < 5) {
            errors.add("SS_102", "newPin");
        }
    },

    confirmPinCheck: function (confirmPin, pin, errors) {
        log.debug("confirmPinCheck");
        if (AppCommon._isEmpty(confirmPin)) {
            errors.add("SS_101", "confirmNewPin");
        }
        else if (!_.isEqual(pin, confirmPin)) {
            errors.add("SS_103", "confirmNewPin");
        }
    },

    reset: function () {
        this.hideErrors();
        $("input").val("");
        $("#securityPinChangeForm .has-success").removeClass("has-success");
        $("#securitySettings-generic-success").fadeIn(10).delay(5000).fadeOut('fast');
    },

    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var securitySetting = new SecuritySettingModel();
var log = new AppLogger("SecuritySettings");

/*****************************************************************************/
/* SecuritySettings: Lifecycle Hooks */
/*****************************************************************************/
Template.SecuritySettings.created = function () {
};

Template.SecuritySettings.rendered = function () {
};

Template.SecuritySettings.destroyed = function () {
};
