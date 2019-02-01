(function(angular) {
  "use strict";

  angular.module("jsql").controller("SecurityController", SecurityController);

  /**
   * @ngInject
   */
  function SecurityController(
    AuthService,
    ApplicationService,
    $stateParams,
    DictService,
    $uibModal
  ) {
    var vm = this;
    vm.application = null;
    vm.security = null;
    vm.id = parseInt($stateParams.id);
    vm.isTrue = [{ value: true, name: "Yes" }, { value: false, name: "No" }];
    vm.updateOptions = updateOptions;
    vm.genNumber = genNumber;
    vm.genCharArray = genCharArray;
    vm.generateRandomSalt = generateRandomSalt;
    init();

    //--------
    function init() {
      getOptionsValues();
      getApplications();
    }

    function getApplications() {
      DictService.applications().then(function(result) {
        vm.application = _.find(result, { id: vm.id });
        getOptions();
      });
    }

    function getOptionsValues() {
      ApplicationService.getOptionsValues()
        .then(function(result) {
          vm.optionsValues = result.data.data[0];
          vm.encodingAlgorithmOptions =
            vm.optionsValues.encodingAlgorithmValues;
          vm.databaseDialectOptions = vm.optionsValues.databaseDialectValues;
          vm.applicationLanguageOptions =
            vm.optionsValues.applicationLanguageValues;
        })
    }

    function getOptions() {
      ApplicationService.getAllOptions(vm.application.id)
        .then(function(result) {
          vm.security = result.data;
          vm.encodeQuery = vm.security.encodeQuery;
          vm.encodingAlgorithm = vm.security.encodingAlgorithm;
          vm.addSalt = vm.security.isSalt;
          vm.saltAfter = vm.security.saltAfter;
          vm.saltBefore = vm.security.saltBefore;
          vm.salt = vm.security.salt;
          vm.randomSalt = vm.security.saltRandomize;
          vm.hashLengthEqualToQuery = vm.security.hashLengthLikeQuery;
          vm.hashMinLength = vm.security.hashMinLength;
          vm.hashMaxLength = vm.security.hashMaxLenght;
          vm.removeQueriesAfterBuild = vm.security.removeQueriesAfterBuild;
          vm.databaseDialect = vm.security.databaseDialect;
          vm.applicationLanguage = vm.security.applicationLanguage;
          vm.plainQueriesAllowed = vm.security.allowedPlainQueries;
        })
    }

    /* Validate Hash min max length */
    var onTouchHashMinLength = false;
    var onTouchHashMaxLength = false;

    vm.generalMessage = "";

    vm.messages = {
      hashMinLength: [],
      hashMaxLength: []
    };

    vm.validateHashLength = function() {
      onTouchHashMinLength = true;
      onTouchHashMaxLength = true;
      vm.generalMessage = "";

      vm.validateHashMinLength();

      for (var messagesValidate in vm.messages) {
        if (vm.messages[messagesValidate].length > 0) {
          return;
        }
      }

      updateOptions();
    };

    vm.validateHashMinLength = function(result) {
      if (result !== undefined) {
        onTouchHashMinLength = result;
      }

      if (!onTouchHashMinLength) {
        return;
      }

      vm.messages.hashMinLength = [];

      if (vm.hashMinLength < 10) {
        vm.messages.hashMinLength.push("Min hash length required 10");
      }

      vm.validateHashMaxLength();
    };

    vm.validateHashMaxLength = function(result) {
      if (result !== undefined) {
        onTouchHashMaxLength = result;
      }

      if (!onTouchHashMaxLength) {
        return;
      }

      vm.messages.hashMaxLength = [];

      if (vm.hashMaxLength <= vm.hashMinLength) {
        vm.messages.hashMaxLength.push(
          "Max hash length must be bigger than min hash"
        );
      }

      if (vm.hashMaxLength > 500) {
        vm.messages.hashMaxLength.push("Max hash value 500");
      }
    };

    function updateOptions() {
      let data = {
        encodeQuery: vm.encodeQuery,
        encodingAlgorithm: vm.encodingAlgorithm,
        isSalt: vm.addSalt,
        salt: vm.salt,
        saltBefore: vm.saltBefore,
        saltAfter: vm.saltAfter,
        saltRandomize: vm.randomSalt,
        hashLengthLikeQuery: vm.hashLengthEqualToQuery,
        hashMinLength: vm.hashMinLength,
        hashMaxLength: vm.hashMaxLength,
        removeQueriesAfterBuild: vm.removeQueriesAfterBuild,
        databaseDialect: vm.databaseDialect,
        applicationLanguage: vm.applicationLanguage,
        allowedPlainQueries: vm.plainQueriesAllowed
      };

      ApplicationService.updateOptions(vm.id, data)
        .then(function(result) {
          if (result.data.code === 200) {
            openModal();
          }
        })
    }

    function generateRandomSalt() {
      let chars = [];
      let genNumber = vm.genNumber();
      let genCharArray = vm.genCharArray("a", "z");
      let salt = "";

      for (let i = 0; i < genNumber.length; i++) {
        chars.push(genNumber[i]);
      }

      for (let i = 0; i < genCharArray.length; i++) {
        chars.push(genCharArray[i]);
      }

      for (let i = 0; i < 10; i++) {
        salt += chars[Math.floor(Math.random() * chars.length)];
      }
      vm.salt = salt;
    }

    function genCharArray(charA, charZ) {
      let a = [],
        i = charA.charCodeAt(0),
        j = charZ.charCodeAt(0);
      for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
      }
      return a;
    }

    function genNumber() {
      let number = [];
      for (let i = 0; i < 10; i++) {
        number.push(i.toString());
      }
      return number;
    }

    function openModal() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "app/modals/message/message.html",
        controller: "MessageController",
        controllerAs: "vm",
        resolve: {
          Data: function() {
            return {
              clazz: "success",
              title: "Save",
              message: "Options value has been updated successfully"
            };
          }
        }
      });
    }
  }
})(angular);
