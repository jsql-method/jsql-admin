(function (angular) {
    "use strict";

    angular.module("jsql").controller("ProfileController", ProfileController);

    /**
     * @ngInject
     */
    function ProfileController(AuthService, DictService, $uibModal, EventEmitterService, $injector, SERVER_URL, UtilsService) {
        var vm = this;

        vm.avatar = null;
        vm.profile = null;
        vm.changePassword = {
            oldPassword: '',
            newPassword: '',
            repeatNewPassword: ''
        };

        vm.messagesChangePassword = null;
        vm.messagesProfile = null;

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

        function clickSelect(){
            document.getElementById('avatar').click();
        }

        function getProfile() {

            DictService.profile()
                .then(function (result) {
                    vm.profile = result.data;
                });

        }

        function getImage() {
            vm.avatar = SERVER_URL + '/api/avatar/' + AuthService.getToken();
        }

        function uploadImage(element) {
            var reader = new FileReader();
            var objFormData = new FormData();

            if (element.files[0].type !== 'image/jpeg' && element.files[0].type !== 'image/jpg' && element.files[0].type !== 'image/png') {
                openModal("Please upload only image type files. (jpg jpeg gif png)");
                return;
            }

            if (element.files[0].size > 2097152) {
                openModal("The maximum file size 2Mb!");
                return;
            }

            reader.onload = function (event) {
                document.getElementsByClassName("upload-image-user")[0].src =
                    event.target["result"];
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
                if (response.code === 200) {
                    EventEmitterService.broadcast(
                        EventEmitterService.namespace.AVATAR
                    );
                    openModal("Upload picture is successfull!")
                }
            }, function (error) {
                console.log('Add record error: ', error);
            });
        }

        function updateProfile() {

            AuthService.updateUserDetails(vm.profile.id, data)
                .then(function (result) {
                    if (result.data.code === 200) {
                        openModal(result.data.description);
                        DictService.refresh("profile");
                        getProfile();
                        EventEmitterService.broadcast(
                            EventEmitterService.namespace.PROFILE
                        );
                    }
                })
        }

        function updatePassword() {

            vm.messagesChangePassword = null;

            if (vm.changePassword.newPassword !== vm.changePassword.repeatNewPassword) {
                vm.messagesChangePassword.repeatNewPassword = translation.passwordNotTheSame;
                vm.messagesChangePassword.newPassword = translation.newPassword;
                return;
            }

            AuthService.changePassword({
                oldPassword: vm.changePassword.oldPassword,
                newPassword: vm.changePassword.newPassword
            })
                .then(function (result) {

                    if (result.status === 200) {

                        vm.changePassword = {
                            oldPassword: '',
                            newPassword: '',
                            repeatNewPassword: ''
                        };

                        UtilsService.openSuccessModal(translation.passwordChanged);
                    } else {
                        vm.messagesChangePassword = result.data;
                    }

                });

        }

        function deactivateAccount() {

            UtilsService.openModal("Are you sure?", true, "Yes", "warning", "Delete account", deactivateAccount);

            function deactivateAccount() {

                AuthService.deactivateAccount().then(function (result) {
                    if (result.data.code === 200) {
                        AuthService.logout()
                            .then(function () {
                                AuthService.deleteSession();
                                window.location.href = "/auth/login";
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
