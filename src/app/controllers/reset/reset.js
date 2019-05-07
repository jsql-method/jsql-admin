(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("ResetController", ["AuthService", "UtilsService", "$stateParams", "$state", ResetController]);

    /**
     * @ngInject
     */
    function ResetController(AuthService, UtilsService, $stateParams, $state) {
        var vm = this;

        vm.isActivation = window.location.href.indexOf("activate") > -1;

        vm.changePassword = {};
        vm.messages = {};

        vm.submitReset = function () {

            vm.messages = {};

            if(vm.changePassword.newPassword !== vm.changePassword.repeatNewPassword){
                vm.messages.repeatNewPassword = translation.passwordNotTheSame;
                return;
            }

            var token = $stateParams.token;
            AuthService.reset(token, {
                    newPassword: vm.changePassword.newPassword
                }).then(function (result) {

                    if(UtilsService.hasGeneralError(result)){
                        UtilsService.openFailedModal();
                    }else if (UtilsService.hasErrors(result)) {
                        vm.messages = UtilsService.getErrors(result);
                    } else {
                        UtilsService.openSuccessModal(vm.isActivation ? translation.account_activated : translation.passwordChanged, function(){
                            window.location.href = "/login";
                        });
                    }


                });
        };
    }
})(angular);
