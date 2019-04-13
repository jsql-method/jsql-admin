(function(angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("ActivateController", ActivateController);

    /**
     * @ngInject
     */
    function ActivateController(AuthService, $stateParams, $uibModal, $state) {
        var vm = this;
        var token = $stateParams.id;

        init();

        //--------
        function init() {

            AuthService.activateAccount(token)
                .then(function (result) {

                    if(result.data.code === 200){
                        openModal(
                            result.data.data,
                            false,
                            false,
                            "success",
                            "Account activation",
                            null
                        );
                    }
                    if(result.data.code === 616) {
                        openModalReactivateAccount(result.data.data);
                    }

                })

        }

        function openModalReactivateAccount(text) {

            openModal(
                 text + ". Do you want to restart the activation key?",
                true,
                "Yes",
                "warning",
                "Reactivate Account",
                reactivateAccount
            );

        }

        function reactivateAccount() {

            var data  = {
              token: token
            };

            AuthService.reactivateAccount(data)
                .then(function (result) {

                    if(result.data.code === 200) {
                        openModal(
                            'Check your email and activate your account!',
                            false,
                            false,
                            "success",
                            "Reactivate Account",
                            null
                        )
                    }

                })

        }

        function openModal(text, vissibleButtonDelete, submitTextButton, clazz, title, callBack) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "app/modals/message/message.html",
                controller: "MessageController",
                controllerAs: "vm",
                resolve: {
                    Data: function() {

                        return {
                            clazz: clazz || "success",
                            title: title || "Good job!",
                            message: text,
                            vissibleButtonDelete: vissibleButtonDelete,
                            submit: submitTextButton
                        };

                    }
                }
            });

            modalInstance.result.then(
                function(result) {

                    if (result) {
                        if (callBack) callBack();
                        else $state.go('login');
                    } else {
                        $state.go('login');
                    }

                },
                function() {

                    $state.go('login');

                }
            );

        }

    }
})(angular);
