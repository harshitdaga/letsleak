/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* ActiveSessionSettings: Event Handlers and Helpers */
/*****************************************************************************/
Template.ActiveSessionSettings.events({
    'click #logoutAllAction': function (event, selector) {
        activeSessionModel.logoutAll();
    }
});

Template.ActiveSessionSettings.helpers({
});

/*****************************************************************************/
/* ActiveSessionSettings: Helper Model */
/*****************************************************************************/
function ActiveSessionModel() {
    this.sessionMap = {};
}
ActiveSessionModel.prototype = {
    constructor: ActiveSessionModel,
    addSessionItemToView: function (data) {
        $("#noSessionData").addClass("hide");
        $("#sessionData").addClass("hide");

        if (!AppCommon._isEmpty(data)) {
            $("#sessionData").removeClass("hide");
            data = _.map(data, function (item) {
                return moment(item).format('MMM D YYYY, h:mm A');
            });

            var parent = $("#sessionList .sessionItemTemplate");
            _.each(data, function (item) {
                log.debug("item : " + item);
                var child = $(parent).clone().removeClass("sessionItemTemplate");

                $(child).find("span").text(item);
                $("#sessionList").append(child);
            });
        } else {
            $("#noSessionData").removeClass("hide");
        }
    },
    logoutAll: function () {
        App.extensions._call("/logoutActiveSession", "", this.logoutAllHandler);
    },

    logoutAllHandler: function (error, result) {
        log.debug("/logoutAllHandler : " + "error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            alert(AppCommon._toJSON(error));
            log.error(AppCommon._toJSON(error));
            return;
        }
        activeSessionModel.addSessionItemToView(result);
    }
};

var activeSessionModel = new ActiveSessionModel();
var log = new AppLogger("ActiveSessionSettings");
/*****************************************************************************/
/* ActiveSessionSettings: Lifecycle Hooks */
/*****************************************************************************/
Template.ActiveSessionSettings.created = function () {
    var data = App.extensions._wrapWithXtraParam();
    log.debug(AppCommon._toJSON(data));
    Meteor.apply("/login/getSessionList", [data], function (error, result) {
        log.debug("/getSessionMap : " + "error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if (error) {
            alert(AppCommon._toJSON(error));
            return;
        }

        $("#wait").addClass("hide");
        $("#sessionData").fadeIn(100);
        activeSessionModel.sessionMap = result;
        activeSessionModel.addSessionItemToView(result);
    });
};

Template.ActiveSessionSettings.rendered = function () {

};

Template.ActiveSessionSettings.destroyed = function () {
};
