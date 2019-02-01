(function(angular) {
    "use strict";

    angular.module("jsql").controller("ResetController", ResetController);

    /**
     * @ngInject
     */
    function ResetController(
        AuthService,
        $stateParams,
        $uibModal,
        $state
    ) {
        var vm = this;
        var token = $stateParams.id;

        init();
        //--------
        function init() {

        }

        vm.password = "";
        vm.repeatPassword = "";

        vm.messages = {
            password: [],
            repeatPassword: [],
        };

        vm.generalMessage = "";

        var onTouchPassword = false;
        var onTouchRepeatPassword = false;

        vm.validateResetForm = function() {
            onTouchPassword = true;
            onTouchRepeatPassword = true;

            vm.generalMessage = "";

            vm.validatePassword();

            for (var messagesValidate in vm.messages) {
                if (vm.messages[messagesValidate].length > 0) {
                    return;
                }
            }

            submitReset();
        };

        vm.validatePassword = function(result) {
            if (result !== undefined) {
                onTouchPassword = result;
            }

            if (!onTouchPassword) {
                return;
            }

            var regPassword = /^(?=\S*[a-zA-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;

            vm.messages.password = [];

            if (vm.password.length === 0) {
                vm.messages.password.push("Password can't be blank!");
            }

            if (vm.password && regPassword.test(vm.password) == false) {
                vm.messages.password.push(
                    "Minimum 8 characters, at least one letter, one number and one special character!"
                );
                vm.validateRepeatPassword();
                return;
            }

            if (vm.password.length > 100) {
                vm.messages.password.push("Max length number of characters 100!");
            }
            vm.validateRepeatPassword();
        };

        vm.validateRepeatPassword = function(result) {
            if (result !== undefined) {
                onTouchRepeatPassword = result;
            }

            if (!onTouchRepeatPassword) {
                return;
            }

            vm.messages.repeatPassword = [];

            if (vm.password !== vm.repeatPassword) {
                vm.messages.repeatPassword.push("Passwords does not match!");
            }
        };

        function submitReset() {
            let data = {
                newPassword: vm.password
            };

            AuthService.reset(token, data)
                .then(function (result) {
                    if(result.data.code === 200) {
                        vm.openModal(result.data.description);
                    } else {
                        vm.openModal(result.data.description);
                    }
                })
        }

        vm.openModal = function(text) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "app/modals/message/message.html",
                controller: "MessageController",
                controllerAs: "vm",
                resolve: {
                    Data: function() {
                        return {
                            clazz: "success",
                            title: "Good job!",
                            message: text
                        };
                    }
                }
            });

            modalInstance.result.then(
                function() {
                    $state.go("login");
                },
                function() {
                    $state.go("login");
                }
            );
        };
    }
})(angular);
