(function(angular) {
  "use strict";

  angular.module("jsql").controller("BuildsController", BuildsController);

  /**
   * @ngInject
   */
  function BuildsController(
    AuthService,
    EndpointsFactory,
    DictService,
    dateFormat,
    EventService
  ) {
    var vm = this;
    var chart;
    vm.start = 0;
    vm.builds = [];
    vm.mainBuildsStats = {};
    vm.generalMessage = "";
    vm.role = localStorage.getItem('_mRole');

    vm.applications = [];
    vm.copyApplications = [];

    vm.members = [];
    vm.copyMembers = [];

    vm.options = [
      {
        app: "Something Cool",
        member: "something-cool-value"
      },
      {
        app: "Something Else",
        member: "something-else-value"
      }
    ];

    /**
     * Form Filter Builds Variables && Functions Declarations
     */
    vm.showMultiSelect = showMultiSelect;
    vm.hideMultiSelect = hideMultiSelect;

    vm.setFilterApplications = setFilterApplications;
    vm.chooseAllApplications = chooseAllApplications;
    vm.checkChoosenApplication = checkChoosenApplication;
    vm.addOrRemoveApplication = addOrRemoveApplication;

    vm.setFilterMembers = setFilterMembers;
    vm.chooseAllMembers = chooseAllMembers;
    vm.checkChoosenMember = checkChoosenMember;
    vm.addOrRemoveMember = addOrRemoveMember;

    vm.applicationValue = "";
    vm.memberValue = "";

    vm.dataFilterBuilds = {
      applications: [],
      members: [],
      dateFrom: "",
      dateTo: ""
    };

    var elements = [];
    var selectOptions = [];

    init();

    //--------
    function init() {
      getMembers();

      EventService.registerClick("build-click", function() {
        var selectors = document.getElementsByClassName("multiselect-contain");
        for (var i = 0; i < selectors.length; i++) {
          selectors[i].style.display = "none";
        }
      });
    }

    function getMembers() {
      DictService.members().then(function(result) {
        if(result) {
          vm.members = angular.copy(result);
        }
        getAdmins();
      });
    }

    function getAdmins() {
      DictService.admins().then(function(result) {
        if(result) {
          if (result.length > 0) {
            result.forEach(function(admin) {
              vm.members.push(admin);
            });
          }
        }
        vm.copyMembers = vm.members.slice();
        getApplication();
      });
    }

    function getApplication() {
      DictService.applications().then(function(result) {
        vm.applications = result;
        vm.copyApplications = result.slice();
        updateStats();
      });
    }

    function addElements(start) {
      var element = [];
      var limit = 0;
      if (start + 10 < vm.builds.length) {
        limit = start + 10;
      } else {
        limit = vm.builds.length;
      }

      // wyswietlanie od najnowszych
      for (
        var i = vm.builds.length - start - 1;
        i >= vm.builds.length - limit;
        i--
      ) {
        element.push(vm.builds[i]);
      }

      // wyswietlanie od najstarszych - moze sie przydac jak trzeba bedzie zrobic przycisk do sortowania
      // for (var i = start; i < limit; i++) {
      //   element.push(
      //    vm.builds[i]
      // )
      //   ;
      // }
      elements = [...elements, ...element];
    }

    vm.showMore = function() {
      vm.start += 10;
      addElements(vm.start);
    };

    vm.getElements = function() {
      return elements;
    };

    vm.getSelectOptions = function() {
      return selectOptions;
    };

    function updateStats() {
      var dateFrom = getData('dateFrom');
      var dateTo = getData();
      var data = {
        applications: vm.applications.map(function (app) {
          return app.id;
        }),
        members: getIdMembers()
      };

      EndpointsFactory.stats(dateFrom, dateTo, data).$promise.then(function(result) {
        if (result.data.code === 200) {
          vm.builds = result.data.data[1].buildList;
          addElements(vm.start);
          addSelectOptions(vm.builds);
          vm.mainBuildsStats = result.data.data[0];
          createChart();
        } else {
          vm.generalMessage = result.data.description;
        }
      });
    }

    function getIdMembers() {
      if(vm.role === 'APP_DEV') {
        DictService.profile()
            .then(function (result) {
              return result.id;
            })
      } else {
        return vm.members.map(function (member) {
          return member.id;
        })
      }
    }

    function getData(when) {
        var data = new Date();
        var dateOffset;
        if(when === 'dateFrom') {
            dateOffset = (24*60*60*1000) * 7; //5 days
            data.setTime(data.getTime() - dateOffset);
        }

        var day = data.getDate();

        if(day < 10) {
            day = '0' + day;
        }

        var mounth = data.getMonth() + 1;

        if(mounth < 10) {
            mounth = '0' + mounth;
        }

        var year = data.getFullYear();

        return day + '-' + mounth + '-' + year;
    }

    function addSelectOptions(builds) {
      if (!builds) {
        selectOptions = [];
      }

      for (var i = 0; i < builds.length; i++) {
        selectOptions.push({
          app: builds[i].applicationName,
          member: builds[i].buildOwner
        });
      }
    }

    // Date picker section //
    vm.format = dateFormat.html5Types.date;

    vm.open1 = function() {
      vm.popup1.opened = true;
    };

    vm.open2 = function() {
      vm.popup2.opened = true;
    };

    vm.popup1 = {
      opened: false
    };

    vm.popup2 = {
      opened: false
    };

    /* Chart section */

    var config;
    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    function createConfig() {
      var datasets = [];
      var users = getUsers();
      var amountUsersWith = getAmountAllMounths(Object.keys(users).length);
      filterDateForUsers(users, amountUsersWith);

      for (var i = 0; i < Object.keys(users).length; i++) {
        var color = getRandomColor();
        datasets.push({
          label: Object.keys(users)[i],
          backgroundColor: color,
          borderColor: color,
          data: amountUsersWith[i],
          fill: false
        });
      }

      config = {
        type: "line",
        data: {
          labels: MONTHS,
          datasets: datasets
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: ""
          },
          tooltips: {
            mode: "index",
            intersect: false
          },
          hover: {
            mode: "nearest",
            intersect: true
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Month"
                }
              }
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Value"
                },
                ticks: {
                  min: 0,
                  max: 5000,

                  // forces step size to be 5 units
                  stepSize: 500
                }
              }
            ]
          }
        }
      };
    }

    function createChart() {
      if (chart) return;
      createConfig();
      var ctx = document.getElementById("canvas-build").getContext("2d");
      chart = new Chart(ctx, config);
    }

    function getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function getUsers() {
      var dataUsers = {};
      for (var i = 0; i < vm.builds.length; i++) {
        if (!dataUsers.hasOwnProperty(vm.builds[i].buildOwner)) {
          dataUsers[vm.builds[i].buildOwner] = vm.builds[i].buildOwner;
        }
      }
      return dataUsers;
    }

    function getAmountAllMounths(usersLength) {
      var amountsUsers = [];
      for (var i = 0; i < usersLength; i++) {
        var mounth = [];

        for (var j = 0; j < 12; j++) {
          mounth.push(0);
        }
        amountsUsers.push(mounth);
      }
      return amountsUsers;
    }

    function filterDateForUsers(users, amountUsersWith) {
      for (var i = 0; i < vm.builds.length; i++) {
        for (var j = 0; j < Object.keys(users).length; j++) {
          if (vm.builds[i].buildOwner === Object.keys(users)[j]) {
            var length = vm.builds[i].hashingTime.length;
            var numberAddBuild =
              parseInt(vm.builds[i].hashingTime.substr(length - 7, 2)) - 1;
            amountUsersWith[j][numberAddBuild] += 1;
          }
        }
      }
    }

    /**
     * Multiselect
     * a) Filter applications
     * b) Filter members
     */

    function showMultiSelect(index) {
      var selector = document.getElementsByClassName("multiselect-contain")[
        index
      ];
      selector.style.display = "block";
    }

    function hideMultiSelect(index) {
      var selector = document.getElementsByClassName("multiselect-contain")[
        index
      ];
      selector.style.display = "none";
    }

    // a) Filter applications //

    function setFilterApplications(value) {
      vm.applicationValue = value;
      filterApplications();
    }

    function filterApplications() {
      vm.applications = vm.copyApplications.filter(app => {
        if (vm.applicationValue === "") {
          return true;
        } else if (
          app.name.toLowerCase().includes(vm.applicationValue.toLowerCase())
        ) {
          return true;
        }
        return false;
      });
    }

    function chooseAllApplications(event) {
      if (event.target.checked === true) {
        vm.dataFilterBuilds.applications = vm.applications.map(function(
          application
        ) {
          return application.id;
        });
      } else {
        vm.dataFilterBuilds.applications = [];
      }
    }

    function checkChoosenApplication(applicationId) {
      if (
        vm.dataFilterBuilds.applications.find(function(id) {
          return id === applicationId;
        })
      ) {
        return true;
      }
      return false;
    }

    function addOrRemoveApplication(applicationId) {
      if (
        vm.dataFilterBuilds.applications.find(function(id) {
          return id === applicationId;
        })
      ) {
        var index = vm.dataFilterBuilds.applications.indexOf(applicationId);
        vm.dataFilterBuilds.applications.splice(index, 1);
      } else {
        vm.dataFilterBuilds.applications.push(applicationId);
      }
    }

    // b) Filter members //

    function setFilterMembers(value) {
      vm.membersValue = value;
      filterMembers();
    }

    function filterMembers() {
      vm.members = vm.copyMembers.filter(member => {
        if (vm.memberValue === "") {
          return true;
        } else if (
          (
            member.firstName.toLowerCase() +
            " " +
            member.lastName.toLowerCase()
          ).includes(vm.memberValue.toLowerCase())
        ) {
          return true;
        }
        return false;
      });
    }

    function chooseAllMembers(event) {
      if (event.target.checked === true) {
        vm.dataFilterBuilds.members = vm.members.map(function(member) {
          return member.id;
        });
      } else {
        vm.dataFilterBuilds.members = [];
      }
    }

    function checkChoosenMember(memberId) {
      if (
        vm.dataFilterBuilds.members.find(function(id) {
          return id === memberId;
        })
      ) {
        return true;
      }
      return false;
    }

    function addOrRemoveMember(memberId) {
      if (
        vm.dataFilterBuilds.members.find(function(id) {
          return id === memberId;
        })
      ) {
        var index = vm.dataFilterBuilds.members.indexOf(memberId);
        vm.dataFilterBuilds.members.splice(index, 1);
      } else {
        vm.dataFilterBuilds.members.push(memberId);
      }
    }
  }
})(angular);
