/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
SeeAllNotificationController = BaseController.extend({
    onBeforeAction: 'loading',
  waitOn: function () {
      var self = this;
      return App.extensions._subscribe(self,'/notification/all');
  },

  data: function () {
  },

  action: function () {
    this.render();
  }
});
