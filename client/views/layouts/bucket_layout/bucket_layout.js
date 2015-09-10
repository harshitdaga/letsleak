/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* BucketLayout: Event Handlers and Helpers */
/*****************************************************************************/
Template.BucketLayout.events({
    /*
     * Example:
     *  'click .selector': function (e, tmpl) {
     *
     *  }
     */
});

Template.BucketLayout.helpers({
    /*
     * Example:
     *  items: function () {
     *    return Items.find();
     *  }
     */
});

/*****************************************************************************/
/* BucketLayout: Lifecycle Hooks */
/*****************************************************************************/
Template.BucketLayout.created = function () {
};

Template.BucketLayout.rendered = function () {
    $('input').attr('autocomplete','off');
};

Template.BucketLayout.destroyed = function () {
};
