(function (angular) {
    "use strict";

    angular.module("jsql").controller("ProfileController", ProfileController);

    /**
     * @ngInject
     */
    function ProfileController($timeout, $scope, AuthService, DictService, $uibModal, EventEmitterService, $injector, SERVER_URL, UtilsService) {
        var vm = this;

        vm.loading = true;
        vm.avatar = null;
        vm.profile = null;
        vm.changePassword = {
            oldPassword: '',
            newPassword: '',
            repeatNewPassword: ''
        };

        vm.messagesChangePassword = {};
        vm.messagesProfile = {};

        vm.uploadImage = uploadImage;
        vm.deactivateAccount = deactivateAccount;
        vm.updateProfile = updateProfile;
        vm.updatePassword = updatePassword;
        vm.clickSelect = clickSelect;

        init();

        //--------
        function init() {
            getProfile();
            getImage();
        }

        function clickSelect() {
            document.getElementById('avatar').click();
        }

        function getProfile() {

            DictService.profile()
                .then(function (result) {
                    vm.profile = result;
                    vm.loading = false;
                });

        }

        function getImage() {
            vm.avatar = SERVER_URL + '/api/avatar/' + AuthService.getToken() + '?t=' + new Date().getTime();
        }

        function uploadImage(element) {

            vm.messagesProfile = {};

            var reader = new FileReader();
            var objFormData = new FormData();

            if (element.files[0].type !== 'image/jpeg' && element.files[0].type !== 'image/jpg' && element.files[0].type !== 'image/png') {
                vm.messagesProfile.avatar = translation.avatar_required_ext;
                $scope.$digest();
                return false;
            }

            if (element.files[0].size > 1148576) {
                vm.messagesProfile.avatar = translation.avatar_maximum_size;
                $scope.$digest();
                return false;
            }

            reader.onload = function (event) {
                getImage();
                $scope.$digest();
            };

            objFormData.append("file", element.files[0]);

            reader.readAsDataURL(element.files[0]);
            $.ajax({
                type: "POST",
                enctype: 'multipart/form-data',
                url: SERVER_URL + '/api/avatar',
                data: objFormData,
                processData: false,
                contentType: false,
                cache: false,
                timeout: 600000,
                headers: {
                    Session: $injector.get("AuthService").getToken() || "none"
                }
            }).then(function (response) {

                    if (response.status === 200) {

                        $timeout(function(){

                            getImage();
                            EventEmitterService.broadcast(
                                EventEmitterService.namespace.AVATAR
                            );
                            $scope.$digest();

                        });

                        UtilsService.openSuccessModal(translation.avatar_uploaded)
                    }

                    $scope.$digest();



            }, function () {
                $scope.$digest();
            });

        }

        function updateProfile() {

            vm.messagesProfile = {};

            AuthService.updateUserDetails({
                email: vm.profile.email,
                firstName: vm.profile.firstName,
                lastName: vm.profile.lastName
            })
                .then(function (result) {

                    if(UtilsService.hasGeneralError(result)){
                        UtilsService.openFailedModel();
                    }else if (UtilsService.hasErrors(result)) {
                        vm.messagesChangePassword = UtilsService.getErrors(result);
                    } else {

                        EventEmitterService.broadcast(
                            EventEmitterService.namespace.SESSION
                        );

                        DictService.refresh("profile");
                        getProfile();
                        EventEmitterService.broadcast(
                            EventEmitterService.namespace.PROFILE
                        );

                        UtilsService.openSuccessModal(translation.profileUpdated);
                    }



                });
        }

        function updatePassword() {

            vm.messagesChangePassword = {};

            if(vm.changePassword.newPassword !== vm.changePassword.repeatNewPassword){
                vm.messagesChangePassword.repeatNewPassword = translation.passwordNotTheSame;
                return;
            }

            AuthService.changePassword({
                oldPassword: vm.changePassword.oldPassword,
                newPassword: vm.changePassword.newPassword
            })
                .then(function (result) {

                    if(UtilsService.hasGeneralError(result)){
                        UtilsService.openFailedModel();
                    }else if (UtilsService.hasErrors(result)) {
                        vm.messagesChangePassword = UtilsService.getErrors(result);
                    } else {

                        vm.changePassword = {
                            oldPassword: '',
                            newPassword: '',
                            repeatNewPassword: ''
                        };

                        UtilsService.openSuccessModal(translation.passwordChanged);
                    }
ó
                });

        }

        function deactivateAccount() {

            UtilsService.openModal(translation.are_you_sure, true, translation.yes, "warning", translation.delete_account, deactivateAccount);

            function deactivateAccount() {

                AuthService.deactivateAccount().then(function (result) {
                    if (result.status === 200) {

                        if(UtilsService.hasGeneralError(result)){
                            UtilsService.openFailedModel(UtilsService.getGeneralError(result));
                            return;
                        }

                        AuthService.logout()
                            .then(function () {
                                AuthService.deleteSession();
                                window.location.href = "/login";
                            })
                            .catch(function (error) {
                                console.log(error);
                            });

                    }
                });

            }

        }

    }
})(angular);
