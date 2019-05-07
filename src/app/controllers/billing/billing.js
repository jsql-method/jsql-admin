(function (angular) {
    "use strict";

    angular.module("jsql").controller("BillingController", BillingController);

    /**
     * @ngInject
     */
    function BillingController(AuthService) {
        var vm = this;

        vm.plan = null;
        vm.appPercentage = 0;
        vm.devPercentage = 0;

        function getPlan() {
            vm.plan = AuthService.getPlan();

            vm.appPercentage = (vm.plan.usedApps * 100 ) / vm.plan.maxApps;
            vm.devPercentage = (vm.plan.usedUsers * 100 ) / vm.plan.maxUsers;

        }

        getPlan();

    }
})(angular);
