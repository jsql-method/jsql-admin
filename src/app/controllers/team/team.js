(function (angular) {
    "use strict";

    angular.module("jsql").controller("TeamController", TeamController);

    /**
     * @ngInject
     */
    function TeamController(AuthService, DeveloperService, UtilsService, DictService, SERVER_URL, EndpointsFactory) {
        var vm = this;

        vm.loading = true;

        vm.role = AuthService.getRole();
        vm.messages = null;
        vm.developer = {};
        vm.developers = [];
        vm.applications = [];
        vm.section = "list-developers";

        vm.addDeveloper = addDeveloper;
        vm.deleteDeveloper = deleteDeveloper;
        vm.getApplicationsDeveloper = getApplicationsDeveloper;
        vm.assignDeveloper = assignDeveloper;
        vm.unassingDeveloper = unassingDeveloper;
        vm.getImage = getImage;
        vm.backToList = backToList;
        vm.goToAddDeveloper = goToAddDeveloper;
        vm.advanceDeveloper = advanceDeveloper;

        init();

        //--------
        function init() {
            getDevelopers();
        }

        function goToAddDeveloper(){
            vm.developer = {};
            vm.section = 'add-developer'
        }

        var timestamp = new Date().getTime();
        function getImage(hash) {
            return SERVER_URL + '/api/avatar/hash/' + hash+'gfd3dsfs?t='+timestamp;
        }

        function getApplicationsDeveloper(developerId) {

            vm.developer = _.find(vm.developers, {id: developerId});
            vm.loading = true;

            DictService.applications().then(function(result){

                var applications = result;
                DeveloperService.getDeveloperApplications(developerId).then(function (result) {

                    vm.section = 'application-developer';
                    vm.applications = mergeApplicationsPrivileges(applications, result.data);
                    vm.loading = false;

                });

            });

        }

        function mergeApplicationsPrivileges(allApplications, developerApplications){

            var apps = [];

            for(var i = 0; i < allApplications.length; i++){

                var application = allApplications[i];
                var assignedApp = _.find(developerApplications, { applicationId: application.id });

                apps.push({
                    id: application.id,
                    assigned: !!assignedApp,
                    name: application.name
                });

            }

            return apps;

        }

        function getDevelopers() {

            vm.developer = {};
            vm.loading = true;

            DictService.refresh('developers');
            DictService.developers().then(function (result) {
                vm.developers = result;
                vm.loading = false;
            });
        }

        function deleteDeveloper(developerId) {

            UtilsService.openModal(translation.are_you_sure, true,
                translation.delete_developer, 'warnning',
                translation.delete_developer, deleteDeveloper.bind(this, developerId)
            );

            function deleteDeveloper(developerId) {

                DeveloperService.deleteDeveloper(developerId).then(function (result) {

                    if (UtilsService.hasGeneralError(result)) {
                        UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                    } else {

                        AuthService.refreshPlan();
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

            DeveloperService.addDeveloper({
                email: vm.developer.email,
                firstName: vm.developer.firstName,
                lastName: vm.developer.lastName
            }).then(function (result) {

                if (UtilsService.hasGeneralError(result)) {
                    UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                } else if (UtilsService.hasErrors(result)) {
                    vm.messages = UtilsService.getErrors(result);
                } else {

                    AuthService.refreshPlan();
                    getDevelopers();
                    backToList();

                    UtilsService.openSuccessModal(translation.developer_created);
                }

            });
        }

        function assignDeveloper(application){

            DeveloperService.addDeveloperToApplication({
                developer: vm.developer.id,
                application: application.id
            }).then(function (result) {

                if (UtilsService.hasGeneralError(result)) {
                    UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                }else{
                    application.assigned = true;
                }

            });

        }

        function unassingDeveloper(application) {

            DeveloperService.deleteDeveloperWithApplication({
                developer: vm.developer.id,
                application: application.id
            }).then(function (result) {

                if (UtilsService.hasGeneralError(result)) {
                    UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                }else{
                    application.assigned = false;
                }

            });

        }

        function advanceDeveloper(developer) {

            UtilsService.openModal(translation.are_you_sure_advance_developer, true,
                translation.advance_developer, 'warning',
                translation.advance_developer, advanceDeveloper.bind(this, developer)
            );

            function advanceDeveloper(developer){

                EndpointsFactory.advanceDeveloper({
                    email: developer.email
                }).$promise.then(function (result) {

                    if (UtilsService.hasGeneralError(result)) {
                        UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                    }else{
                        getDevelopers();
                    }

                });

            }


        }

    }
})(angular);
