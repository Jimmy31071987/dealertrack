(function (app) {
    'use strict';

    app.controller('homeController', homeController);

    homeController.$inject = ['$scope', 'apiService', 'notificationService','settings','$sce'];

    function homeController($scope, apiService, notificationService, settings, $sce) {

        var vm = this;
        $scope.loading = false;
        $scope.IsDirty = '';

        $scope.local = {
            Metrics: {
                HighestCarSold: "",
                TotalSale: "0.00",
                TotalUsers: "0",
                TotalDeals: "0"
            },
            DivideByNumber:1000000,
            enddate: '',
            startdate: '',
            sales: [
                {
                    "DealNumber": "5469", "CustomerName": "Milli Fulton", "DealershipName": "Sun of Saskatoon", "Vehicle": "2017 Ferrari 488 Spider",
                    "Price": "429987", "Date": "06/19/2018"
                },
                {
                    "DealNumber": "5132", "CustomerName": "Rahima Skinner", "DealershipName": "Seven Star Dealership", "Vehicle": "2009 Lamborghini Gallardo Carbon Fiber LP - 560",
                    "Price": "169900", "Date": "01/14/2018"
                },
                {
                    "DealNumber": "5795", "CustomerName": "Aroush Knapp", "DealershipName": "Maxwell & Junior", "Vehicle": "2016 Porsche 911 2dr Cpe GT3 RS",
                    "Price": "289900", "Date": "06/07/2018"
                },
                {
                    "DealNumber": "5212", "CustomerName": "Richard Spencer", "DealershipName": "Milton Jeep Limited", "Vehicle": "2018 Jeep Grand Cherokee Trackhawk",
                    "Price": "134599", "Date": "07/13/2018"
                },
                {
                    "DealNumber": "5268", "CustomerName": "Naseem Snow", "DealershipName": "Scott Toronto Dealership, Inc", "Vehicle": "2018 BMW M760Li Xdrive Sedan",
                    "Price": "177608", "Date": "01/21 / 2018"
                },
                {
                    "DealNumber": "5765", "CustomerName": "Storm William", "DealershipName": "Mythicgarcia Dealership LTDA", "Vehicle": "2018 Mercedes - Benz S - Class Cabriolet",
                    "Price": "189693", "Date": "03 / 22 / 2018"
                },
                {
                    "DealNumber": "5465", "CustomerName": "Ségolène Lémery", "DealershipName": "Richaremus Jafur Dealer", "Vehicle": "2017 Chevrolet Corvette Z06",
                    "Price": "132925", "Date": "03 / 04 / 2018"
                },
                {
                    "DealNumber": "5545",
                    "CustomerName": "Élie Boutroux",
                    "DealershipName": "Horseallen Cars",
                    "Vehicle": "2018 Lexus LS 500h",
                    "Price": "164810",
                    "Date": "02 / 05 / 2018"
                },
                {
                    "DealNumber": "5890", "CustomerName": "Ronnie Griffiths", "DealershipName": "Cheruharrison Auto", "Vehicle": "2018 Nissan GT - R Premium",
                    "Price": "147018", "Date": "04 / 08 / 2018"
                },
                {
                    "DealNumber": "5812", "CustomerName": "Anwar Hoffman", "DealershipName": "Legowart Kingorty, Ltd.", "Vehicle": "2018 Jeep Grand Cherokee Trackhawk",
                    "Price": "130936", "Date": "05 / 11 / 2018"
                },
                {
                    "DealNumber": "5298", "CustomerName": "Jakob Osborn", "DealershipName": "Coreen Dealership", "Vehicle": "2017 Dodge Viper New Car ACR",
                    "Price": "229998", "Date": "06 / 11 / 2018"
                },
                {
                    "DealNumber": "5359", "CustomerName": "Maxine Daniels", "DealershipName": "Saskatoon Ferrari", "Vehicle": "2017 Ferrari 488 Spider",
                    "Price": "419955", "Date": "07 / 15 / 2018"
                },
                {
                    "DealNumber": "5712", "CustomerName": "Donal Waters", "DealershipName": "Milton Jeep Limited", "Vehicle": "2018 Jeep Grand Cherokee Trackhawk",
                    "Price": "135500", "Date": "06 / 21 / 2018"
                },
                {
                    "DealNumber": "37283", "CustomerName": "Jakob Osborn", "DealershipName": "Coreen Dealership", "Vehicle": "2017 Dodge Viper New Car ACR",
                    "Price": "229998", "Date": "06 / 11 / 2018"
                },
                {
                    "DealNumber": "5359", "CustomerName": "Maxine Daniels", "DealershipName": "Saskatoon Ferrari", "Vehicle": "2001 Ferrari 488 Spider",
                    "Price": "419955", "Date": "07 / 15 / 2018"
                },
                {
                    "DealNumber": "3800", "CustomerName": "Maxine Daniels", "DealershipName": "Saskatoon Ferrari", "Vehicle": "2011 Ferrari 488 Spider",
                    "Price": "419955", "Date": "09 / 15 / 2018"
                }
                ,
                {
                    "DealNumber": "3801", "CustomerName": "Parul Parul", "DealershipName": "Saskatoon Ferrari", "Vehicle": "2012 Ferrari 488 Spider",
                    "Price": "419955", "Date": "10 / 15 / 2018"
                }
                ,
                {
                    "DealNumber": "892", "CustomerName": "Parul absnal", "DealershipName": "Saskatoon Ferrari", "Vehicle": "2014 Ferrari 488 Spider",
                    "Price": "223433", "Date": "11 / 15 / 2018"
                },
                {
                    "DealNumber": "891", "CustomerName": "Maxine Bansal", "DealershipName": "Saskatoon Ferrari", "Vehicle": "2018 Ferrari 488 Spider",
                    "Price": "222333", "Date": "11 / 15 / 2018"
                },
                {
                    "DealNumber": "1111", "CustomerName": "Parul Daniels", "DealershipName": "Saskatoon Ferrari", "Vehicle": "2019 Ferrari 488 Spider",
                    "Price": "22333", "Date": "12 / 15 / 2018"
                }
            ]
        };

        $scope.toTrustedHTML = function (html) {
            return $sce.trustAsHtml(html);
        };

        vm.LoadBrowse = function () {

            var dropZone = document.getElementById('drop-zone');
            var uploadForm = document.getElementById('js-upload-form');

            var startUpload = function (files) {
                console.log(files);
            };

            uploadForm.addEventListener('submit', function (e) {
                var uploadFiles = document.getElementById('js-upload-files').files;
                e.preventDefault();

                startUpload(uploadFiles);
            });

            dropZone.ondrop = function (e) {
                e.preventDefault();
                this.className = 'upload-drop-zone';

                startUpload(e.dataTransfer.files)
            };

            dropZone.ondragover = function () {
                this.className = 'upload-drop-zone drop';
                return false;
            };

            dropZone.ondragleave = function () {
                this.className = 'upload-drop-zone';
                return false;
            };

            

        };

        vm.sum = function (items, prop) {
            return items.reduce(function (a, b) {
              
                return parseFloat(a) + parseFloat(b[prop]);
            }, 0);
        };

        vm.LoadPage = function (sales) {
           

            vm.LoadDatePicker();
             
            $scope.Sales = sales;

            var list = [];

            var monthIndexes = [
                "01", "02", "03",
                "04", "05", "06", "07",
                "08", "09", "10",
                "11", "12"
            ];
            var monthNames = [
                "JAN", "FEB", "MAR","APR","MAY",
                "JUN", "JUL", "AUG", "SEP",
                "OCT", "NOV", "DEC"
            ];

            $scope.Sales.forEach(function (item) {
                
                item.Date = item.Date.toString().replace(/\s/g, '');

                if (!item.hasOwnProperty('DateModified')) {

                    Object.defineProperty(item, 'DateModified', {
                        value: '',
                        writable: true
                    });
                }

                item.Date = new Date(item.Date);
                
                var day = item.Date.getDate();
                var monthIndex = item.Date.getMonth();
                var year = item.Date.getFullYear();
                day = day < 10 ? "0" + day : day;

                item.DateModified = year + '  ' + monthIndexes[monthIndex] + ' ' + day;


                list.push(item);
            });

            
            $scope.Sales = list;

            list = [];


            var result = $scope.Sales.map(item => item.DealNumber).filter((value, index, self) => self.indexOf(value) === index);


            result.forEach(function (i) {
                list.push($scope.Sales.filter(obj => {
                    return obj.DealNumber === i
                })[0]);
            });

            $scope.Sales = list;
            var cars = [];
            $scope.Sales.forEach(function (item) {
                cars.push(item.Vehicle);
            });


            $scope.Sales = $scope.Sales.sort(function (a, b) {
                return new Date(b.Date) - new Date(a.Date);
            });

            $scope.local.Metrics.HighestCarSold = mode(cars);
            $scope.local.Metrics.TotalSale = (vm.sum($scope.Sales, 'Price') / $scope.local.DivideByNumber).toFixed(2);
            $scope.local.Metrics.TotalUsers = $scope.Sales.map(item => item.CustomerName).filter((value, index, self) => self.indexOf(value) === index).length;
            $scope.local.Metrics.TotalDeals = $scope.Sales.map(item => item.DealNumber).filter((value, index, self) => self.indexOf(value) === index).length;


            var dates = $scope.Sales.map(item => item.Date).filter((value, index, self) => self.indexOf(value) === index);

            var maxDate = new Date(Math.max.apply(null, dates));
            var minDate = new Date(Math.min.apply(null, dates));
          
            var minyear = minDate.getFullYear();
            var maxyear = maxDate.getFullYear();

            var cat = [];
           

            for (var i = minyear; i <= maxyear; i++) {

                monthNames.forEach(function (k) {
                    cat.push(k + "," + i);
                });
                
            }

            var salesamount = [];

            if (cat.length > 0) {
               
                cat.forEach(function (n) {

                    var amount = 0;

                    $scope.Sales.forEach(function (m) {

                        m.Date = new Date(m.Date);

                        var day = m.Date.getDate();
                        var monthName = monthNames[m.Date.getMonth()];
                        var year = m.Date.getFullYear();

                        var datetocompare = monthName + "," + year;
                        if (n === datetocompare) {
                            amount += parseFloat(m.Price);
                        }

                    });
                    if (amount === 0) {
                        amount = null;
                    }
                    salesamount.push(amount);
                });
            }

            var series = [];
            
            for (var hh = minyear; hh <= maxyear; hh++) {
               
                var data = [];

                for (var k = 0; k < 12; k++) {
                    data.push(vm.GetMonthDataByMonthYear(k, hh));
                }

              
                series.push({ name: "Year " + hh, data: data });
            }
                      
 
           
            
            $(document).ready(function () {
                $('.datatable').dataTable({
                    "sPaginationType": "bs_four_button"

                });
                $('.datatable').each(function () {
                    var datatable = $(this);
                    var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
                    search_input.attr('placeholder', 'Search');
                    search_input.addClass('form-control input-sm');
                    var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
                    length_sel.addClass('form-control input-sm');
                });
            });
           

            vm.LoadBarChart(cat, salesamount, series);

        };   

        vm.GetMonthDataByMonthYear = function (month, year) {
            var data = 0;
            $scope.Sales.forEach(function (m) {
                m.Date = new Date(m.Date);

                var day = m.Date.getDate();
                var monthIndex = m.Date.getMonth();
                var yearIndex = m.Date.getFullYear();

                if (month === monthIndex && year === yearIndex) {
                    data++;
                }
            });
            return data===0?null:data;
        };

        vm.LoadDatePicker = function () {

            $('#startDate').datepicker({
                uiLibrary: 'bootstrap4',
                iconsLibrary: 'fontawesome',

                maxDate: function () {
                    return $('#endDate').val();
                }
            });
            $('#endDate').datepicker({
                uiLibrary: 'bootstrap4',
                iconsLibrary: 'fontawesome',
                minDate: function () {
                    return $('#startDate').val();
                }
            });

        };

        vm.LoadBarChart = function (cat, salesamount,series) {
            
            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Monthly Vehicle Sales'
                },
                subtitle: {
                    text: 'Source: Deal Tracker'
                },
                xAxis: [{
                    categories: cat,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format:'' ,
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: '',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        text: 'Total Sale Price',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: false
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 120,
                    verticalAlign: 'top',
                    y: 100,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255,255,255,0.25)'
                },
                series: [{
                    name: 'Bar',
                    type: 'column',
                    yAxis: 1,
                    data: salesamount,
                    tooltip: {
                        valueSuffix: ' CAD$'
                    }

                }, {
                    name: 'Spline',
                    type: 'spline',
                    data: salesamount,
                    tooltip: {
                        valueSuffix: 'CAD$'
                    }
                }]
            });

            Highcharts.chart('Barcontainer', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Monthly Deals Trend'
                },
                subtitle: {
                    text: 'Source: Deal Tracker'
                },
                xAxis: {
                    categories: cat,
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Deals',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ' Deals'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: series
            });

            
        };

        vm.UploadFormat = function () {

        };

        vm.ValidateFormat = function () {

        };

        vm.DownloadFormat = function () {

        };

        vm.ExportGrid = function () {
            
            tableToExcel('Grid', 'Sales Data');
        };

        vm.search = function () {
             

            $scope.local.startdate = $("#startDate").datepicker().val();
            $scope.local.enddate = $("#endDate").datepicker().val();

            $scope.local.startdate = $scope.local.startdate.replace(/\s/g, '');

            $scope.local.enddate = $scope.local.enddate.replace(/\s/g, '');

            $scope.local.startdate = new Date($scope.local.startdate);
            $scope.local.enddate = new Date($scope.local.enddate);
            var list = [];
            $scope.local.sales.forEach(function (item) {

                item.Date = new Date(item.Date);
                if (item.Date >= $scope.local.startdate && item.Date <= $scope.local.enddate) {
                    list.push(item);
                }

            });

            var table = $('#Grid').DataTable();

            table.fnDestroy();

            vm.LoadPage(list);
          

        };

        vm.print = function () {
            window.print();
        };

        vm.AddFilter = function () {


        };

        vm.RemoveFilter = function () {

        };
        function mode(arr) {
            return arr.sort((a, b) =>
                arr.filter(v => v === a).length
                - arr.filter(v => v === b).length
            ).pop();
        }

        var tableToExcel = (function () {
            var uri = 'data:application/vnd.ms-excel;base64,'
                , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
                , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
                , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
            return function (table, name) {
                alert(name);
                if (!table.nodeType) table = document.getElementById(table);
                var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
                window.location.href = uri + base64(format(template, ctx));
            }
        })();

    }

})(angular.module('homeModule'));