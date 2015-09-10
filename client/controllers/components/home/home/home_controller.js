/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
HomeController = BaseController.extend({
    waitOn: function () {
        //return this.subscribe('home_feed');
        //nprogress
        //console.log("waiton");
       //return StatusCollectionPages.reload();
    },

    data: function () {
    },

    onAfterAction: function () {
        var data = {
            data: {
                "postIdList": AppCollection.Status.getPostIdList()
            },
            agent: {
                "userId": App.extensions._getUserId(),
                "session": App.extensions._getSession()
            }
        };

        Session.set('homeFeedStatusList', data);
        Deps.autorun(function () {
            Meteor.subscribe('/home_feed/status_meta', Session.get('homeFeedStatusList'));
        });

    },

    action: function () {
        var self = this;
        var path = self.path;
        if (_.isEqual(path, "/home/")) {
            Router.go("/home");
        }
        this.render();
    }
});
