/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Home: Event Handlers and Helpers */
/*****************************************************************************/
Template.Home.events({
});

Template.Home.helpers({
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.created = function () {
};

Template.Home.rendered = function () {
    //check to show tour for the first time user
    if(Session.get("IS_FIRST_TIME")){
        Template.Welcome.init();
        Session.set("IS_FIRST_TIME",false);
    }

};

Template.Home.destroyed = function () {
    AppCollection.Status.remove();
};
