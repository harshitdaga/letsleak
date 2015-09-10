/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Login: Event Handlers and Helpers */
/*****************************************************************************/
Template.Login.events({
    'click #loginButton': function (event, selector) {
        event.preventDefault();
        login.hideErrors();
        login.login(event, selector);
    },

    'focusout input': function (event, selector) {
        var elemId = event.target.id;
        //$("#"+elemId).popover('destroy');

        var errors = new AppClass.GenericError();
        var value = $("#" + elemId).val();

        switch (elemId) {
            case "username" :
                login.usernameCheck(value, errors);
                break;
            case "password" :
                login.passwordCheck(value, errors);
                break;
        }
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, login.templateName);
        } else {
            errors.removeElementError(elemId, login.templateName);
            $("#" + elemId + "Group").addClass("has-success");
        }
    },

    /*'click #forgotPasswordButton': function (event, selector) {
        Router.go('forgot.password');
    }*/
});

Template.Login.helpers({
});

/*****************************************************************************/
/* Login: Helper Model */
/*****************************************************************************/
function LoginModel() {}
LoginModel.prototype = {
    constructor: LoginModel,
    templateName: "loginTemplate",
    errorPrefix: "login",

    login: function (event, selector) {
        var self = this;
        var _self = selector;
        var formData = App.extensions._getFormData(selector);

        if (this.isValidLoginForm(formData)) {
            var username = formData.username.value;
            var password = formData.password.value;
            var request = {
                username: username.toLowerCase().trim(),
                password: password
            };
            //$("#loginButton").addClass("disabled");
            App.extensions._toggleDisableButton(self.templateName, "loginButton" , true);
            return Meteor.apply('/login', [request], this.loginHandler);
        }
    },

    loginHandler: function (error, result) {
        log.debug("loginHandler error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));

        if (error) {
            log.error("loginHandler : " + AppCommon._toJSON(error));
            //$("#loginButton").removeClass("disabled");
            App.extensions._toggleDisableButton(login.templateName, "loginButton" , false);
            var errors = new AppClass.GenericError();

            var userError = ["L_101", "L_102","A_1001"];
            var passwordError = ["L_101"];

            if (userError.indexOf(error.error) != -1) {
                errors.add(error.error, "username");
            }
            if (passwordError.indexOf(error.error) != -1) {
                errors.add(error.error, "password");
            }

            if (!errors.isEmpty) {
                errors.showElementError(errors.errorArray, login.templateName);
            } else {
                if (_.isEqual(error.error, "L_103") || _.isEqual(error.error, 400)) {
                    errors.showBlockError(login.templateName, login.errorPrefix, error.error, ["username", "password"]);
                } else {
                    errors.showCustomBlockError(login.templateName, login.errorPrefix, error.error);
                }
            }
            return;
        }
        App.extensions._setSession(result);
        var location = amplify.store("prev_active");
        location = _.isUndefined(location) ? "home" : location;
        amplify.store("prev_active", null);
        Router.go(location);
    },

    isValidLoginForm: function (formData) {
        var errors = new AppClass.GenericError();
        this.usernameCheck(formData.username.value, errors);
        this.passwordCheck(formData.password.value, errors);

        log.debug(errors);
        if (!errors.isEmpty) {
            errors.showElementError(errors.errorArray, this.templateName);
        }
        return errors.isEmpty;
    },

    usernameCheck: function (username, errors) {
        log.debug("usernameCheck");
        if (AppCommon._isEmpty(username)) {
            errors.add("L_101", "username");
        }
    },

    passwordCheck: function (password, errors) {
        log.debug("passwordCheck");
        if (AppCommon._isEmpty(password)) {
            errors.add("L_101", "password");
        }
    },

    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var login = new LoginModel();
var log = new AppLogger("Login");
/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Login.created = function () {
};

Template.Login.rendered = function () {
};

Template.Login.destroyed = function () {
};
