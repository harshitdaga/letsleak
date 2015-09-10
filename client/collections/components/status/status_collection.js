/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var Status = new Meteor.Collection('c_status');

Status.getPostIdList = function () {
    var postIdList = AppCollection.Status.find().map(function (item) {
        return item._id;
    });
    return AppCommon._isEmpty(postIdList) ? [] : postIdList;
};


Status.isAuthor = function (post_id) {
    var message = Status.findOne({_id: post_id});
    if (!AppCommon._isEmpty(message)) {
        return !AppCommon._isEmpty(message.author) && _.isEqual(message.author.toLowerCase(), App.extensions._getUserId("lower"));
    }
    return false;

};

Status.isCommentAllowed = function (post_id) {
    var message = Status.findOne({_id: post_id});
    if (!AppCommon._isEmpty(message)) {
        return message.isCommentAllowed ? true : false;
    }
    return false;
};

Status.getMessage = function (post_id) {
    return Status.findOne({_id: post_id});
};

_.extend(AppCollection, {
    Status: Status
});

StatusCollectionPages = new Meteor.Pagination(Status, {
    templateName: "StatusFeed",
    onReloadPage1: true,
    infinite: true,
    homeRoute: '/home',
    itemTemplate: "home_pagesItemDefault",
    pageTemplate: "home_pagesPageCont",
    navTemplate: "home_pagesNavCont",
    loadingTemplate : "home_pagesLoading",
    perPage: 20,
    dataMargin: 1,
    sort: {
        f_timestamp: -1
    },
    filters: {
        $and : [
            { "f_flagged" : false },
            { "f_is_deleted" : {$ne:true}},
            {
                $or : [
                    {
                        "f_expires" : false
                    },
                    {
                        $and: [
                            { "f_expires": true } ,
                            { "f_expiryTime": { $gte: Date.now() } }
                        ]
                    }

                ]
            }
        ]
    }
});
