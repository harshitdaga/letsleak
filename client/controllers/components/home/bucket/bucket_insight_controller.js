/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
BucketInsightController = FullScreenController.extend({

    onBeforeAction: 'loading',
    waitOn: function () {
        var bucketDataRequest = new AppClass.BucketDataRequest(this.params._id);
        return App.extensions._subscribe(this, "/bucket/bucket_insight", bucketDataRequest);
    },

    data: function () {
        return {
            bucketId: this.params._id
        }
    },

    onAfterAction: function () {
        var bucketId = this.params._id;
        //console.log("onafteraction bucketId:"+bucketId);
        var params = this.data();
        var postIdList = Deps.nonreactive(function () {
            return AppCollection.Bucket.getPostIdList(bucketId);
        });

        var data = {
            data: {
                bucketId: params.bucketId,
                postIdList: postIdList,
                limit: 1
            },
            agent: {
                "userId": App.extensions._getUserId(),
                "session": App.extensions._getSession()
            }
        };

        Session.setDefault('bucketStatusData', data);
        //to make adding of new post, a reactive step
        Session.setDefault("bucketPostCount", AppCollection.Bucket.getPostIdList(bucketId).length);
        Session.setDefault("currentPage", 0);
        Session.setDefault("totalPages", 1);

        Deps.autorun(function () {
            Meteor.subscribe('/bucket/bucket_insight/status', Session.get('bucketStatusData'));
        });

        Deps.autorun(function () {
            var currentPage = Session.get("currentPage");
            var totalPages = Session.get("totalPages");
            var difference = totalPages - currentPage;
            /**
             * when difference between total loaded pages and current page is 2
             * fetch more post
             * difference can only be zero when page is loaded and after that it will be atleast 1
             */
            if (difference <= 3) {
                //load post with limit++
                var sessionStatusData = Session.get('bucketStatusData');
                var limitTotal = sessionStatusData.data.limit * 5;
                if (limitTotal <= postIdList.length) {
                    /**
                     * If we have more post thn current limit,
                     * then we want to increase the limit and fecth those
                     * will fetch post only if there exist more post
                     */
                    sessionStatusData.data.limit += 1;
                    sessionStatusData.data.postIdList = postIdList;
                    Session.set('bucketStatusData', sessionStatusData);
                } else if ((totalPages - 1) * 2 <= postIdList.length && postIdList.length < limitTotal) {
                    /**
                     * If we dont have more post thn the max number of post allowed for this limit (limit*5),
                     * thn
                     * 1. if current total number of post is less thn total post availabe in bucket ==> new post got added, we need to fetch.
                     * 2. since current total number of post is obtained by totalPages-1*2 if we had odd number of post we wont be able to find
                     *    that there was a new post added, so we will check if sessionData postList length is same as of current post list length
                     *    if not then we do a refetch, else continue.
                     */
                    if (sessionStatusData.data.postIdList.length !== postIdList.length) {
                        sessionStatusData.data.postIdList = postIdList;
                        Session.set('bucketStatusData', sessionStatusData);
                    }
                }

            } else if (difference > 2) {
                //do nothing
            }

            /**
             * sync currentPage with totalPages.
             * out of sync case will arise when, a post was earlier shown to user but now is deleted from bucket
             */
            if (currentPage - totalPages >= 0) {
                //console.log("sync ...");
                Session.set("currentPage", totalPages - 1);
            }
        });
    },

    action: function () {
        this.render();
    }
});
