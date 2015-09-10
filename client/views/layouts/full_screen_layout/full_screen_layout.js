/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* FullScreenLayout: Event Handlers and Helpers */
/*****************************************************************************/
Template.FullScreenLayout.events({
    /*
     * Example:
     *  'click .selector': function (e, tmpl) {
     *
     *  }
     */
});

Template.FullScreenLayout.helpers({
    /*
     * Example:
     *  items: function () {
     *    return Items.find();
     *  }
     */
});

/*****************************************************************************/
/* FullScreenLayout: Lifecycle Hooks */
/*****************************************************************************/
Template.FullScreenLayout.created = function () {
};

Template.FullScreenLayout.rendered = function () {
    $('input').attr('autocomplete','off');
};

Template.FullScreenLayout.destroyed = function () {
};