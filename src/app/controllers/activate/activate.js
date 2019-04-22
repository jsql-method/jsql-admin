(function(angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("ActivateController", ActivateController);

    /**
     * @ngInject
     */
    function ActivateController(AuthService, $stateParams, UtilsService) {
        var vm = this;

        init();

        //--------
        function init() {

            AuthService.activateAccount($stateParams.token)
                .then(function (result) {

                    if (UtilsService.hasGeneralError(result)) {
                        UtilsService.openFailedModal(translation.activation_failed);
                    } else {
                        UtilsService.openSuccessModal(translation.account_activated, function(){
                            $location.path('/login');
                        });
                    }

                })

        }


    }
})(angular);
