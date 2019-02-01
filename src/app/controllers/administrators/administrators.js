(function(angular) {
  "use strict";

  angular
    .module("jsql")
    .controller("AdministratorsController", AdministratorsController);

  /**
   * @ngInject
   */
  function AdministratorsController(AuthService, AdminService, MemberService, DictService, $uibModal, EventEmitterService) {

    var vm = this;
    var adminDeleteOrDemote = false;
    var onTouchEmail = false;
    var onTouchFirstName = false;
    var onTouchLastName = false;

    vm.admins = [];
    vm.section = "list-admins";
    vm.idDeleteAdmin = -1;
    vm.adminBody = null;
    vm.email = "";
    vm.firstName = "";
    vm.lastName = "";
    vm.generalMessage = "";
    vm.messages = {
      email: [],
      firstName: [],
      lastName: []
    };

    vm.deleteAdmin = deleteAdmin;
    vm.demoteAdmin = demoteAdmin;
    vm.deleteAdminOpenModal = deleteAdminOpenModal;
    vm.demoteAdminOpenModal = demoteAdminOpenModal;
    vm.backToListAdmins = backToListAdmins;
    vm.submitAddAdmin = submitAddAdmin;
    vm.validateAddAdmin = validateAddAdmin;
    vm.validateEmail = validateEmail;
    vm.validateFirstName = validateFirstName;
    vm.validateLastName = validateLastName;

    init();

    //--------
    function init() {

      getAdmins();

    }

    function getAdmins() {

      DictService.admins().then(function(result) {
        vm.admins = result;
      });

    }

     function deleteAdminOpenModal(id) {

      vm.idDeleteAdmin = id;
      openModal(
        "Are you sure?",
        true,
        "Yes",
        "warning",
        "Delete admin!",
        deleteAdmin
      );

    }

    function deleteAdmin() {

      MemberService.deleteMember(vm.idDeleteAdmin).then(function(result) {

        if (result.data.code === 200) {
          refreshAdmin();
          adminDeleteOrDemote = true;
          openModal(
            "The account has been deleted.",
            false,
            "Ok",
            "success",
            "Delete admin!"
          );
          EventEmitterService.broadcast(EventEmitterService.namespace.USERS);
        }

      });

    }

    function demoteAdminOpenModal(admin) {

      vm.adminBody = admin;
      openModal(
        "Are you sure?",
        true,
        "Yes",
        "warning",
        "Demote admin!",
        demoteAdmin
      );

    }

    function demoteAdmin() {

      let data = {
        password: "test123",
        email: vm.adminBody.email,
        firstName: vm.adminBody.firstName,
        lastName: vm.adminBody.lastName
      };

      AdminService.demoteAdmin(data).then(function(result) {
        refreshMembers();
        refreshAdmin();
        adminDeleteOrDemote = true;
        openModal(
          "The account has been demote.",
          false,
          "Ok",
          "success",
          "Demote admin!"
        );
      });

    }

    function refreshAdmin() {

      DictService.refresh("admins");

      DictService.admins()
        .then(function(result) {
          vm.admins = result;
        })

    }

    function refreshMembers() {

      DictService.refresh("members");

    }

    function backToListAdmins() {

      vm.section = "list-admins";
      clearData();

    }

    /* --------------------- Section add new admin ---------------- */

    function validateAddAdmin() {

      onTouchEmail = true;
      onTouchFirstName = true;
      onTouchLastName = true;

      vm.generalMessage = "";

      validateEmail();
      validateFirstName();
      validateLastName();

      for (var messagesValidate in vm.messages) {
        if (vm.messages[messagesValidate].length > 0) {
          return;
        }
      }

      submitAddAdmin();

    }

    function validateEmail(result) {

      if (result !== undefined) {
        onTouchEmail = result;
      }

      if (!onTouchEmail) {
        return;
      }

      var regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i;

      vm.messages.email = [];

      if (vm.email.length === 0) {
        vm.messages.email.push("Email can't be blank.");
      }

      if (vm.email && regEmail.test(vm.email) == false) {
        vm.messages.email.push("Incorrect email address.");
      }

    }

    function validateFirstName(result) {

      if (result !== undefined) {
        onTouchFirstName = result;
      }

      if (!onTouchFirstName) {
        return;
      }

      var regFirstName = /^[A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ]{1,}[\s]{0,1}[A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ]{0,}$/m;

      vm.messages.firstName = [];

      if (vm.firstName.length === 0) {
        vm.messages.firstName.push("First name can't be blank!");
      }

      if (vm.firstName && regFirstName.test(vm.firstName) == false) {
        vm.messages.firstName.push("Only letters. Max two names!");
        return;
      }

      if (vm.firstName.length > 100) {
        vm.messages.firstName.push("Max length number of characters 100!");
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

      vm.messages.lastName = [];

      if (vm.lastName.length === 0) {
        vm.messages.lastName.push("Last name can't be blank!");
      }

      if (vm.lastName && regLastName.test(vm.lastName) == false) {
        vm.messages.lastName.push(
          "Only letters. Max two elements separated by a hyphen!"
        );
        return;
      }

      if (vm.lastName.length > 100) {
        vm.messages.lastName.push("Max length number of characters 100!");
      }

    }

    function submitAddAdmin() {

      let data = {
        firstName: vm.firstName,
        lastName: vm.lastName,
        email: vm.email,
        password: "test123"
      };

      AdminService.addAdmin(data).then(function(result) {

        if (result.data.code === 200) {
          clearData();
          refreshAdmin();
          refreshMembers();
          openModal("Your admin has been added");

          vm.section = "list-admins";
          EventEmitterService.broadcast(EventEmitterService.namespace.USERS);
        } else {
          vm.generalMessage = result.data.description;
        }

      });

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
              title: title || "Add admin!",
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
          }
          if (adminDeleteOrDemote) {
            adminDeleteOrDemote = false;
          }

        },
        function() {

          if (callBack && adminDeleteOrDemote) {
            adminDeleteOrDemote = false;
            callBack();
          }

        }
      );

    }

    function clearData() {

      vm.firstName = "";
      vm.lastName = "";
      vm.email = "";
      onTouchEmail = false;
      onTouchFirstName = false;
      onTouchLastName = false;

      vm.messages = {
        email: [],
        firstName: [],
        lastName: []
      };

      vm.generalMessage = "";

    }

    /* -----------------------------------------------------------------------  */
  }
})(angular);
