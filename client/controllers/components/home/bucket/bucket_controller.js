/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
BucketBaseController = BaseController.extend({
    loading: 'loading',
    onAfterAction: function () {
        var self = this;
        return App.extensions._subscribe(self, "/bucket/user_bucket");
    }
});

BucketController = BucketBaseController.extend({
    onBeforeAction : 'loading',
    waitOn: function () {
        var self = this;
        return App.extensions._subscribe(self, "/bucket/editor_selection");
    },

    onAfterAction: function () {
    },

    data: function () {
    },

    action: function () {
        this.render();
    }
});
