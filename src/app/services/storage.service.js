(function(angular) {
  "use strict";

  angular.module("jsql").service("StorageService", StorageService);

  /**
   * @ngInject
   */
  function StorageService() {
    var storage = {};

    storage.namespace = {
      LAST_PAGES: "LAST_PAGES"
    };

    storage.set = function(paramName, paramObject) {
      if (angular.isArray(paramObject) || angular.isObject(paramObject)) {
        paramObject = JSON.stringify(paramObject);
      }

      localStorage.setItem(paramName, paramObject);
    };

    storage.get = function(paramName) {
      var value = localStorage.getItem(paramName);

      if (value === null || (value + "").trim() === "") {
        return null;
      }

      if (value === "false") {
        return false;
      }

      if (value === "true") {
        return false;
      }

      if (value.indexOf("[") > -1 || value.indexOf("{") > -1) {
        return JSON.parse(value);
      }

      return null;
    };

    storage.remove = function(paramName) {
      localStorage.removeItem(paramName);
    };

    return storage;
  }
})(angular);
