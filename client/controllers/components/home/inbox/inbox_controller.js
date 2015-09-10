/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var isReady = false;
InboxController = BaseController.extend({
    onBeforeAction: 'loading',
    waitOn: function () {
        Session.set("inboxReady" , false);
        App.extensions._call("/inbox", {}, function (error, result) {
            if (error) {
                console.error("getMessageHandler : " + AppCommon._toJSON(error));
            } else {
                try {
                    _.forEach(result,function(item){
                        _.extend(item,{local_type : "INBOX"})
                        AppCollection.Local.insert(item);
                    });
                } catch (err) {
                    console.error(error);
                }
            }
            Session.set("inboxReady" , true);
        });
    },

    data: function () {
    },

    action: function () {
        if(Session.get("inboxReady")){
            this.render();
        }else {
            this.render('Loading');
        }
       /* App.extensions._call("/inbox", {}, function (e, r) {
            console.log(e);
            console.log(r);
            this.render();
        });*/

    }
});
