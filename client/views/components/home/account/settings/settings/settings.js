/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Settings: Event Handlers and Helpers */
/*****************************************************************************/
Template.Settings.events({
    'click #passwordOption,#securityOption,#activeSessionOption': function (event, selector) {
        settings.showPanel(event, selector);
    }
});

Template.Settings.helpers({
    templateName : function(){
        return Session.get("settingsTemplate");
    }
});

/*****************************************************************************/
/* Settings: Helper Model */
/*****************************************************************************/
function SettingsModel() {
}
SettingsModel.prototype = {
    constructor: SettingsModel,
    templateName: "settingsTemplate",
    init: {
        currentList: "password-li"
    },
    showPanel: function (event, selector) {
        var panel = event.currentTarget.id;

        var templateName = panel.replace("Option", "Settings");
        templateName = templateName[0].toUpperCase() + templateName.slice(1);

        var listId = panel.replace("Option", "-li");
        panel = panel.replace("Option", "-settings");

        if (!_.isEqual(this.init.currentList, listId)) {
            log.debug(templateName);
            var currentList = this.init.currentList;
            this.init.currentList = listId;
            $("#" + currentList).removeClass("active");
            $("#" + listId).addClass("active");
            Session.set("settingsTemplate",templateName);
        }
    }
};

var settings = new SettingsModel();
var log = new AppLogger("Settings");
//var currentPanel = "PasswordSettings";
/*****************************************************************************/
/* Settings: Lifecycle Hooks */
/*****************************************************************************/
Template.Settings.created = function () {
    Session.setDefault("settingsTemplate","PasswordSettings");
};

Template.Settings.rendered = function () {
};

Template.Settings.destroyed = function () {
    App.extensions._deleteSessionKeys(["settingsTemplate"]);
};
