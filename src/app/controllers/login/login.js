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

        vm.submitLogin = function () {

            vm.generalMessage = '';
            vm.messages = null;

            AuthService.login(
                {
                    email: vm.email,
                    password: vm.password
                },
                function (result) {

                    if (UtilsService.hasErrors(result)) {

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
