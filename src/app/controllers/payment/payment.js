(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("PaymentController", ["EndpointsFactory", "UtilsService", "$state", "$timeout", PaymentController]);

    /**
     * @ngInject
     */
    function PaymentController(EndpointsFactory, UtilsService, $state, $timeout) {
        var vm = this;

        vm.info = null;

        vm.loadInfo = function () {

            var token = $state.params.hostedpage;
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
