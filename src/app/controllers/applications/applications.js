(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("ApplicationsController", ApplicationsController);

    /**
     * @ngInject
     */
    function ApplicationsController(AuthService, UtilsService, DictService, $location, $stateParams, EventEmitterService, ApplicationService) {
        var vm = this;

        vm.loading = true;
        vm.id = parseInt($stateParams.id);
        vm.application = null;
        vm.productionInfo = translation.applicationInProduction;
        vm.productionKeyInfo = translation.productionKeyInfo;

        vm.copyKey = copyKey;
        vm.deleteApplication = deleteApplication;
        vm.saveToFile = saveToFile;

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

        function copyKey(id) {
            UtilsService.copyToClipboard(id, id === 'applicationKey' ? translation.apiKeyCopiedToClipboard : translation.productionKeyCopiedToClipboard);
        }

        function saveToFile(){
            UtilsService.saveToFile(vm.application.developerKey, 'jsql');
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
