(function (angular) {
    "use strict";

    angular.module("jsql").controller("TeamController", TeamController);

    /**
     * @ngInject
     */
    function TeamController(AuthService, DeveloperService, UtilsService, DictService) {
        var vm = this;

        vm.loading = true;

        vm.messages = null;
        vm.developer = null;
        vm.applications = null;
        vm.section = "list-developers";

        vm.addDeveloper = addDeveloper;
        vm.deleteDeveloper = deleteDeveloper;
        vm.getApplicationsDeveloper = getApplicationsDeveloper;
        vm.assignDeveloper = assignDeveloper;
        vm.unassingDeveloper = unassingDeveloper;
        vm.backToList = backToList;

        init();

        //--------
        function init() {
            getDevelopers();
        }

        function getApplicationsDeveloper(developerId) {

            DictService.applications().then(function(result){

                var applications = result;
                DeveloperService.getDeveloperApplications(developerId).then(function (result) {

                });

            });

        }

        function getDevelopers() {
            DictService.developers().then(function (result) {
                vm.developers = result;
            });
        }

        function deleteDeveloper(developerId) {

            UtilsService.openModal(translation.are_you_sure, true,
                translation.delete_developer, 'warnning',
                translation.delete_developer, deleteDeveloper.bind(this, developerId)
            );

            function deleteDeveloper(developerId) {

                console.log('developerId', developerId);

                DeveloperService.deleteDeveloper(developerId).then(function (result) {

                    if (UtilsService.hasGeneralError(result)) {
                        UtilsService.openFailedModel(UtilsService.getGeneralError(result));
                    } else if (UtilsService.hasErrors(result)) {
                        vm.messages = UtilsService.getErrors(result);
                    } else {

                        DictService.refresh('developers');
                        getDevelopers();
                        backToList();

                        UtilsService.openSuccessModal(translation.developer_deleted);
                    }

                });

            }
        }


        function backToList() {
            vm.section = "list-developers";
            vm.messages = null;
        }

        function addDeveloper() {

            DeveloperService.addDeveloper(vm.developer).then(function (result) {

                if (UtilsService.hasGeneralError(result)) {
                    UtilsService.openFailedModel(UtilsService.getGeneralError(result));
                } else if (UtilsService.hasErrors(result)) {
                    vm.messages = UtilsService.getErrors(result);
                } else {

                    DictService.refresh('developers');
                    getDevelopers();
                    backToList();

                    UtilsService.openSuccessModal(translation.developer_created);
                }

            });
        }

        /* -----------------------------------------------------------------------  */

        /* Section manage applications developer */


        function checkAssignApplication(id) {
            for (var i = 0; i < vm.developerApplication.length; i++) {
                if (vm.developerApplication[i] === id) {
                    return true;
                }
            }

            return false;
        }

        function addDeveloperToApplication(id) {
            var data = {
                developer: vm.developers[vm.editDeveloper].id,
                application: id
            };

            DeveloperService.addDeveloperToApplication(data).then(function () {
                getApplicationsDeveloper(vm.editDeveloper);
            });
        }

        function deleteDeveloperWithApplication(id) {
            var data = {
                developer: vm.developers[vm.editDeveloper].id,
                application: id
            };

            DeveloperService.deleteDeveloperWithApplication(data).then(function () {
                getApplicationsDeveloper(vm.editDeveloper);
            });
        }


    }
})(angular);
