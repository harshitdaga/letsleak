/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Client and Server Routes */
/*****************************************************************************/
Router.configure({
    layoutTemplate: 'MasterLayout',
    loadingTemplate: 'Loading',
    notFoundTemplate: 'NotFound',
    templateNameConverter: 'upperCamelCase',
    routeControllerNameConverter: 'upperCamelCase'
});

Router.map(function () {
    this.route('index', {
        path: '/',
        title : 'Welcome to LetsLeak'
    });

   /*this.route('login', {
        path: '/login',
        title : 'LetsLeak Login'
    });*/

    this.route('forgot.password', {
        path: '/forgotPassword',
        title : 'Forgot Password Assistant'
    });

    this.route('create.account', {
        path: '/createAccount/:inviteCode',
        title : 'Create Account'
    });

    this.route('home', {
        path: '/home',
        title : "Home"
    });

    this.route('settings', {
        path: '/home/settings',
        title : "Account Settings"
    });

    this.route('status.message', {
        path: '/home/message/status/:_id',
        title : "Status Message"
    });

    this.route('bucket', {
        path: '/home/bucket',
        title : 'Buckets'
    });
    this.route('user.bucket', {
        path: '/home/bucket/user',
        title : "My Buckets"
    });
    this.route('bucket.insight', {
        path: '/home/bucket/insight/:_id',
        title : "Inside a Bucket"
    });

    this.route('see.all.notification', {
        path: '/home/notification',
        title : "My Notifications"
    });

    this.route('inbox', {
        path: '/home/inbox',
        title : 'My Inbox'
    });

    this.route('about.us', {
        path: '/whyLetsLeak'
    });
    this.route('ground.rules', {
        path: '/GroundRules'
    });
    this.route('faq', {
        path: '/FAQs',
        template : 'FAQ'
    });
    this.route('tnc', {
        path: '/TnC',
        template : 'TnC'
    });
    this.route('report', {
        path: '/Report'
    });
    this.route('privacy', {
        path: '/Privacy'
    });
    this.route('contactUs', {
        path: '/contactUs'
    });
});

// this hook will run on almost all routes
Router.onBeforeAction(function () {
    var self = this;
    App.extensions._addTitle(self.route.options.title);

    //Hard fix, as modal open class is not removed as we navigate out of modal by clicking a link or pressing back button.
    //We are adding overflow: hidden; position: fixed; to avoid background scrolling when modal box is open
    $("body").removeClass("modal-open");
});

Router.onBeforeAction(function () {
    if (!App.extensions._isLoggedIn()) {
        App.extensions._logout(true);
    }
}, {except: ['index','create.account','forgot.password',"about.us","ground.rules","faq","tnc","report","contactUs","privacy"]});

Router.onBeforeAction(function () {
    if (App.extensions._isLoggedIn()) {
        Router.go("home");
    }
}, {only: ['index', 'create.account', 'forgot.password']});
