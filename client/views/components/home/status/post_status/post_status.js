/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* PostStatus: Event Handlers and Template Helpers */
/*****************************************************************************/
Template.PostStatus.events({
    'click #savePostButton': function (event, selector) {
        postStatus.hideErrors();
        postStatus.postStatus(event, selector);
    },

    'click #cancelPostButton': function (event, selector) {
       // postStatus.clearClose();
    },

    'click #commentAllowed #yes, click #commentAllowed #no': function (event, selector) {
        var currentTarget = event.currentTarget.id;
        var parentDOM = "#commentAllowed";

        var makeAChange = false;
        var activeElem = "";
        var inactiveElem = "";

        if (currentTarget && _.isEqual(currentTarget, "yes") && !postStatus.isCommentAllowed) {
            activeElem = "yes";
            inactiveElem = "no";
            postStatus.isCommentAllowed = true;
            makeAChange = true;
        } else if (currentTarget && _.isEqual(currentTarget, "no") && postStatus.isCommentAllowed) {
            activeElem = "no";
            inactiveElem = "yes";
            postStatus.isCommentAllowed = false;
            makeAChange = true;
        }

        var activeClass = "btn";
        var inactiveClass = "btn inactive";
        if (makeAChange) {
            $(parentDOM + " #" + activeElem).removeClass(inactiveClass).addClass(activeClass);
            $(parentDOM + " #" + inactiveElem).removeClass(activeClass).addClass(inactiveClass);
        }
    },

    'click .bgColorButton': function (event, selector) {
        var bgColor = event.target.id;
        selector.$("#postContent").removeClass(postStatus.bgColor);
        postStatus.bgColor = bgColor || randomColorGenerator();
        selector.$("#postContent").addClass(postStatus.bgColor);
        selector.$("#postContent").attr("color",postStatus.bgColor);
        log.debug(postStatus.bgColor);
        // Below code will add a class to change the color of font based on background color
        // $("#postContent").removeClass("fontClass-white").removeClass("fontClass-black").addClass(App.extensions._getFontColor(postStatus.bgColor));
    },

    'keydown #eventuallyExpire input': function (event, selector) {
        var currentTarget = event.currentTarget.id;
        var keyCode = event.keyCode;
        //number 48-57 inclusive ; backspace:8 delete:46 ; back arrow:37; forward arrow:39 ; tab:9
        var validKeyCode = [8, 9, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
        if (validKeyCode.indexOf(keyCode) == -1) {
            event.preventDefault();
            return false;
        }
    },

    'keyup #eventuallyExpire input': function (event, selector) {
        var currentTarget = event.currentTarget.id;
        var value = parseInt(event.currentTarget.value, 10);
        value = _.isNaN(value) ? 0 : value;
        if (_.isEqual(currentTarget, "expireHour") && value > 23) {
            value = 23;
        } else if (_.isEqual(currentTarget, "expireMin") && value > 59) {
            value = 59;
        }
        event.currentTarget.value = value;
        $(event.currentTarget).focus();
    },

    'click #expiryTimeYes, click #expiryTimeNo': function (event, selector) {
        var value = event.currentTarget.value;
        //var showElem = "";
        var activeElem = "";
        var inactiveElem = "";
        //var hideElem = "";
        var makeAChange = false;

        if (_.isEqual(value, "yes") && !postStatus.isExpiryMessage) {
            //showElem = "eventuallyExpire";
            //hideElem = "neverExpire";
            activeElem = "expiryTimeYes";
            inactiveElem = "expiryTimeNo";
            postStatus.isExpiryMessage = true;
            makeAChange = true;
        } else if (_.isEqual(value, "no") && postStatus.isExpiryMessage) {
            //hideElem = "eventuallyExpire";
            //showElem = "neverExpire";
            inactiveElem = "expiryTimeYes";
            activeElem = "expiryTimeNo";
            postStatus.isExpiryMessage = false;
            makeAChange = true;
        }

        if (makeAChange) {
            if(postStatus.isExpiryMessage){
                $("#eventuallyExpire").removeClass("hide");
            }else {
                $("#eventuallyExpire").addClass("hide");
            }
            var activeClass = "btn";
            var inactiveClass = "btn inactive";
            var parentDOM = "#expiryTime";
            $(parentDOM + " #" + activeElem).removeClass(inactiveClass).addClass(activeClass);
            $(parentDOM + " #" + inactiveElem).removeClass(activeClass).addClass(inactiveClass);
        }
    },

    "keydown #statusBox textarea" : function(event,selector){
        var value = event.currentTarget.value;
        if(value.length < postMaxLimit){
            event.currentTarget.value = value;
        }else {
            event.currentTarget.value = value.substr(0,299);
        }
    }
});

Template.PostStatus.helpers({
    color: function () {
        return color;
    }
});

/*****************************************************************************/
/* PostStatus : Helper Model */
/*****************************************************************************/
function PostStatusModel() {
    this.bgColor = randomColorGenerator();
    this.isCommentAllowed = true;
    this.isExpiryMessage = false;
}

PostStatusModel.prototype = {
    constructor: PostStatusModel,
    templateName: "postStatusTemplate",
    errorPrefix: "postStatus",

    postStatus: function (event, selector) {
        var self = this;
        //var message = self.$("#post #textarea").html();
        var message = selector.$("#post #textarea").val();
        var timeInMilli = -1;
        if (this.isExpiryMessage) {
            var hour = parseInt(selector.$("#expireHour").val(), 10);
            var min = parseInt(selector.$("#expireMin").val(), 10);
            log.debug("hour:" + hour + " min:" + min);
            hour = _.isNaN(hour) ? 0 : hour;
            min = _.isNaN(min) ? 0 : min;

            //convert it to milliseconds
            timeInMilli = (hour * 60 + min) * 60000;
            log.debug("hour:" + hour + " min:" + min + " timeInMill:" + timeInMilli);
        }
        var expiry = {
            isExpiryMessage: this.isExpiryMessage,
            timeInMilli: timeInMilli
        };

        var statusMessage = new AppClass.StatusMessage(message, this.isCommentAllowed, this.bgColor, expiry);

        if (this.isValidSave(statusMessage)) {
            log.debug(statusMessage);
            //$("#savePostButton").addClass("disabled");
            App.extensions._toggleDisableButton(self.templateName, "savePostButton" , true);
            App.extensions._call("/status/postStatus", statusMessage, this.postStatusHandler);
        }
    },

    postStatusHandler: function (error, result) {
        log.debug("postStatusHandler error : " + AppCommon._toJSON(error) + " result:" + AppCommon._toJSON(result));
        //$("#savePostButton").removeClass("disabled");
        App.extensions._toggleDisableButton(postStatus.templateName, "savePostButton" , false);
        if (error) {
            log.error("postStatusHandler :" + AppCommon._toJSON(error));
            var errors = new AppClass.GenericError();
            var validError = ["PS_101", "PS_102", "PS_103", "PS_104"];
            if (validError.indexOf(error.error) != -1) {
                errors.showBlockError(postStatus.templateName, postStatus.errorPrefix, error.error);
            } else {
                errors.showCustomBlockError(postStatus.templateName, postStatus.errorPrefix, error.error);
            }

            //if PS_1006 means suspicious
            if(_.isEqual(error.error, "PS_1006")){
                postStatus.clearClose();
            }
            return;
        }
        $("#cancelPostButton").click();
        postStatus.clearClose();
        postStatus.hideErrors();
    },

    isValidSave: function (statusMessage) {
        var message = statusMessage.message;
        var categories = statusMessage.categoryArray;
        var errors = new AppClass.GenericError();

        if (AppCommon._isEmpty(message)) {
            errors.add("PS_101", "message");
        } else {
            /*  Check if we want to find only words ie ignore white spaces
             var regex = /\s+/gi;
             var wordCount = message.trim().replace(regex, ' ').split(' ').length;
             */
            var charCount = message.trim().length;

            if (charCount < 10) {
                errors.add("PS_102", "message");
            }
            if (charCount > postMaxLimit) {
                errors.add("PS_102", "message");
            }
        }
        if (statusMessage.expiry.isExpiryMessage && statusMessage.expiry.timeInMilli <= 0) {
            errors.add("PS_104", ["expiryHour", "expiryMin"]);
        }

        if (errors.length > 0) {
            errors.showBlockError(this.templateName, this.errorPrefix, errors.errorArray);
            return false;
        }
        return true;
    },

    clearClose: function () {
        var activeClass = "active";
        var inactiveClass = "inactive";

        $("#"+this.templateName+ " #post #textarea").val("");


        //Comments allowed reset
        $("#" + this.templateName + " #commentAllowed #yes").removeClass(inactiveClass).addClass(activeClass);
        $("#" + this.templateName + " #commentAllowed #no").removeClass(activeClass).addClass(inactiveClass);

        //Expiry Option reset
//        $("#eventuallyExpire").fadeOut(100, function () {
//            //$("#neverExpire").fadeIn();
//        });
        $("#eventuallyExpire #expireHour").val(0);
        $("#eventuallyExpire #expireMin").val(0);

        $("#" + this.templateName + " #expiryTimeNo").removeClass(inactiveClass).addClass(activeClass);
        $("#" + this.templateName + " #expiryTimeYes").removeClass(activeClass).addClass(inactiveClass);
        $("#eventuallyExpire").addClass("hide");
        //variable init
        this.bgColor = randomColorGenerator();
        this.isCommentAllowed = true;
        this.isExpiryMessage = false;
    },

    hideErrors: function () {
        $("#" + this.templateName + " #generic-error").html("");
        $("#" + this.templateName + " #" + this.errorPrefix + "-generic-error").html("");
    }
};

var statusTrigger = [ "If you could buy any type of food what would you buy?", "What color is your tooth brush?", "If you could be any animal what would it be and why?", "Who is your favorite super hero and why?", "Who do you admire the most?", "What is your favorite summer activity?", "If a movie was made of your life what genre would it be, who would play you?", "If you could be any flavor of ice cream what ice cream flavor would you be and why?", "Who is your favorite cartoon character and why?", "If you could go any where in the world where would you go and why?", "What is your dream job?", "Are you a morning or a night person?", "What is your favorite hobby?", "What is one thing that annoys you the most?", "What is the strangest thing you’ve ever eaten?", "What is your favorite thing about someone in your family?", "What is one of your weird quirks?", "Describe your self in 3 words.", "If you could trade lives with anyone for a day who would it be and why?", "If you could talk in your sleep what would you say?", "What is the first thing you do when you get up in the morning?", "What is your favorite movie quote?", "What is your favorite joke?", "What would you do on Mars for fun?", "If you could get yourself anything, what would you get?", "Where is the worst place you could get stuck?", "What would you do with your 15 minutes of fame?", "Where would you go if you where invisible?", "What is the one thing you own you wish you didn’t?", "Describe the perfect kiss in 3 words.", "What is your biggest addiction?", "Do you have a song that reminds you of a relationship if so what song?", "How many books have you read so far this year?", "When I dance, I look like…?", "Who have you met that you wish you hadn’t?", "If you were famous what would you be famous for?", "What is the worst job you could have?", "What is your favorite T.V. channel?", "What is the thing your most afraid of?", "If you could paint anything what would you paint?", "What celebrity annoys you the most?"];
var color = ["red", "blue", "green", "purple", "grey"];
var postStatus = new PostStatusModel();
var log = new AppLogger("PostStatus");
var postMaxLimit = 300;
/*****************************************************************************/
/* PostStatus: Lifecycle Hooks */
/*****************************************************************************/
Template.PostStatus.created = function () {
};

Template.PostStatus.rendered = function () {
    //Every time page is rendered post a new status question
    /*var len = statusTrigger.length;
    var random = (new Date().getTime()) % len;
    this.$("#statusButton").text(statusTrigger[random]);*/
    $('#statusBox').on('show.bs.modal', function (e) {
        var randomColor = randomColorGenerator();

        var $postContent = $("#statusBox #postContent");
        $postContent.removeClass($postContent.attr("color"));
        $postContent.addClass(randomColor);
        $postContent.attr("color",randomColor);
        postStatus.bgColor = randomColor;
    });
};

Template.PostStatus.destroyed = function () {
};

function randomColorGenerator(){
    var len = color.length;
    var random = (new Date().getTime()) % len;
    return color[random];
}
