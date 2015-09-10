/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* _Welcome: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template._Welcome.events({
    "click #productTour" : function(event,selector){
        event.preventDefault();
        $("#mailBox").modal('hide');
        Template.Welcome.init();
    }
});

Template._Welcome.helpers({
});

/*****************************************************************************/
/* _Welcome: Lifecycle Hooks */
/*****************************************************************************/
Template._Welcome.created = function () {
};

Template._Welcome.rendered = function () {
};

Template._Welcome.destroyed = function () {
};