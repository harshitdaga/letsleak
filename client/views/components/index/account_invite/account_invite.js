/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* AccountInvite: Event Handlers and Helpers */
/*****************************************************************************/
Template.AccountInvite.events({
    'click #getInvitationButton': function (event, selector) {
        event.preventDefault();
        accountInvite.hideErrors();
        accountInvite.requestInvite(event, selector);
    },

    'focus input': function (event, selector) {
        var errors = new AppClass.GenericError();
        errors.removeElementError("emailId",accountInvite.templateName);
    }
});

Template.AccountInvite.helpers({
});

function AccountInviteModel() {
}
AccountInviteModel.prototype = {
    constructor: AccountInviteModel,
    templateName: "accountInviteTemplate",
    errorPrefix: "accountInvite",

    requestInvite: function (event, selector) {
        var self = this;
        var emailId = selector.$("#emailId").val();

        /**
         * Functions checks for valid email format
         * @returns {boolean}
         */
        var isValidEmail = function () {
            var filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            var result = filter.test(emailId);
            var errors = new AppClass.GenericError();

            if (!result) {
                errors.add("CA_101", "emailId");
            }

            if (!errors.isEmpty) {
                errors.showElementError(errors.errorArray, self.templateName);
            }
            return errors.isEmpty;
        };

        if (isValidEmail()) {
            var data = {
                emailId: emailId
            };
            App.extensions._toggleDisableButton(self.templateName, "getInvitationButton" , true);
            App.extensions._call("/createAccount/requestInvite", data, self.requestInviteHandler);
        }
    },

    requestInviteHandler: function (error, result) {
        log.debug("requestInviteHandler error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        App.extensions._toggleDisableButton(accountInvite.templateName, "getInvitationButton" , false);

        if (error) {
            log.error("requestInviteHandler : " + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();

            if (_.isEqual(error.error, "CA_101")) {
                errors.add(error.error, "emailId");
            }

            if (!errors.isEmpty) {
                errors.showElementError(errors.errorArray, accountInvite.templateName);
            } else {
                errors.showCustomBlockError(accountInvite.templateName, accountInvite.errorPrefix, error.error);
            }
            return;
        }

        $("#requestEmailId").html($("#" + accountInvite.templateName + " #emailId").val());
        $("#accountInvite-generic-success").fadeIn(100,function(){
            $("input").val("");
        });

    },

    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-success").hide();
    }
};

var accountInvite = new AccountInviteModel();
var log = new AppLogger("AccountInvite");
/*****************************************************************************/
/* AccountInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.AccountInvite.created = function () {
};

Template.AccountInvite.rendered = function () {
};

Template.AccountInvite.destroyed = function () {
};
