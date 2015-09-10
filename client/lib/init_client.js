/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
/*****************************************************************************/
/* Client App Namespace  */
/*****************************************************************************/
App = {};
AppClass = {};
AppCollection = {};

//http://verge.airve.com/#integration
//jQuery.extend(verge);

_.extend(App, {
});

moment.lang('en', {
    monthsShort: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
});

moment.lang('en', {
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
});

App.helpers = {
    toLowerCase: function (value) {
        if (!AppCommon._isEmpty(value) && value.length > 0) {
            return new Spacebars.SafeString(value.toLowerCase());
        }
        return value;
    },

    toUpperCase: function (value) {
        if (!AppCommon._isEmpty(value) && value.length > 0) {
            return new Spacebars.SafeString(value.toUpperCase());
        }
        return value;
    },

    toCapitalize: function (value) {
        if (!AppCommon._isEmpty(value) && value.length > 0) {
            return new Spacebars.SafeString(value[0].toUpperCase() + value.slice(1));
        }
        return value;
    },

    isLoggedIn: function () {
        return App.extensions._isLoggedIn();
    },

    eq: function (value1, value2, ignoreCase) {
        if (_.isBoolean(ignoreCase)) {
            if (!AppCommon._isEmpty(value1) && !AppCommon._isEmpty(value2)) {
                return _.isEqual(value1.toLowerCase(), value2.toLowerCase());
            }
        }
        return _.isEqual(value1, value2);
    },

    neq: function (value1, value2, ignoreCase) {
        if (_.isBoolean(ignoreCase)) {
            if (!AppCommon._isEmpty(value1) && !AppCommon._isEmpty(value2)) {
                return !_.isEqual(value1.toLowerCase(), value2.toLowerCase());
            }
        }
        return !_.isEqual(value1, value2);
    },

    setFontClass: function (bgColor) {
        if(!AppCommon._isEmpty(bgColor)){
            return App.extensions._getFontColor(bgColor);
        }
    }
};

_.each(App.helpers, function (helper, key) {
    UI.registerHelper(key, helper);
});

App.extensions = {
    /**
     * Custom call method to add session key for every call going from client
     * @param name : method name
     * @param paramObject
     * @param callback
     * @public
     */
    _call: function (name, param, callback) {
        if (_.isUndefined(callback)) {
            return Meteor.call(name, this._wrapWithXtraParam(param));
        }
        else {
            //Since async call no return required.
            Meteor.call(name, this._wrapWithXtraParam(param), callback);
        }
    },

    _subscribe: function (self, name, param) {
        return self.subscribe(name, this._wrapWithXtraParam(param));
    },

    _wrapWithXtraParam: function (requestData) {
        return {
            data: AppCommon._isEmpty(requestData) ? undefined : requestData,
            agent: {
                "userId": this._getUserId(),
                "session": this._getSession()
            }
        };
    },

    _getSession: function () {
        return amplify.store("session");
    },

    _getUserId: function (style) {
        if (AppCommon._isEmpty(style))
            return amplify.store("user_id");

        if (_.isEqual(style.toLowerCase(), "lower"))
            return amplify.store("user_id").toLowerCase();
    },

    _setSession: function (loginRequest) {
        amplify.store("user_id", loginRequest.userId);
        amplify.store("session", loginRequest.session);
    },

    _isLoggedIn: function () {
        return !_.isUndefined(this._getSession());
    },

    _clearSession: function () {
        amplify.store("user_id", null);
        amplify.store("session", null);
    },

    _getFormData: function (/*formId,*/selector) {
        //var inputArray = $("#"+formId+" input");
        var inputArray = selector.find("form");
        var formData = {};
        _.map(inputArray, function (arg) {
            var elm = $(arg);
            var id = elm.attr("id");
            formData[id] = {
                id: id,
                value: elm.val().trim()
            };
        });
        return formData;
    },

    _addTitle: function (title) {
        title = title || "LetsLeak";
        $("title").html(title);
    },

    _removeTitle: function () {
        $("title").html("LetsLeak");
    },

    _logout: function (storeCurrentLocation) {
        if (storeCurrentLocation) {
            var pathName = location.pathname;
            /*if(pathName.indexOf("/home")!=-1){
                amplify.store("prev_active", location.href);
            }else{
                amplify.store("prev_active",null);
            }*/
        }
        this._clearSession();
        Router.go("index");
    },

    _getFontColor: function (bgColor) {
        var color = new RGBColorConvertor(bgColor);
        var foreColor = "black";
        if (color.ok) { // 'ok' is true when the parsing was a success
            var brightness = Math.sqrt(color.r * color.r * .299 + color.g * color.g * .587 + color.b * color.b * .114);
            foreColor = (brightness < 130) ? "white" : "black";
        } else {

        }
        return "fontClass-" + foreColor;
    },

    _toggleHelpText : function(event,selector){
        var eventType = event.type;
        var id = "#" + event.target.id;
        var helpText = $(id).parent().find(".help-text").html();

        var $parent = $(id).parent().find(".help-text");
        if(selector){
            $parent= selector.$(id).parent().find(".help-text")
        }
        if (!AppCommon._isEmpty(helpText)) {
            if(_.isEqual(eventType,"focusin")){
                $parent.removeClass("hide");
            } else if(_.isEqual(eventType,"focusout")){
                $parent.addClass("hide");
            }
        }
    },

    _deleteSessionKeys: function (sessionKeysArray) {
        var key;
        var item = "";
        for (item in sessionKeysArray) {
            key = sessionKeysArray[item];
            delete Session.keys[key];
            delete Session.keyDeps[key];
            delete Session.keyValueDeps[key];
        }
    },

    _toggleDisableButton : function(templateName,id,makeDisabled){
        var $el = $("#"+templateName + " #"+id);
        if(makeDisabled) {
            $el.attr("disabled","disabled");
        }else{
            $el.removeAttr("disabled","disabled");
        }
    }
};