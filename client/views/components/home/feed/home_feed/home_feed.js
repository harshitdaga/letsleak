/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* HomeFeed: Event Handlers and Helpers */
/*****************************************************************************/
Template.HomeFeed.events({
    'click #addToBucketButton': function (event, selector) {
        Template.AddToBucket._showAddToBucketModal(event, selector);
    },
    'click #showMessageButton': function (event, selector) {
        Router.go("status.message", {_id: event.currentTarget.value});
    }
});

Template.home_pagesItemDefault.helpers({
    getLikeCount: function (postId) {
        var result = AppCollection.StatusMeta.likeCount(postId);
        //log.debug("/getLikeCount result:" +  AppCommon._toJSON(result));
        return _.isUndefined(result) ? 0 : result.likeCount;
    },

    isLiked: function (postId, option) {
        var self = this;
        var isLiked = AppCollection.UserStatusMeta.isLiked(self.postId);
        var classValue = "hide";
        switch (option) {
            case "like" :
                classValue = isLiked ? "hide" : "show";
                break;
            case "unlike" :
                classValue = !isLiked ? "hide" : "show";
                break;
        }
        //log.debug("isLiked option:" + option + " isLiked:" + isLiked + " classValue:" + classValue);
        return classValue;
    },
    addExpiryTimer : function(){
        var self = this;
        var timeRemaining = self.f_expiryTime - Date.now();
        homeFeed.intervalIdArray[self._id] = Meteor.setTimeout(function () {
            homeFeed.lastMoments(self);
        }, timeRemaining);
    }
});

Template.home_pagesPageCont.helpers({
    divWrapper : function(pageData){
        return pageData.divWrapper;
    }
});

/*Template.HomeFeed.feeds = function () {
    var oneMin = 30000;
    var result = AppCollection.Status.find({}, {
        sort: { f_timeStamp: -1},
        limit: 10
    });

    result.map(function (post) {
        if (post.f_expires) {
            console.log(post);
            //var timeRemaining = post.f_expiryTime - Date.now();
            var timeRemaining = 15000;
            homeFeed.intervalIdArray[post._id] = Meteor.setTimeout(function () {
                homeFeed.lastMoments(post);
            }, timeRemaining);
        }
    });
    return result;
};*/

function HomeFeedModel() {
    this.intervalIdArray = [];
}

HomeFeedModel.prototype = {
    constructor: HomeFeedModel,
    errorPrefix: "homeFeed",
    templateName: "homeFeedTemplate",
    lastMoments: function (post) {
        log.debug("dying time for post : " + AppCommon._toJSON(post));
        $("#" + post._id).fadeOut(10000);
        Meteor.clearTimeout(homeFeed.intervalIdArray[post._id]);
        homeFeed.intervalIdArray.splice(homeFeed.intervalIdArray.indexOf(post._id), 1);
    }
};

var log = new AppLogger("HomeFeed");
var homeFeed = new HomeFeedModel();
/*****************************************************************************/
/* HomeFeed: Lifecycle Hooks */
/*****************************************************************************/
Template.HomeFeed.created = function () {
};

Template.HomeFeed.rendered = function () {
};

Template.HomeFeed.destroyed = function () {
    log.error("homefeed destroyed called");
    _.each(homeFeed.intervalIdArray, function (item) {
        Meteor.clearInterval(item);
    });

    AppCollection.Local.remove();
    AppCollection.Status.remove();
    AppCollection.StatusMeta.remove();
    //StatusCollectionPages.unsubscribe();
};