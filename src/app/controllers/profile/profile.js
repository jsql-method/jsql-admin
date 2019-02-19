(function (angular) {
    "use strict";

    angular.module("jsql").controller("ProfileController", ProfileController);

    /**
     * @ngInject
     */
    function ProfileController(
        AuthService,
        DictService,
        $uibModal,
        EventEmitterService,
        $injector,
        SERVER_URL
    ) {
        var vm = this;

        vm.profile = "";
        vm.firstName = "";
        vm.lastName = "";
        vm.email = "";
        vm.uploadImage = uploadImage;

        init();

        //--------
        function init() {
            getProfile();
            getImage();
        }

        function getProfile() {
            DictService.profile()
                .then(function (result) {
                    vm.profile = result;
                    updateInputs();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function getImage() {
            AuthService.getImage()
                .then(function (result) {
                    document.getElementsByClassName("upload-image-user")[0].src
                        = 'data:image/jpeg;base64,' + result.data;
                })
        }

        function updateInputs() {
            vm.firstName = vm.profile.firstName;
            vm.lastName = vm.profile.lastName;
            vm.email = vm.profile.email;
        }

       function uploadImage(element) {
            var reader = new FileReader();
            var objFormData = new FormData();

            if(element.files[0].type !== 'image/jpeg' && element.files[0].type !== 'image/jpg' && element.files[0].type !== 'image/png') {
                openModal("Please upload only image type files. (jpg jpeg gif png)");
                return;
            }

            if(element.files[0].size > 2097152) {
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
                if(response.code === 200) {
                    EventEmitterService.broadcast(
                        EventEmitterService.namespace.AVATAR
                    );
                    openModal("Upload picture is successfull!")
                }
            }, function (error) {
                console.log('Add record error: ', error);
            });
        }

        var onTouchFirstName = false;
        var onTouchLastName = false;

        vm.messagesUpdateProfile = {
            firstName: [],
            lastName: []
        };

        vm.generalMessageUpdateProfile = "";
        vm.validateUpdateProfil = validateUpdateProfil;
        vm.validateFirstName = validateFirstName;
        vm.validateLastName = validateLastName;

        function validateUpdateProfil() {
            onTouchFirstName = true;
            onTouchLastName = true;

            vm.generalMessageUpdateProfile = "";

            validateFirstName();
            validateLastName();

            for (var messagesValidate in vm.messagesUpdateProfile) {
                if (vm.messagesUpdateProfile[messagesValidate].length > 0) {
                    return;
                }
            }

            submitUpdateProfile();
        }

        function validateFirstName(result) {
            if (result !== undefined) {
                onTouchFirstName = result;
            }

            if (!onTouchFirstName) {
                return;
            }

            var regFirstName = /^[A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ]{1,}[\s]{0,1}[A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ]{0,}$/m;

            vm.messagesUpdateProfile.firstName = [];

            if (vm.firstName.length === 0) {
                vm.messagesUpdateProfile.firstName.push("First name can't be blank!");
            }

            if (vm.firstName && regFirstName.test(vm.firstName) == false) {
                vm.messagesUpdateProfile.firstName.push("Only letters. Max two names!");
                return;
            }

            if (vm.firstName.length > 100) {
                vm.messagesUpdateProfile.firstName.push(
                    "Max length number of characters 100!"
                );
            }
        }

        function validateLastName(result) {
            if (result !== undefined) {
                onTouchLastName = result;
            }

            if (!onTouchLastName) {
                return;
            }

            var regLastName = /^[A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ][A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ-]{0,}$/;

            vm.messagesUpdateProfile.lastName = [];

            if (vm.lastName.length === 0) {
                vm.messagesUpdateProfile.lastName.push("Last name can't be blank!");
            }

            if (vm.lastName && regLastName.test(vm.lastName) == false) {
                vm.messagesUpdateProfile.lastName.push(
                    "Only letters. Max two elements separated by a hyphen!"
                );
                return;
            }

            if (vm.lastName.length > 100) {
                vm.messagesUpdateProfile.lastName.push(
                    "Max length number of characters 100!"
                );
            }
        }

        function submitUpdateProfile() {
            let data = {
                firstName: vm.firstName,
                lastName: vm.lastName
            };

            if (
                vm.firstName === vm.profile.firstName &&
                vm.lastName === vm.profile.lastName
            ) {
                return;
            }

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

        /* ------------------------------ */

        /* Section password update */

        var onTouchCurrentPassword = false;
        var onTouchPassword = false;
        var onTouchRepeatPassword = false;

        vm.generalMessageUpdatePassword = "";
        vm.validateUpdatePassword = validateUpdatePassword;
        vm.validateCurrentPassword = validateCurrentPassword;
        vm.validatePassword = validatePassword;
        vm.validateRepeatPassword = validateRepeatPassword;
        vm.submitChangePassword = submitChangePassword;
        vm.deactiveAccountOpenModal = deactiveAccountOpenModal;

        vm.messagesUpdatePassword = {
            currentPassword: [],
            password: [],
            repeatPassword: []
        };

        vm.currentPassword = "";
        vm.password = "";
        vm.repeatPassword = "";

        function validateUpdatePassword() {
            onTouchCurrentPassword = true;
            onTouchPassword = true;
            onTouchRepeatPassword = true;

            vm.generalMessageUpdatePassword = "";

            validateCurrentPassword();
            validatePassword();

            for (var messagesValidate in vm.messagesUpdatePassword) {
                if (vm.messagesUpdatePassword[messagesValidate].length > 0) {
                    return;
                }
            }
            submitChangePassword();
        }

        function validateCurrentPassword(result) {
            if (result !== undefined) {
                onTouchCurrentPassword = result;
            }

            if (!onTouchCurrentPassword) {
                return;
            }

            vm.messagesUpdatePassword.currentPassword = [];

            if (vm.currentPassword.length === 0) {
                vm.messagesUpdatePassword.currentPassword.push(
                    "Current password can't be blank!"
                );
            }

            if (vm.currentPassword.length > 100) {
                vm.messagesUpdatePassword.currentPassword.push(
                    "Max length number of characters 100!"
                );
            }
        }

        function validatePassword(result) {
            if (result !== undefined) {
                onTouchPassword = result;
            }

            if (!onTouchPassword) {
                return;
            }

            var regPassword = /^(?=\S*[a-zA-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;

            vm.messagesUpdatePassword.password = [];

            if (vm.password.length === 0) {
                vm.messagesUpdatePassword.password.push("Password can't be blank!");
            }

            if (vm.password && regPassword.test(vm.password) == false) {
                vm.messagesUpdatePassword.password.push(
                    "Minimum 8 characters, at least one letter, one number and one special character!"
                );
                validateRepeatPassword();
                return;
            }

            if (vm.password.length > 100) {
                vm.messagesUpdatePassword.password.push(
                    "Max length number of characters 100!"
                );
            }
            validateRepeatPassword();
        }

        function validateRepeatPassword(result) {
            if (result !== undefined) {
                onTouchRepeatPassword = result;
            }

            if (!onTouchRepeatPassword) {
                return;
            }

            vm.messagesUpdatePassword.repeatPassword = [];

            if (vm.password !== vm.repeatPassword) {
                vm.messagesUpdatePassword.repeatPassword.push(
                    "Passwords does not match!"
                );
            }
        }

        function submitChangePassword() {
            let data = {
                oldPassword: vm.currentPassword,
                newPassword: vm.password
            };

            AuthService.changePassword(data)
                .then(function (result) {
                    if (result.data.code === 200) {
                        vm.currentPassword = "";
                        vm.password = "";
                        vm.repeatPassword = "";
                        openModal(result.data.description);
                    } else {
                        vm.generalMessageUpdatePassword = result.data.description;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        function deactiveAccountOpenModal() {
            openModal(
                "Are you sure?",
                true,
                "Yes",
                "warning",
                "Delete account!",
                deactiveAccount
            );
        }

        function deactiveAccount() {
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

        function openModal(
            text,
            vissibleButtonDelete,
            submitTextButton,
            clazz,
            title,
            callBack
        ) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "app/modals/message/message.html",
                controller: "MessageController",
                controllerAs: "vm",
                resolve: {
                    Data: function () {
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
                function (result) {
                    if (result) {
                        if (callBack) callBack();
                    }
                },
                function () {
                }
            );
        }
    }
})(angular);
