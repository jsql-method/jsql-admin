(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("ResetPasswordController", ["AuthService", "UtilsService", ResetPasswordController]);

    /**
     * @ngInject
     */
    function ResetPasswordController(AuthService, UtilsService) {
        var vm = this;

        vm.email = '';
        vm.messages = null;

        vm.submitForgotPassword = function () {

            vm.generalMessage = '';
            vm.messages = null;

            AuthService.forgotPassword({
                    email: vm.email
                }).then(function (result) {

                    if (UtilsService.hasErrors(result)) {
                        vm.messages = UtilsService.getErrors(result);
                    } else {
                        UtilsService.openSuccessModal(translation.forgot_password, function(){
                            window.location.href = "/login";
                        });
                    }

                });

        };
    }
})(angular);
