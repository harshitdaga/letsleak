/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/

/*****************************************************************************/
/* ExpiryCounter: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.ExpiryCounter.events({
});

Template.ExpiryCounter.helpers({
    formatExpiryTime : function(){
        var update = Session.get("expiryTimeTrigger");
        var self = this;
        var expiryTime = self.expiryTime;
        var currentTime = Date.now();
        var diffInMilli = expiryTime - currentTime;    //after these many millisec post will vanish.
        var diffInMin = diffInMilli/(1000*60);         //after these many minutes
        var hourLeft = parseInt(diffInMin/60);         //getting hours left
        var minLeft = diffInMin - hourLeft*60;         //getting min in decimal to extract the seconds left, later while returning do Math.floor
        var secLeft = Math.round(60*(minLeft-Math.floor(minLeft)));

        if(!(hourLeft<0 || minLeft<0 || secLeft<0)){
            return hourLeft+":"+Math.floor(minLeft)+":"+secLeft;
        }
    }
});

/*****************************************************************************/
/* ExpiryCounter: Lifecycle Hooks */
/*****************************************************************************/
Template.ExpiryCounter.created = function () {
};

Template.ExpiryCounter.rendered = function () {
    Session.setDefault("expiryTimeTrigger",Date.now());
    Meteor.setInterval(function(){
        Session.set("expiryTimeTrigger",Date.now());
    },1000);
};

Template.ExpiryCounter.destroyed = function () {
    App.extensions._deleteSessionKeys(["expiryTimeTrigger"]);
};


