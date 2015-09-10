/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/

/*****************************************************************************/
/* Read: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.Read.events({
});

Template.Read.helpers({
});

/*****************************************************************************/
/* Read: Lifecycle Hooks */
/*****************************************************************************/
Template.Read.created = function () {
    $("html,body").animate({scrollTop: $("html").offset().top},700);
};

Template.Read.rendered = function () {
    var panel = this.data.templateName;
    panel = panel.slice(1,panel.length);
    $("#readTemplate #" + panel.toLowerCase()+"-li").addClass("active");
};

Template.Read.destroyed = function () {
};


