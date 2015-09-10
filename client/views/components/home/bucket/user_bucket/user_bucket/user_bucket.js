/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* UserBucket: Event Handlers and Helpers */
/*****************************************************************************/
Template.UserBucket.events({
    /*
     * Example:
     *  'click .selector': function (e, tmpl) {
     *
     *  }
     */
});

Template.UserBucket.helpers({
    /*
     * Example:
     *  items: function () {
     *    return Items.find();
     *  }
     */
});

/*****************************************************************************/
/* UserBucket: Lifecycle Hooks */
/*****************************************************************************/
Template.UserBucket.created = function () {
    App.extensions._addTitle("User Bucket");
};

Template.UserBucket.rendered = function () {
};

Template.UserBucket.destroyed = function () {
    App.extensions._removeTitle();
};
