(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("ResetController", ["AuthService", "UtilsService", "$stateParams", ResetController]);

    /**
     * @ngInject
     */
    function ResetController(AuthService, UtilsService, $stateParams) {
        var vm = this;

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
                        UtilsService.openFailedModel();
                    }else if (UtilsService.hasErrors(result)) {
                        vm.messages = UtilsService.getErrors(result);
                    } else {
                        UtilsService.openSuccessModal(translation.passwordChanged, function(){
                            window.location.href = "/login";
                        });
                    }


                });
        };
    }
})(angular);
