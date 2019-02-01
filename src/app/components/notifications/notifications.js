(function(angular) {
  "use strict";

  angular.module("jsql").directive("jsqlNotifications", jsqlNotifications);

  /**
   * @ngInject
   */
  function jsqlNotifications(EventEmitterService) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "app/components/notifications/notifications.html",
      controllerAs: "vm",
      bindToController: true,
      scope: true,
      controller: function($timeout) {
        var vm = this;

        const VISIBILITY_TIME = 5;

        vm.notifications = [];
        vm.remove = remove;
        vm.getTimeText = getTimeText;

        init();

        function init() {

          EventEmitterService.on(
            EventEmitterService.namespace.NOTIFICATION,
            function(notification) {

              notification.minutes = 4;
              vm.notifications.push(notification);
            }

          );

          calculateTime();

        }

        function calculateTime() {

          $timeout(function() {

            angular.forEach(vm.notifications, function(notification, index) {
              notification.minutes++;

              if (notification.minutes > VISIBILITY_TIME) {
                remove(notification);
              }
            });

            calculateTime();

          }, 1000 * 60);

        }

        function remove(notification) {

          vm.notifications = _.without(vm.notifications, notification);

        }

        function getTimeText(minutes) {

          if (minutes === 0) {
            return "just now";
          } else if (minutes === 1) {
            return minutes + " minute ago";
          }

          return minutes + " minutes ago";

        }
      }
    };
  }
})(angular);
