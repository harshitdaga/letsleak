/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Inbox: Event Handlers and Helpers */
/*****************************************************************************/
Template.Inbox.events({
    'click .mail': function (event, selector) {
        var id = event.currentTarget.id;
        var data = AppCollection.Local.findOne({"_id": id});
        Session.set("dataContext", data);
        Session.set("inboxTemplate", inbox.templateMapping[data.f_type]);
        openMailId = id;
        $("#mailBox").modal('show');    //on everyopen shown event make this post as read
    },

    'click #refreshButton': function (event, selector) {
        inbox.getInbox();
    }
});

Template.Inbox.helpers({
    mailsExist: function () {
        return AppCollection.Local.findOne({"local_type": "INBOX"});
    },

    mails: function () {
        var mailCursor = AppCollection.Local.find(
            {"local_type": "INBOX"},
            { sort: { f_timestamp: -1}}
        );
        var mailsArray = [];
        mailsArray = mailCursor.map(function (item) {
            return inbox.getMailOverview(item);
        });
        log.debug("mailsArray : " + AppCommon._toJSON(mailsArray));
        return mailsArray;
    },

    mailTemplate: function () {
        return Session.get("inboxTemplate");
    },
    dataContext: function () {
        return Session.get("dataContext");
    },
    modalType : function(){
        return Session.get(sessionModalType);
    }
});

function InboxModel() {
}
InboxModel.prototype = {
    constructor: InboxModel,
    templateName: "inboxTemplate",
    errorPrefix: "inbox",

    templateMapping: {
        "WELCOME": "_Welcome",
        "REPORT_ABUSE_REVIEW_YOUR_POST": "_ReviewYourPostTemplate",
        "REPORT_ABUSE_POST_MOVED_UNDER_REVIEW_SYSTEM": "_PostUnderReviewTemplate",
        "FILTER_STATUS_REVIEWED" : "_FilterStatusReviewed",
        "FILTER_COMMENT_REVIEWED" : "_FilterCommentReviewed",
        "FILTER_BUCKET_REVIEWED" : "_FilterBucketReviewed"
    },

    init: function () {
        $("#mailBox").on('shown.bs.modal', function (event) {
            var mail = AppCollection.Local.findOne({$and: [
                {"local_type": "INBOX"},
                {"_id": openMailId}
            ]});
            if (!mail.f_archived) {
                inbox.read(openMailId);
            }
        });
    },

    getMailOverview: function (item) {
        var self = this;
        var shortDesc = "";
        var subject = "";

        switch (item.f_type) {
            case "WELCOME" :
                subject = "Welcome to LetsLeak";
                break;
            case "REPORT_ABUSE_REVIEW_YOUR_POST":
                subject = "Attention, please review your post";
                shortDesc = "Your post \'" + item.f_paramObj.postMessage;
                break;
            case "REPORT_ABUSE_POST_MOVED_UNDER_REVIEW_SYSTEM":
                subject = "Your post is currently under review";
                shortDesc = "Your post \'" + item.f_paramObj.postMessage;
                break;
            case "FILTER_STATUS_REVIEWED" :
                subject = "Your post review";
                shortDesc = "Your post \'" + item.f_paramObj.f_message;
                break;
            case "FILTER_COMMENT_REVIEWED" :
                subject = "Your comment review";
                break;
            case "FILTER_BUCKET_REVIEWED" :
                subject = "Your bucket review";
                break;
        }

        if (shortDesc.length > 50) {
            shortDesc = shortDesc.substring(0, 50) + "...";
        }
        return {
            _id: item._id,
            subject: subject,
            shortDesc: shortDesc,
            timestamp: item.f_timestamp,
            isArchived: item.f_archived
        };
    },

    getInbox: function () {
        App.extensions._call("/inbox", {}, function (error, result) {
            if (error) {
                log.error("getMessageHandler : " + AppCommon._toJSON(error));
            } else {
                try {
                    AppCollection.Local.remove({local_type: "INBOX"});
                    _.forEach(result, function (item) {
                        _.extend(item, {local_type: "INBOX"})
                        AppCollection.Local.insert(item);
                    });
                } catch (err) {
                    log.error(error);
                }
            }
        });
    },

    read: function (mailId) {
        log.debug("marking the post as read! mailId:" + mailId);
        App.extensions._call("/inbox/read", {"mailId": mailId}, function (error, result) {
            if (error) {
                log.error("readHandler : " + AppCommon._toJSON(error));
            } else {
                try {
                    AppCollection.Local.update({$and: [
                        {local_type: "INBOX"},
                        {"_id": mailId}
                    ]}, {$set: {"f_archived": true}});
                } catch (err) {
                    log.error(error);
                }
            }
        });
    }
}

var log = new AppLogger("Inbox");
var inbox = new InboxModel();
var openMailId = "";
var sessionModalType = "sessionModalType";
/*****************************************************************************/
/* Inbox: Lifecycle Hooks */
/*****************************************************************************/
Template.Inbox.created = function () {
};

Template.Inbox.rendered = function () {
    inbox.init();
};

Template.Inbox.destroyed = function () {
    AppCollection.Local.remove({"local_type": "INBOX"});
    App.extensions._deleteSessionKeys(["inboxTemplate", "dataContext",sessionModalType]);
    $("#mailBox").modal('hide');
};

