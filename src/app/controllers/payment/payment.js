(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("PaymentController", ["EndpointsFactory", "UtilsService", "$stateParams", "$timeout", PaymentController]);

    /**
     * @ngInject
     */
    function PaymentController(EndpointsFactory, UtilsService, $stateParams, $timeout) {
        var vm = this;

        vm.info = null;

        vm.loadInfo = function () {

            var token = location.search.split('hostedpage=')[1];
            EndpointsFactory.verify(token).$promise.then(function (result) {

                if(UtilsService.hasGeneralError(result)){
                    UtilsService.openFailedModal();
                }else {
                    vm.info = result.data;
                }


            });
        };

        $timeout(vm.loadInfo);

    }
})(angular);
