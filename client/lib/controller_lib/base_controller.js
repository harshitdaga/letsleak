/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
BaseController = RouteController.extend({
    layoutTemplate: 'HomeLayout',
    onAfterAction: function () {
        var self = this;
        var data = {
            user_id: App.extensions._getUserId()
        };
        //return [this.subscribe("personal",data), this.subscribe("notification",data)];
        //return [App.extensions._subscribe(self,"notification"), App.extensions._subscribe(self,"userBucket") ];
        return [App.extensions._subscribe(self, "notification")];
    }
});