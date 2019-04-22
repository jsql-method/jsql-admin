(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("AddApplicationController", AddApplicationController);

    /**
     * @ngInject
     */
    function AddApplicationController(AuthService, ApplicationService, DictService, EventEmitterService, UtilsService, $location) {

        var vm = this;

        function init(){

            vm.application = {
                name: ''
            };

        }

        init();

        vm.messages = null;

        vm.submitApplication = submitApplication;

        function submitApplication() {

            vm.messages = null;

            ApplicationService.createApplication(vm.application)
                .then(function (result) {

                    if (UtilsService.hasGeneralError(result)) {
                        UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                    } else if (UtilsService.hasErrors(result)) {
                        vm.messages = UtilsService.getErrors(result);
                    } else {

                        init();

                        DictService.refresh("applications");
                        EventEmitterService.broadcast(
                            EventEmitterService.namespace.APPLICATIONS
                        );

                        var applicationId = result.data.message;

                        UtilsService.openSuccessModal(translation.applicationCreated, function(){

                            $location.path('/application/'+applicationId);
                        });
                    }


                });

        }

    }
})(angular);
