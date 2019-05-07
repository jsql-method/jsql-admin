(function (angular) {
    "use strict";

    angular.module("jsql").directive("jsqlNotifications", jsqlNotifications);

    /**
     * @ngInject
     */
    function jsqlNotifications(UtilsService, EventEmitterService, $timeout) {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "app/components/notifications/notifications.html",
            controllerAs: "vm",
            bindToController: true,
            scope: true,
            controller: function () {
                var vm = this;

                const VISIBILITY_TIME = 5;
                const MAX_NOTIFICATIONS = 3;

                vm.notifications = [];
                vm.remove = remove;
                vm.getTimeText = getTimeText;

                init();

                function init() {

                    EventEmitterService.on(
                        EventEmitterService.namespace.NOTIFICATION,
                        function (notification) {

                            console.log(notification);

                            notification.id = UtilsService.getRandomFloor(10, 100);
                            notification.seconds = 0;
                            notification.time = "just now";

                            if(vm.notifications.length > MAX_NOTIFICATIONS){
                                vm.notifications = vm.notifications.slice(1, vm.notifications.length);
                            }

                            vm.notifications.push(notification);
                        }
                    );

                    calculateTime();

                }

                function calculateTime() {

                    $timeout(function () {

                        angular.forEach(vm.notifications, function (notification, index) {
                            notification.seconds++;

                            notification.time = getTimeText(notification.seconds);

                            if (notification.seconds > VISIBILITY_TIME) {
                                remove(notification);
                            }

                        });

                        calculateTime();

                    }, 1000);

                }

                function remove(notification) {
                    vm.notifications = _.filter(vm.notifications, function (n) {
                        return n.id !== notification.id;
                    });
                }

                function getTimeText(seconds) {

                    if (seconds === 0) {
                        return "just now";
                    } else if (seconds < 60) {
                        return seconds + " seconds ago";
                    }
                    if (seconds > 60) {
                        return Math.round(seconds / 60) + " minute ago";
                    }

                    return "just now";

                }
            }
        };
    }
})(angular);
