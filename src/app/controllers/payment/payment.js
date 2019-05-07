(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("PaymentController", ["AuthService", "UtilsService", "$state", PaymentController]);

    /**
     * @ngInject
     */
    function PaymentController(AuthService, UtilsService, $state) {
        var vm = this;

        vm.info = null;

        vm.submitFeedback = function () {

            var token = $state.params.hostedpage;
            EndpointsFactory.verify(token).$promise.then(function (result) {

                if(UtilsService.hasGeneralError(result)){
                    UtilsService.openFailedModal();
                }else {
                    vm.info = result.data;
                }


            });
        };


    }
})(angular);
