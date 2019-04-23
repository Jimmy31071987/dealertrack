(function (app) {
    'use strict';

    app.controller('homeController', homeController);

    homeController.$inject = ['$scope', 'apiService', 'notificationService', 'settings', '$sce', 'fileUpload', 'cfpLoadingBar'];

    function homeController($scope, apiService, notificationService, settings, $sce, fileUpload, cfpLoadingBar) {

        var vm = this;

       

        $scope.loading = false;
        $scope.IsDirty = '';

        $scope.local = {
            Metrics: {
                HighestCarSold: null,
                TotalSale: null,
                TotalUsers: null,
                TotalDeals: null
            },
            DivideByNumber:1000000,
            enddate: '',
            startdate: '',
            sales:[],
            Search: {
                keyword: '',
                FilterBy: '',
                SearchBy: '',
                MinPrice: null,
                MaxPrice:null
            },
            filters:[]
        };

        $scope.start = function () {
            cfpLoadingBar.start();
        };

        $scope.complete = function () {
            cfpLoadingBar.complete();
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

            $scope.start();

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

            if ($scope.Sales.length > 0) {
                $scope.local.Metrics.HighestCarSold = mode(cars);
                $scope.local.Metrics.TotalSale = (vm.sum($scope.Sales, 'Price') / $scope.local.DivideByNumber).toFixed(2);
                $scope.local.Metrics.TotalUsers = $scope.Sales.map(item => item.CustomerName).filter((value, index, self) => self.indexOf(value) === index).length;
                $scope.local.Metrics.TotalDeals = $scope.Sales.map(item => item.DealNumber).filter((value, index, self) => self.indexOf(value) === index).length;

            }
            else {
                $scope.local.Metrics.HighestCarSold = null;
                $scope.local.Metrics.TotalSale = null;
                $scope.local.Metrics.TotalDeals = null;
                $scope.local.Metrics.TotalUsers = null;
            }


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
          
            vm.LoadBarChart(cat, salesamount, series);

            $scope.complete();

            vm.RefreshGrid($scope.Sales);
            
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

        vm.RemoveFilter = function (filter) {

              var list = [];

              if (filter !== undefined && filter !== null) {
                $scope.local.filters.forEach(function (o) {
                     
                    if (o.key !== filter.key) {
                        list.push(o);
                    }

                    switch (filter.key) {
                        case "Keyword": $scope.local.Search.keyword = ''; break;
                        case "SearchBy": $scope.local.Search.SearchBy = 'all'; break;
                        case "filter": $scope.local.Search.filter = 'contain'; break;
                        case "Min Price": $scope.local.Search.MinPrice = null; break;
                        case "Max Price": $scope.local.Search.MaxPrice = null; break;
                    }

                });
                $scope.local.filters = list;
            }
            filterColumn(0, '', true, false);
            vm.search();
        };

        vm.AdvancedSearch = function () {
            
            //Add Filters
            var filters = [];

            if ($scope.local.Search.keyword != undefined && $scope.local.Search.keyword.trim() != '') {
                filters.push({ key: 'Keyword', value: $scope.local.Search.keyword });
            }
            if ($scope.local.Search.SearchBy != undefined && $scope.local.Search.SearchBy !='') {

                filters.push({ key: 'SearchBy', value: $scope.local.Search.SearchBy });

            }
           
            if ($scope.local.Search.FilterBy != '' && $scope.local.Search.FilterBy != undefined) {
                filters.push({ key: 'filter', value: $scope.local.Search.FilterBy });
            }


            if ($scope.local.Search.MaxPrice < $scope.local.Search.MinPrice) {
                $("#message").show();
                return false;
            }

            else {
                $("#message").hide();
            }
            if ($scope.local.Search.MinPrice != null && $scope.local.Search.MinPrice != undefined && $scope.local.Search.MinPrice.trim() != '') {
                filters.push({ key: 'Min Price', value: $scope.local.Search.MinPrice });
            }

            if ($scope.local.Search.MaxPrice != null && $scope.local.Search.MaxPrice != undefined && $scope.local.Search.MaxPrice.trim() != '') {
                filters.push({ key: 'Max Price', value: $scope.local.Search.MaxPrice });
            }

            $scope.local.filters = filters;

          
            vm.search();
            //Search
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
            if (isValidDate($scope.local.startdate)) {

                if (isValidDate($scope.local.enddate)) {
                    $scope.Sales.forEach(function (i) {

                        if (i.Date >= $scope.local.startdate && i.Date <= $scope.local.enddate) {
                            list.push(i);
                        }

                    });
                }
                else {
                    $scope.Sales.forEach(function (i) {

                        if (i.Date >= $scope.local.startdate) {
                            list.push(i);
                        }
                    });
                }
            }
            else if (isValidDate($scope.local.enddate)) {
                $scope.Sales.forEach(function (i) {

                    if (i.Date <= $scope.local.enddate) {
                        list.push(i);
                    }
                });
            }
            else {
                list = $scope.Sales;
            }

        
            if ($scope.local.filters.length == 0) {
                vm.RefreshGrid(list);
            }
            else {
                var Keyword = ''; var IsContain = false; var IsExact = false; var SearchBy = 'all'; var min = null; var max = null;

                $scope.local.filters.forEach(function (i) {
                    if (i.key === "Keyword") {
                        Keyword = i.value;
                    }
                }); 

                $scope.local.filters.forEach(function (i) {
                    if (i.key === "filter") {
                        if (i.value === "contain") {
                            IsContain = true;
                        }
                        if (i.value === "exact") {
                            IsExact = true;
                        }
                    }
                });

                $scope.local.filters.forEach(function (i) {

                    if (i.key === "SearchBy") {
                        SearchBy = i.value;
                    }
                });

                $scope.local.filters.forEach(function (i) {
                    if (i.key === "Min Price") {
                        min = parseFloat($scope.local.Search.MinPrice);
                    }
                    if (i.key === "Max Price") {
                        max = parseFloat($scope.local.Search.MaxPrice);
                    }
                });

                var NewList = [];

                if (list.length > 0) {

                    if (min != null && !isNaN(min)) {
                        if (max != null && !isNaN(max)) {
                            list.forEach(function (i) {
                                i.Price = parseFloat(i.Price);
                                if (i.Price >= min && i.Price <= max) {
                                    NewList.push(i);
                                }
                            });
                        }
                        else {
                            list.forEach(function (i) {
                                i.Price = parseFloat(i.Price);
                                if (i.Price >= min) {
                                    NewList.push(i);
                                }
                            });
                        }
                    }
                    else if (max != null && !isNaN(max)) {
                        list.forEach(function (i) {
                            i.Price = parseFloat(i.Price);
                            if (i.Price <= max) {
                                NewList.push(i);
                            }
                        });
                    }
                    else {
                        NewList = list;
                    }
                }

                var LastList = [];
                 
                if (NewList.length > 0) {
                    
                    switch (SearchBy) {
                        case "all":
                            Keyword = Keyword.trim().toLowerCase();
                            NewList.forEach(function (i) {
                                if (i.DealNumber.trim().toLowerCase().indexOf(Keyword) >= 0 || i.Vehicle.trim().toLowerCase().indexOf(Keyword) >= 0 ||
                                    i.CustomerName.trim().toLowerCase().indexOf(Keyword) >= 0 || i.Price.trim().toLowerCase().indexOf(Keyword) >= 0 ||
                                    i.DealershipName.trim().toLowerCase().indexOf(Keyword) >= 0) {
                                    LastList.push(i);
                                }
                            });

                            break;
                        case "vehicle":


                            NewList.forEach(function (i) {
                                if (i.Vehicle.trim().toLowerCase().indexOf(Keyword) >= 0) {
                                    LastList.push(i);
                                }
                            });

                            break;
                        case "user":
                            NewList.forEach(function (i) {
                                if (i.CustomerName.trim().toLowerCase().indexOf(Keyword) >= 0) {
                                    LastList.push(i);
                                }
                            });
                            break;
                        case "dealership":
                            NewList.forEach(function (i) {
                                if (i.DealershipName.trim().toLowerCase().indexOf(Keyword) >= 0) {
                                    LastList.push(i);
                                }
                            });
                            break;
                    }

                }
                if (LastList.length > 0) {
                    vm.RefreshGrid(LastList);
                }
                else {
                    $scope.datatable.clear();
                    $scope.datatable.rows.add([]);
                    $scope.datatable.draw();
                }
            }

           

            //    $scope.local.filters.forEach(function (i) {

            //        if (i.key === "SearchBy") {
            //            IsSearchBy = true;
            //            switch (i.value) {
            //                case "all": filterColumn(0, Keyword, IsContain, IsExact); break;
            //                case "vehicle": filterColumn(3, Keyword, IsContain, IsExact); break;
            //                case "user": filterColumn(1, Keyword, IsContain, IsExact); break;
            //                case "dealership": filterColumn(2, Keyword, IsContain, IsExact); break;
            //                default: filterColumn(0, Keyword, IsContain, IsExact); break;
            //            }
            //        }
            //    });

            //    if (!IsSearchBy) {
            //        $scope.local.filters.push({ key: "SearchBy", value: "all" });
            //    }

            //    var max = null;
            //    var min = null;

            //    $scope.local.filters.forEach(function (i) {

            //        if (i.key === "Min Price") {
            //            min = parseFloat($scope.local.Search.MinPrice);
            //        }
            //        if (i.key === "Max Price") {
            //            max = parseFloat($scope.local.Search.MaxPrice);
            //        }
            //    });
            //    if (min != null && max != null && !(isNaN(min) && isNaN(max))) {
            //        $.fn.dataTable.ext.search.push(
            //            function (settings, data, dataIndex) {
            //                var price = parseFloat(data[4]) || 0;

            //                if ((isNaN(min) && isNaN(max)) ||
            //                    (isNaN(min) && price <= max) ||
            //                    (min <= price && isNaN(max)) ||
            //                    (min <= price && price <= max)) {

            //                    return true;
            //                }

            //                return false;

            //            }
            //        );
            //    }

            //}
            //else {
            //    filterColumn(0, '', false, false);
            //}
            //if (isValidDate($scope.local.startdate) || isValidDate($scope.local.enddate)) {

            //    $.fn.dataTable.ext.search.push(
            //        function (settings, data, dataIndex) {

            //            var rowdate = new Date(data[5]);
            //            var min = new Date($scope.local.startdate);
            //            var max = new Date($scope.local.enddate);



            //            if (max == '' || min == '' || min == null || max == null || min == 'Invalid Date' || max == 'Invalid Date') {
            //                return true;
            //            }
            //            if (rowdate >= min && rowdate <= max) {
            //                return true;
            //            }

            //            return false;

            //        }
            //    );
            //}

        };

        var isValidDate = function (d) {
            return d instanceof Date && !isNaN(d);
        };

        var dateColumn = function (minDateFilter,maxDateFilter) {

            $.fn.dataTableExt.afnFiltering.push(
                function (oSettings, aData, iDataIndex) {
                    if (typeof aData._date == 'undefined') {
                        aData._date = new Date(aData[0]).getTime();
                    }

                    if (minDateFilter != undefined && minDateFilter!=null && minDateFilter && !isNaN(minDateFilter)) {
                        if (aData._date < minDateFilter) {
                            return false;
                        }
                    }
                    if (maxDateFilter != undefined && maxDateFilter != null && maxDateFilter && !isNaN(maxDateFilter)) {
                        if (aData._date > maxDateFilter) {
                            return false;
                        }
                    }
                    return true;
                }
            );

        };

        var RangeColumn = function (minPrice,maxPrice) {

            $.fn.dataTableExt.afnFiltering.push(
                function (oSettings, aData, iDataIndex) {
                    if (typeof aData.Price == 'undefined') {
                        aData.Price = parseFloat(aData.Price);
                    }

                    if (minPrice != undefined && minPrice != null && minPrice && !isNaN(minPrice)) {
                        if (aData.Price < minPrice) {
                            return false;
                        }
                    }
                    if (maxPrice != undefined && maxPrice != null && maxPrice > 0 && maxPrice && !isNaN(maxPrice)) {
                        if (aData.Price > maxPrice) {
                            return false;
                        }
                    }
                    return true;
                }
            );
        }

        var filterColumn = function (columnIndex, searchValue, IsContain, IsExact) {
            if (columnIndex > 0) {
                $('#Grid').DataTable().column(columnIndex).search(
                    searchValue,
                    IsContain,
                    IsExact
                ).draw();
            }
            else if (columnIndex === 0) {
                $('#Grid').DataTable().search(
                    searchValue,
                    IsContain,
                    IsExact
                ).draw();
            }
           
        };


        vm.print = function () {
            window.print();
        };

        vm.AddFilter = function () {


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
                , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); }
            return function (table, name) {

                if (!table.nodeType) table = document.getElementById(table);
                var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
                window.location.href = uri + base64(format(template, ctx));
            };
        })();



        vm.RefreshGrid = function (data) {
            console.log(data);
            if (data != null && data != undefined && data.length > 0) {
                
                if (!$.fn.DataTable.isDataTable('#Grid')) {
                    $scope.datatable = $('#Grid').DataTable({
                        data: data,
                        lengthMenu: [10, 25, 50],
                        pageLength: 5,
                        bDestroy: true,
                        stateSave: true,
                        columns: [
                            { data: 'DealNumber' },
                            { data: 'CustomerName' },
                            { data: 'DealershipName' },
                            { data: 'Vehicle' },
                            { data: 'Price' },
                            { data: 'DateModified' }]
                    });
                     $scope.datatable.rows('.modified').invalidate().draw();
                }
                else {

                    $scope.datatable.clear();
                    $scope.datatable.rows.add(data);
                    $scope.datatable.draw();
                }
               
            }

        };
     
        $(function () {
            $("input:file").change(function () {
                var fileName = $(this).val();
                $("#filepath").val(fileName);
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


       

        vm.UploadFile = function () {
            var file = $scope.myFile;
            $scope.start();
            var formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'SalesData');

            $("#filepath").val(file.fileName);

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    var Result = xhr.responseText;
                    console.log(Result);
                    vm.ParseFileUploaded(Result);
                   
                }
            };

            xhr.open('POST', settings.URL.FILEUPLOAD +"?Action=SalesData", false);
            xhr.send(formData);
        };

        vm.ParseFileUploaded = function (path) {
           
            $scope.local.param = JSON.stringify({ "FilePath": path });
            apiService.post(settings.URL.PARSEFILE, $scope.local.param, function (data) {
                var Result = JSON.parse(data.data.d);
                if (Result != undefined && Result != null && Result.length > 0) {
                    $scope.local.sales = Result;
                    vm.LoadPage(Result);
                    notificationService.displaySuccess("Successfully uploaded data");
                    $('#myModal').modal('hide');
                }
                else {
                    notificationService.displayError("No data Found in a file uploaded");
                }
                $scope.complete();
            }, function (k) { console.log(k); $scope.complete();});
        };

        vm.DownloadTemplate = function () {
            $scope.start();
            apiService.post(settings.URL.FILEUPLOAD + "?FilePath=/App_Data/SampleTemplate.csv", {}, function (data) {
                var file = new Blob([data.data], { type: 'text/csv' });
                saveAs(file, 'SampleTemplate.csv');
                $scope.complete();
            }, function (k) { console.log(k);});
        };


     

    }

})(angular.module('homeModule'));