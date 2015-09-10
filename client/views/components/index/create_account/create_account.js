/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* CreateAccount: Event Handlers and Helpers */
/*****************************************************************************/
Template.CreateAccount.events({

    'click, focusin input': function (event, selector) {
        App.extensions._toggleHelpText(event);
    },

    'focusout input': function (event, selector) {
        var elemId = event.target.id;

        var errors = new AppClass.GenericError();
        var value = $("#" + elemId).val();

        switch (elemId) {
            case "accountName" :
                createAccount.accountNameCheck(value, errors);
                break;
            case "password" :
                createAccount.passwordCheck(value, errors);
                break;
            case "confirmPassword" :
                createAccount.confirmPasswordCheck(value, $("#password").val(), errors);
                break;
            case "securityPin" :
                createAccount.securityPinCheck(value, errors);
                break;
        }
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, createAccount.templateName);
        } else {
            errors.removeElementError(elemId, createAccount.templateName);
            $("#" + elemId + "Group").addClass("has-success");
        }

    },

    'click #createAccountButton': function (event, selector) {
        event.preventDefault();
        createAccount.createAccount(event, selector);
    },

    'keypress input': function (event, selector) {
        //hide all error message
        // _.each($("#errors").children() , function(child){ console.log($(child)); $(child).hide() });
        var elm = $(event.target).parent().removeClass("has-error");
    }
    //TODO confirm password error as it is typed
});

Template.CreateAccount.helpers({
    isValid: function () {
        var self = this;
        return self.isValidCode && !self.isRegistered;
    }
});

/*****************************************************************************/
/* CreateAccount: Helper Model */
/*****************************************************************************/
function CreateAccountModel() {
}
CreateAccountModel.prototype = {
    constructor: CreateAccountModel,
    templateName: "createAccountTemplate",
    errorPrefix: "createAccount",

    createAccount: function (event, selector) {
        var self = this;
        var _self = selector;
        var formData = App.extensions._getFormData(selector);

        if (this.isValidAccountForm(formData)) {
            var data = {
                accountRequest: {
                    username: formData.accountName.value,
                    password: formData.password.value,
                    pin: formData.securityPin.value
                },
                inviteCode: _self.data.inviteCode
            };

            log.debug(AppCommon._toJSON(data));
            //$("#createAccountButton").addClass("disabled");
            App.extensions._toggleDisableButton(self.templateName, "createAccountButton" , true);
            $("#generic-error").fadeOut();
            App.extensions._call("/createAccount", data, this.createAccountHandler);
        }
    },

    createAccountHandler: function (error, result) {
        log.debug("createAccountHandler error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        App.extensions._toggleDisableButton(createAccount.templateName, "createAccountButton" , false);
        if (error) {
            log.error("createAccountHandler : " + AppCommon._toJSON(error));
            //$("#createAccountButton").removeClass("disabled");

            var errors = new AppClass.GenericError();

            var accountError = ["CA_1001", "CA_102", "CA_103", "CA_108", 105];
            var passwordError = ["CA_1002"];
            var securityPinError = ["CA_1003"];

            if (accountError.indexOf(error.error) != -1) {
                errors.add(error.error, "accountName");
            }
            if (passwordError.indexOf(error.error) != -1) {
                errors.add(error.error, "password");
            }
            if (securityPinError.indexOf(error.error) != -1) {
                errors.add(error.error, "securityPin");
            }

            if (!errors.isEmpty) {
                errors.showElementError(errors.errorArray, createAccount.templateName);
            } else {
                errors.showCustomBlockError(createAccount.templateName, createAccount.errorPrefix, error.error);
            }
            return;
        }

        //successfully registered and if autologin true
        Session.setDefault("IS_FIRST_TIME",true);
        if(result.autoLogin && result.autoLogin.isSuccess){
            App.extensions._setSession(result.autoLogin);
            Router.go("home");
        }else {
            Router.go("index");
        }

    },

    isValidAccountForm: function (formData) {

        var errors = new AppClass.GenericError();
        var accountName = formData.accountName.value;
        var password = formData.password.value;
        var confirmPassword = formData.confirmPassword.value;
        var securityPin = formData.securityPin.value;

        this.accountNameCheck(accountName, errors);
        this.passwordCheck(password, errors);
        this.confirmPasswordCheck(confirmPassword, password, errors);
        this.securityPinCheck(securityPin, errors);

        log.debug(errors);
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, this.templateName);
        }

        return errors.isEmpty;
    },

    accountNameCheck: function (accountName, errors) {
        log.debug("accountNameCheck");
        if (AppCommon._isEmpty(accountName)) {
            errors.add("CA_101", "accountName");
        }
        if (accountName) {
            if (accountName.length > 15) {
                errors.add("CA_102", "accountName");
            }

            // var regex = /([a-zA-Z0-9_])/gi;
            var regex = /^[a-zA-Z0-9_]+$/g;
            if (!regex.test(accountName)) {
                errors.add("CA_103", "accountName");
            }
        }
    },

    passwordCheck: function (password, errors) {
        log.debug("passwordCheck");
        if (AppCommon._isEmpty(password)) {
            errors.add("CA_101", "password");
        }
        if (password) {
            var regexPassword = /(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+/g;
            if (!regexPassword.test(password)) {
                errors.add("CA_104", "password");
            }
            if (password.length < 8) {
                errors.add("CA_105", "password");
            }
        }
    },

    confirmPasswordCheck: function (confirmPassword, password, errors) {
        log.debug("confirmPasswordCheck");
        if (AppCommon._isEmpty(confirmPassword)) {
            errors.add("CA_101", "confirmPassword");
        }

        if (!_.isEqual(password, confirmPassword)) {
            errors.add("CA_106", "confirmPassword");
        }
    },

    securityPinCheck: function (securityPin, errors) {
        log.debug("securityPinCheck");
        if (AppCommon._isEmpty(securityPin)) {
            errors.add("CA_101", "securityPin");
        }
        else if (securityPin && securityPin.length < 5) {
            errors.add("CA_107", "securityPin");
        }
    }
};

var createAccount = new CreateAccountModel();
var log = new AppLogger("CreateAccount");

/*****************************************************************************/
/* CreateAccount: Lifecycle Hooks */
/*****************************************************************************/
Template.CreateAccount.created = function () {
};

Template.CreateAccount.rendered = function () {
};

Template.CreateAccount.destroyed = function () {
};
