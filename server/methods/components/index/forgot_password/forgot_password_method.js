/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Create Account Methods */
/*****************************************************************************/

var log = AppLogger.getLogger(AppLogger.loggerName.FORGOT_PASSWORD_LOGGER);

Meteor.methods({
    '/forgotPassword/resetForgotPassword': function (request) {
        log.info("/forgotPassword/resetForgotPassword", request);
        var self = this;
        var forgotPasswordWrapper = new AppWrapper.ForgotPasswordWrapper();
        return forgotPasswordWrapper.resetForgotPassword(request);
    }
});