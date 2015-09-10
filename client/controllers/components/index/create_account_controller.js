/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
CreateAccountController = DefaultController.extend({
    onBeforeAction: 'loading',
    waitOn: function () {
        var data = {
            inviteCode: this.params.inviteCode
        };
        //TODO can remove this check and put it in wrapper
        return App.extensions._subscribe(this, "/createAccount/isRegistered", data);
    },

    data: function () {
        var inviteCode = this.params.inviteCode;
        var record = invitationCollection.findOne({"inviteCode": inviteCode});
        var isRegistered = null;
        var isValidCode = false;

        if (!_.isUndefined(record)) {
            isValidCode = true;
            isRegistered = record.isRegistered;
        }
        return {
            inviteCode: inviteCode,
            isRegistered: isRegistered,
            isValidCode: isValidCode
        };
    },

    action: function () {
        this.render();
    }
});

var invitationCollection = new Meteor.Collection("c_account_invitation");