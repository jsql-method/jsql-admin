(function (angular) {
    "use strict";

    angular.module("jsql").service("ChartService", ChartService);

    /**
     * @ngInject
     */
    function ChartService(UtilsService) {
        var provider = {};

        provider.prepareBasicChartData = function(rawChartData, name1, name2){

            var chartData = {};

            var arr = _.sortBy(rawChartData, name1);
            for(var i = 0; i < arr.length; i++){

                var prop = arr[i][name1];
                if(!chartData[prop]){
                    chartData[prop] = 0;
                }

                chartData[prop] = chartData[prop] + arr[i][name2];

            }

            return chartData;

        };

        provider.prepareMultiChartData = function(rawChartData, propName, name1, name2){

            var chartData = {};

            var arr = _.sortBy(rawChartData, name1);
            for(var i = 0; i < arr.length; i++){

                var prop = arr[i][propName];
                if(!chartData[prop]){
                    chartData[prop] = provider.prepareBasicChartData(_.filter(rawChartData, function(row){
                        return row[propName] === prop;
                    }), name1, name2);
                }

            }

            return chartData;

        };

        provider.eraseChart = function(){
            document.getElementById('chart').innerHTML = '';
        };

        provider.createChart = function (chartData, options) {

            document.getElementById('chart').innerHTML = '<canvas id="canvas-build" class="canvas-build"></canvas>';
            var config = provider.createConfig(chartData, options);
            var ctx = document.getElementById("canvas-build").getContext("2d");
            new Chart(ctx, config);

        };

        provider.createConfig = function (chartData, options) {

            if (options.type === 'MULTI') {
                return provider.createMultiConfig(chartData, options);
            } else if(options.type === 'BASIC'){
                return provider.createBasicConfig(chartData, options);
            }

        };

        provider.createMultiConfig = function (chartData, options) {

            var datasets = [];
            var labelsSet = {};
            var maxCount = 0;

            for(var prop in chartData){

                if (chartData.hasOwnProperty(prop)) {

                    var detailedData = chartData[prop];
                    var data = [];
                    for (var date in detailedData) {

                        if (detailedData.hasOwnProperty(date)) {

                            if (maxCount < detailedData[date]) {
                                maxCount = detailedData[date];
                            }

                            data.push(detailedData[date] + '');
                            labelsSet[date] = date;
                        }

                    }

                    var color = UtilsService.getRandomColor();
                    datasets.push({
                        label: prop,
                        backgroundColor: color,
                        borderColor: color,
                        data: data,
                        fill: false
                    });

                }

            }

            var labels = [];

            for(var label in labelsSet){
                if(labelsSet.hasOwnProperty(label)){
                    labels.push(label);
                }
            }

            var config = {
                type: "line",
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                                    labelString: "Date"
                                }
                            }
                        ],
                        yAxes: [
                            {
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: "Builds No"
                                },
                                ticks: {
                                    min: 0,
                                    max: Math.ceil(maxCount + (maxCount / 10)),
                                    stepSize: Math.ceil(maxCount / 10)
                                }
                            }
                        ]
                    }
                }
            };

            return config;

        };

        provider.createBasicConfig = function (chartData, options) {

            var data = [];
            var labels = [];
            var maxCount = 0;

            for (var date in chartData) {

                if (chartData.hasOwnProperty(date)) {

                    if (maxCount < chartData[date]) {
                        maxCount = chartData[date];
                    }

                    data.push(chartData[date] + '');
                    labels.push(date);
                }

            }

            var config = {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: options.datasetLabel,
                        backgroundColor: UtilsService.getPrimaryColor(),
                        borderColor: UtilsService.getPrimaryColor(),
                        data: data,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                                    labelString: "Date"
                                }
                            }
                        ],
                        yAxes: [
                            {
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: "Builds No"
                                },
                                ticks: {
                                    min: 0,
                                    max: Math.ceil(maxCount + (maxCount / 10)),
                                    stepSize: Math.ceil(maxCount / 10)
                                }
                            }
                        ]
                    }
                }
            };

            return config;

        };

        return provider;
    }
})(angular);
