(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("LoginController", ["AuthService", "UtilsService", LoginController]);

    /**
     * @ngInject
     */
    function LoginController(AuthService, UtilsService) {
        var vm = this;

        vm.email = '';
        vm.password = '';
        vm.generalMessage = '';


        if (window.location.href.indexOf('deactivated') > -1) {
            UtilsService.openSuccessModal(translation.account_deactivated);
        }

        vm.submitLogin = function () {

            vm.generalMessage = '';
            vm.messages = null;

            AuthService.login(
                {
                    email: vm.email,
                    password: vm.password
                },
                function (result) {

                    if (result.status !== 200) {

                        if (result.status === 401) {
                            vm.generalMessage = translation.unauthorized;
                        } else if (result.status === 204) {
                            vm.messages = UtilsService.getErrors(result);
                        }

                    }


                }
            );
        };


    }
})(angular);
