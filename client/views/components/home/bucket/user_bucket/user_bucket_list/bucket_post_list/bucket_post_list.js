/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* BucketPostList: Event Handlers and Helpers */
/*****************************************************************************/
Template.BucketPostList.events({
    'click #removePostButton' : function(event, selector){
        bucketPost.hideErrors();
        bucketPost.removePost(event,selector);
    },

    'click #showMorePostButton' : function(event,selector){
        bucketPost.hideErrors();
        bucketPost.loadMorePost(event,selector);
    },

    'click #reloadPostButton' : function(event,selector){
        bucketPost.hideErrors();
        bucketPost.getPost();
    }
});

Template.BucketPostList.helpers({
    init : function(bucket){
        Session.set("templateStatus",bucketPost.templateStatus.LOADING);
        Session.set("BucketPostListLastUpdatedTime",Date.now());
        log.debug("init bucket:"+bucket);
        if(!AppCommon._isEmpty(bucket)){
            bucketId = bucket._id;
            limit = 1;
            bucketPost.getPost();
        }
    },
    templateStatus : function(){
        return Session.get("templateStatus");
    },

    postList : function(){
        return AppCollection.Local.find({"f_local_type" : "POST"});
    },

    postExist : function(){
        return AppCollection.Local.find({"f_local_type" : "POST"}).count();
    },

    totalPostCount : function(bucketId){
        return bucketPost.postCount();
    },

    lastUpdated : function(){
        return Session.get("BucketPostListLastUpdatedTime");
    }
});

function BucketPostListModal(){}
BucketPostListModal.prototype = {
    constructor:BucketPostListModal,
    templateName: "bucketPostListTemplate",
    errorPrefix: "bucketPostList",

    templateStatus : {
        "LOADING" : "loading",
        "INVALID"  :"invalid",
        "READY" : "ready"
    },

    getPost : function(){
        Session.set("templateStatus",bucketPost.templateStatus.LOADING);
        log.debug("getPost bucketId:"+bucketId + " limit:"+ limit);
        var data = {
            "bucketId" : bucketId,
            "limit" : limit*limitFactor
        };
        App.extensions._call("/bucket/getPostListWithLimit" , data, this.getPostHandler);
    },

    getPostHandler : function(error,result){
        log.debug("/getPostHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        if(error){
            log.error("/getPostHandler " + AppCommon._toJSON(error) );
            var errors = new AppClass.GenericError();
            var validError = [];
            if (validError.indexOf(error.error) != -1) {
                errors.showBlockError(bucketPost.templateName, bucketPost.errorPrefix, error.error);
            } else {
                errors.showCustomBlockError(bucketPost.templateName, bucketPost.errorPrefix, error.error);
            }
            Session.set("templateStatus",bucketPost.templateStatus.INVALID);
            return;
        }

        if(!AppCommon._isEmpty(result.message.bucket)){
            //update bucket
            var bucket = result.message.bucket;
            var selector = {
                    $and : [
                        {"f_local_type": "BUCKET"},
                        {"_id": bucket._id}
                    ]
                },
            modifier = {
                $set : {
                    "f_bucket" : bucket.f_bucket,
                    "f_followCount" : bucket.f_followCount,
                    "f_post_id_list" : bucket.f_post_id_list,
                    "f_postListCount" : AppCommon._isEmpty(bucket.f_post_id_list) ? 0 : bucket.f_post_id_list.length
                }
            };
            AppCollection.Local.update(selector,modifier);

            AppCollection.Local.remove({"f_local_type" : "POST"});
            _.forEach(result.message.postList,function(item){
                AppCollection.Local.insert(_.extend(item,{
                    "f_local_type" : "POST"
                }));
            });
            Session.set("templateStatus",bucketPost.templateStatus.READY);
            Session.get("BucketPostListLastUpdatedTime",Date.now());
        }
    },

    removePost : function(event,selector){
        var self = this;
        var postId = event.currentTarget.value;
        var data = {
            "bucketId" : bucketId,
            postId : postId
        };
        App.extensions._call("/bucket/removePost",data,function(error,result){
            log.debug("/getPostHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
            if(error){
                log.error("/getPostHandler " + AppCommon._toJSON(error));
                var errors = new AppClass.GenericError();
                var validError = [];
                if (validError.indexOf(error.error) != -1) {
                    errors.showBlockError(bucketPost.templateName, bucketPost.errorPrefix, error.error);
                } else {
                    errors.showCustomBlockError(bucketPost.templateName, bucketPost.errorPrefix, error.error);
                }
                return;
            }
            AppCollection.Local.remove({
                $and : [
                    {"f_local_type" : "POST"},
                    {"_id" : postId}
                ]
            });
        });
    },

    loadMorePost : function(event,selector){
        var postCount = this.postCount();
        if(limit*limitFactor <= postCount ) {
            limit++;
        }
        this.getPost();
    },

    postCount : function(){
        var bucket = AppCollection.Local.findOne({
            $and : [
                {"f_local_type": "BUCKET"},
                {"_id" : bucketId}
            ]
        });
        return AppCommon._isEmpty(bucket) || AppCommon._isEmpty(bucket.f_post_id_list) ? 0 : bucket.f_post_id_list.length;
    },

    hideErrors: function () {
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};
var bucketPost = new BucketPostListModal();
var log = new AppLogger("BucketPostList");
var bucketId = "";
var limit = 0;
var limitFactor = 15;

/*****************************************************************************/
/* BucketPostList: Lifecycle Hooks */
/*****************************************************************************/
Template.BucketPostList.created = function () {
};

Template.BucketPostList.rendered = function () {
    Session.setDefault("templateStatus",bucketPost.templateStatus.LOADING);
    Session.setDefault("BucketPostListLastUpdatedTime",Date.now());
};

Template.BucketPostList.destroyed = function () {
    App.extensions._deleteSessionKeys(["templateStatus"]);
    AppCollection.Local.remove({"f_local_type" : "POST"});
};
