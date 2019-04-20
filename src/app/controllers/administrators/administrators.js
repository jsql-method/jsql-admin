(function (angular) {
    "use strict";

    angular.module("jsql").controller("AdministratorsController", AdministratorsController);

    /**
     * @ngInject
     */
    function AdministratorsController(AuthService, AdminService, UtilsService, DictService, SERVER_URL) {
        var vm = this;

        vm.loading = true;

        vm.messages = null;
        vm.admin = {};
        vm.admins = [];
        vm.section = "list-admins";

        vm.addAdmin = addAdmin;
        vm.deleteAdmin = deleteAdmin;
        vm.demoteAdmin = demoteAdmin;
        vm.getImage = getImage;
        vm.backToList = backToList;
        vm.goToAddAdmin = goToAddAdmin;

        init();

        //--------
        function init() {
            getAdmins();
        }

        function goToAddAdmin(){
            vm.admin = {};
            vm.section = 'add-admin'
        }

        var timestamp = new Date().getTime();
        function getImage(hash) {
            return SERVER_URL + '/api/avatar/hash/' + hash+'gfd3dsfs?t='+timestamp;
        }

        function getAdmins() {

            vm.admin = {};
            vm.loading = true;

            DictService.refresh('admins');
            DictService.admins().then(function (result) {
                vm.admins = result;
                vm.loading = false;
            });
        }

        function deleteAdmin(adminId) {

            UtilsService.openModal(translation.are_you_sure, true,
                translation.delete_admin, 'warnning',
                translation.delete_admin, deleteAdmin.bind(this, adminId)
            );

            function deleteAdmin(adminId) {

                AdminService.deleteAdmin(adminId).then(function (result) {

                    if (UtilsService.hasGeneralError(result)) {
                        UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                    } else {

                        getAdmins();
                        backToList();

                        UtilsService.openSuccessModal(translation.admin_deleted);
                    }

                });

            }
        }


        function backToList() {
            vm.section = "list-admins";
            vm.messages = null;
        }

        function addAdmin() {

            AdminService.addAdmin({
                email: vm.admin.email,
                firstName: vm.admin.firstName,
                lastName: vm.admin.lastName
            }).then(function (result) {

                if (UtilsService.hasGeneralError(result)) {
                    UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                } else if (UtilsService.hasErrors(result)) {
                    vm.messages = UtilsService.getErrors(result);
                } else {

                    getAdmins();
                    backToList();

                    UtilsService.openSuccessModal(translation.admin_created);
                }

            });
        }

        function demoteAdmin(admin) {

            console.log(admin);

            AdminService.demoteAdmin({
                email: admin.email
            }).then(function (result) {

                console.log(result);

                if (UtilsService.hasGeneralError(result)) {
                    UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                }else{
                    getAdmins();
                }

            });

        }

    }
})(angular);
