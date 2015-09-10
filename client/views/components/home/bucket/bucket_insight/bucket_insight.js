/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* BucketInsight: Event Handlers and Helpers */
/*****************************************************************************/
Template.BucketInsight.events({
    'click #addToBucketButton': function (event, selector) {
        Template.AddToBucket._showAddToBucketModal(event, selector);
    },

    'click .bb-nav': function (event, selector) {
        var bucketId = this.bucketId;
        var id = event.currentTarget.id;
        var type = id.split("-")[2];
        var config = bucketInsight.config();
        config.$bookBlock.bookblock(type);
    },

    'keyup': function (event, selector) {
        var keyCode = event.keyCode || event.which,
            arrow = {
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };

        var config = bucketInsight.config();
        switch (keyCode) {
            case arrow.left:
                config.$bookBlock.bookblock('prev');
                break;
            case arrow.right:
                config.$bookBlock.bookblock('next');
                break;
        }
    },
});

Template.BucketInsight.helpers({
    bucketExist : function(){
        var self = this;
        var bucket = AppCollection.Bucket.getDetails(self.bucketId);
        return AppCommon._isEmpty(bucket) ? false : true;
    },
    bucketName : function(){
        var self = this;
        return AppCollection.Bucket.getDetails(self.bucketId).f_bucket.f_name;
    },

    bucketDetails: function () {
        var self = this;
        return AppCollection.Bucket.getDetails(self.bucketId);
    },
    postCount: function () {
        var self = this;
        return AppCollection.Bucket.getPostIdList(self._id).length;
    },

    isUserBucket: function () {
        return userId && _.isEqual(userId, App.extensions._getUserId());
    },

    firstPost : function(){
        var self = this;
        var postIdList = AppCollection.Bucket.getPostIdList(self._id);
        var post = AppCollection.Status.findOne({"_id":postIdList[0]});
        log.debug("firstPost " + AppCommon._toJSON(post));
        return post;
    },
    post: function () {
        var self = this;
        var postIdList = AppCollection.Bucket.getPostIdList(self.bucketId);
        var sessionData = Session.get('bucketStatusData');
        var currentLimit = sessionData.data.limit;
        var currentPostIdCont = postIdList.length;
        var postCount = currentLimit * 5;

        //Since current limit can be greater thn actual number of post present in bucket
        //ex: postIdList count = 3 and currentLimit = 1
        // in this case postCount should be 3 and not 5 (1*5 / currentLimit*5)
        postCount = currentLimit * 5 > currentPostIdCont ? currentPostIdCont : postCount;

        var postCursor = AppCollection.Status.find();
        var tmpPostArray = postCursor.fetch();
        var postArray = [];
        var result = [];
        var len = 0;

        var i = 0;
        if (tmpPostArray.length > 0) {
            for (i = 0; i < postCount; i++) {
                postArray.push(_.findWhere(tmpPostArray, {_id: postIdList[i]}));
            }

            len = postArray.length;
            var startCount = 1; //starting with 1 since first post is already shown
            for (i = startCount; i < len; i++) {
                var tmp = {};
                tmp.left = postArray[i];
                i++;
                if (i != len) {
                    tmp.right = postArray[i];
                }
                if( i == 0) {
                    tmp.isFirst = true;
                }
                result.push(tmp);
            }
            result.push({isLast: true});
            var totalPages = parseInt(len / 2) + 1; // + 1 for the starting page
            totalPages = (len % 2 === 0) ? totalPages : totalPages + 1;
            Session.set("totalPages", totalPages);
        }
        return result;
    },

    initOnce: function () {
        bucketInsight.init();
    }
});

/*****************************************************************************/
/* BucketInsight: Helper Model */
/*****************************************************************************/
function BucketInsightModel() {
}
BucketInsightModel.prototype = {
    constructor: BucketInsightModel,

    config: function () {
        return {
            $bookBlock: $('#bb-bookblock'),
            $navNext: $('#bb-nav-next'),
            $navPrev: $('#bb-nav-prev'),
            $navFirst: $('#bb-nav-first'),
            $navLast: $('#bb-nav-last')
        };
    },

    init: function () {
        var currentPage = Session.get("currentPage");
        var totalPages = Session.get("totalPages");
        log.debug("init currentPage : " + currentPage + " totalPages:" + totalPages);
        var config = this.config();
        config.$bookBlock.bookblock({
            currentPage: currentPage,
            speed: 1000,
            shadowSides: 0.8,
            shadowFlip: 0.4,
            onEndFlip: function (old, page, isLimit) {
                Session.set("currentPage", page);
                log.debug("onEndFlip page : " + page + " currentPage:" + currentPage + " totalPages:" + totalPages);
                return false;
            }
        });
        this.initEvents();
    },

    initEvents: function () {
        var config = this.config();
        var $slides = config.$bookBlock.children();

        // add swipe events
        $slides.on({
            'swipeleft': function (event) {
                config.$bookBlock.bookblock('next');
                return false;
            },
            'swiperight': function (event) {
                config.$bookBlock.bookblock('prev');
                return false;
            }
        });
    }
};

var log = new AppLogger("BucketInsight");
var bucketInsight = new BucketInsightModel();
var bucketId = "";

/*****************************************************************************/
/* BucketInsight: Lifecycle Hooks */
/*****************************************************************************/
Template.BucketInsight.created = function () {
};

Template.BucketInsight.rendered = function () {
    bucketId = this.data.bucketId;
    bucketInsight.init();
    $("[data-toggle='tooltip']").tooltip();
};

Template.BucketInsight.destroyed = function () {
    log.debug("destroyed called");
    $("[data-toggle='tooltip']").tooltip('destroy');
    AppCollection.Local.remove();
    AppCollection.Bucket.remove();
    AppCollection.Status.remove();
    AppCollection.StatusMeta.remove();
    var sessionKeys = ["bucketPostCount", "bucketStatusData","currentPage","totalPages"];
    //var sessionKeys = ["bucketStatusData","currentPage","totalPages"];
    App.extensions._deleteSessionKeys(sessionKeys);
    /*var key;
    for (item in sessionKeys) {
        key = sessionKeys[item];
        delete Session.keys[key];
        delete Session.keyDeps[key];
        delete Session.keyValueDeps[key];
    }*/
};
