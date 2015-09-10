/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var MessageController = BaseController.extend({
    onBeforeAction: 'loading'
});

var isReady = false;
var postFetchedStatus = {
    "NOT_VALID" : "NOT_VALID",
    "UNDER_REVIEW" : "UNDER_REVIEW",
    "VALID" : "VALID"
};
var log = new AppLogger("StatusMessageController");

StatusMessageController = MessageController.extend({
    onBeforeAction: function () {
        if(Session.equals("postFetchedStatus" , postFetchedStatus.VALID)){
            var isAuthor = AppCollection.Status.isAuthor(this.params._id);
            var data = {
                postId: this.params._id,
                isAuthor: isAuthor
            };
            return [App.extensions._subscribe(this, '/status/status_message_extra', data), App.extensions._subscribe(this, '/status/user_comment_list', data)];
        }
    },

    waitOn: function () {
        var postId = this.params._id;
        Session.setDefault("postFetchedStatus" , undefined);
        App.extensions._call("/status/getMessage", postId, function (error, result) {
            log.debug("getMessageHandler error:" + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
            if (error) {
                log.error("getMessageHandler : " + AppCommon._toJSON(error));
                if (_.isEqual(error.error, "PS_1004")) {
                    //Post under review
                    Session.set("postFetchedStatus",postFetchedStatus.UNDER_REVIEW);
                }else{
                    Session.set("postFetchedStatus",postFetchedStatus.NOT_VALID);
                }
            }else {
                try {
                    var doc = _.extend(result.message, {
                        type: "POST_MESSAGE"
                    });
                    Session.set("postColor", doc.f_color);
                    result = AppCollection.Local.insert(doc);
                } catch (err) {
                    log.error(err);
                }
                Session.set("postFetchedStatus",postFetchedStatus.VALID);
            }
        });
    },

    onAfterAction: function () {
    },

    data: function () {
        return {
            postId: this.params._id
        };
    },
    action : function(){
        if(!AppCommon._isEmpty(Session.get("postFetchedStatus"))){
            this.render();
        }else {
            this.render('Loading');
        }

    }
});
