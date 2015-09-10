/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
FullScreenController = RouteController.extend({
    layoutTemplate: 'FullScreenLayout',
    onAfterAction: function () {
        var self = this;
        var data = {
            user_id: App.extensions._getUserId()
        };
        return [App.extensions._subscribe(self, "notification")];
    }
});