(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("ApplicationsController", ApplicationsController);

    /**
     * @ngInject
     */
    function ApplicationsController(AuthService, UtilsService, DictService, $location, $stateParams, EventEmitterService, ApplicationService, $uibModal, $state) {
        var vm = this;

        vm.loading = true;
        vm.id = parseInt($stateParams.id);
        vm.application = null;

        vm.copyApiKey = copyApiKey;
        vm.deleteApplication = deleteApplication;

        init();

        //--------
        function init() {
            getApplication();
        }

        function getApplication() {

            DictService.applications()
                .then(function (result) {
                    vm.application = _.find(result, { id: vm.id });
                    vm.loading = false;
                })

        }

        function copyApiKey() {

            try {
                var copyText = document.getElementById("applicationKey");
                copyText.select();
                var successful = document.execCommand("copy");
                if (!successful) throw successful;
                copyText.setSelectionRange(0, 0);
                UtilsService.openSuccessModal(translation.apiKeyCopiedToClipboard);
            } catch (e) {
                console.log(e);
            }

        }

        function deleteApplication() {

            UtilsService.openModal(translation.are_you_sure, true, translation.yes, 'warning', translation.deleteApplication, deleteApplication);

            function deleteApplication(){

                ApplicationService.deleteApplication(vm.id)
                    .then(function (result) {

                        if (UtilsService.hasGeneralError(result)) {
                            UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                        } else {

                            DictService.refresh("applications");
                            EventEmitterService.broadcast(
                                EventEmitterService.namespace.APPLICATIONS
                            );
                            EventEmitterService.broadcast(
                                EventEmitterService.namespace.DELETE_APPLICATION
                            );

                            UtilsService.openSuccessModal(translation.applicationDeleted, function(){
                                $location.path('/builds');
                            });
                        }

                    })

            }



        }

    }
})(angular);
