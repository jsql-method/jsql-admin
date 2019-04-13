(function(angular) {
  "use strict";

  angular.module("jsql").controller("TeamController", TeamController);

  /**
   * @ngInject
   */
  function TeamController(
    AuthService,
    MemberService,
    DictService,
    $uibModal,
    EventEmitterService
  ) {
    var vm = this;

    vm.members = [];
    vm.applications = [];
    vm.section = "list-members";
    vm.deleteMember = deleteMember;
    vm.idDeleteMember = -1;

    var memberDelete = false;
    init();

    //--------
    function init() {
      getMembers();
      getApplication();
    }

    function getMembers() {
      DictService.members().then(function(result) {
        vm.members = result;
      });
    }

    vm.deleteMemberOpenModal = function(id) {
      vm.idDeleteMember = id;
      openModal(
        "Are you sure?",
        true,
        "Yes",
        "warning",
        "Delete member!",
        deleteMember
      );
    };

    function deleteMember() {
      MemberService.deleteMember(vm.idDeleteMember).then(function(result) {
        if (result.data.code === 200) {
          memberDelete = true;
          openModal(
            "The account has been deleted.",
            false,
            "Ok",
            "success",
            "Delete member!"
          );
          refreshMembers();
          EventEmitterService.broadcast(EventEmitterService.namespace.USERS);
        }
      });
    }

    function getApplication() {
      DictService.applications().then(function(result) {
        vm.applications = result;
      });
    }

    function refreshMembers() {
      DictService.refresh("members");
      getMembers();
    }

    vm.backToList = function() {
      vm.section = "list-members";
      clearData();
    };

    /* --------------------- Section add new member ---------------- */

    vm.email = "";
    vm.firstName = "";
    vm.lastName = "";

    vm.submitAddMember = submitAddMember;
    vm.validateAddMember = validateAddMember;
    vm.validateEmail = validateEmail;
    vm.validateFirstName = validateFirstName;
    vm.validateLastName = validateLastName;

    vm.generalMessage = "";

    vm.messages = {
      email: [],
      firstName: [],
      lastName: []
    };

    var onTouchEmail = false;
    var onTouchFirstName = false;
    var onTouchLastName = false;

    function validateAddMember() {
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

      submitAddMember();
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

    function submitAddMember() {
      var data = {
        firstName: vm.firstName,
        lastName: vm.lastName,
        email: vm.email,
        password: "test123"
      };

      MemberService.addMember(data).then(function(result) {
        if (result.data.code === 200) {
          clearData();
          vm.section = "list-members";
          refreshMembers();
          openModal("Your member has been added");
          EventEmitterService.broadcast(EventEmitterService.namespace.USERS);
        } else {
          vm.generalMessage = result.data.description;
        }
      });
    }

    /* -----------------------------------------------------------------------  */

    /* Section manage applications member */

    vm.getApplicationsMember = getApplicationsMember;
    vm.checkAssignApplication = checkAssignApplication;
    vm.addMemberToApplication = addMemberToApplication;
    vm.deleteMemberWithApplication = deleteMemberWithApplication;

    vm.memberApplication;
    vm.editMember;
    vm.nameEditMemberApplications;

    function getApplicationsMember(index) {
      MemberService.getMemberApplications(vm.members[index].id).then(
        function(result) {
          vm.editMember = index;
          vm.memberApplication = result.data.data.applicationId;
          vm.section = "application-member";
          vm.nameEditMemberApplications =
            vm.members[index].firstName + " " + vm.members[index].lastName;
        }
      );
    }

    function checkAssignApplication(id) {
      for (var i = 0; i < vm.memberApplication.length; i++) {
        if (vm.memberApplication[i] === id) {
          return true;
        }
      }

      return false;
    }

    function addMemberToApplication(id) {
      var data = {
        member: vm.members[vm.editMember].id,
        application: id
      };

      MemberService.addMemberToApplication(data).then(function() {
        getApplicationsMember(vm.editMember);
      });
    }

    function deleteMemberWithApplication(id) {
      var data = {
        member: vm.members[vm.editMember].id,
        application: id
      };

      MemberService.deleteMemberWithApplication(data).then(function() {
        getApplicationsMember(vm.editMember);
      });
    }

    /* ---------------------------------- */

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
          Data: function() {
            return {
              clazz: clazz || "success",
              title: title || "Add member!",
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
          if (memberDelete) {
            memberDelete = false;
          }
        },
        function() {
          if (callBack && memberDelete) {
            memberDelete = false;
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
  }
})(angular);
