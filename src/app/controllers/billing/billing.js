(function (angular) {
    "use strict";

    angular.module("jsql").controller("BillingController", BillingController);

    /**
     * @ngInject
     */
    function BillingController(AuthService, EndpointsFactory) {
        var vm = this;

        vm.plan = null;
        vm.appPercentage = 0;
        vm.devPercentage = 0;
        vm.accessUrl = null;

        function getPlan() {

            AuthService.refreshPlan().then(function(){

                vm.plan = AuthService.getPlan();

                vm.appPercentage = (vm.plan.usedApps * 100 ) / vm.plan.maxApps;
                vm.devPercentage = (vm.plan.usedUsers * 100 ) / vm.plan.maxUsers;

            });

        }

        getPlan();

        function getPabblyClientPortalAccess(){

            EndpointsFactory.getPabblyAccess().$promise.then(function(result){

                console.log(result);
                vm.accessUrl = result.data.accessUrl;

            });

        }

        getPabblyClientPortalAccess();


    }
})(angular);
