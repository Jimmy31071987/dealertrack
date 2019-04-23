<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="DealTracker.Home" MasterPageFile="~/Root.Master" %>

<asp:Content ContentPlaceHolderID="Main" runat="server">
    <div id="HomePage" ng-app="homeModule" ng-controller="homeController as hc" ng-init="hc.LoadPage(local.sales);">
        <div class="row noprint" id="SearchPanel">

            <span id="search">Search Panel<i class="fas fa-long-arrow-alt-right"></i></span>

            <div class="col-lg-10">
                <table id="datepickerTable">
                    
                    <tr>
                        <td>
                            <input id="startDate" class="datepicker" placeholder="From" ng-model="local.startdate"/>
                        </td>
                        <td>
                            <input id="endDate" class="datepicker" placeholder="To" ng-model="local.enddate"/>
                        </td>
                        <td>
                            <button class=" btn btn-primary btn-sm" type="button" id="Search" ng-click="hc.search();">Search</button>

                        </td>
                        <td><a href="#" id="advancedsearch"  data-toggle="modal" data-target="#mySearchModal">advanced search</a>

                        </td>
                        <td>
                            <ul class="tags">
                                <li ng-repeat="filter in local.filters" class="tag" ng-cloak>
                                      <a href="#"><span class="filterKey"><span ng-bind="filter.key"></span>:</span><span class="filtervalue"><span ng-bind="filter.value"></span></span><button type="button" class="filtercross" ng-click="hc.RemoveFilter(filter);">X</button></a>
                                </li>
                              
                            </ul>
                        </td>
                    </tr>
                </table>
            </div>
            <div>
                <div class="float-right btn-block" id="printButton">
                    <button type="button" class="fa fa-print btn btn-lg btn-primary float-right" ng-click="hc.print();" />
                    Print
                </div>
            </div>
        </div>


        <div class="row rowpadding">
            <div class="col-lg-12">
                <ul class="SummaryDashboard">
                    <li>
                        <div class="summary">
                            <span class="key"><i class="fa fa-trophy"></i>&nbsp;Best Selling Vehicle</span>
                            <span class="value" ng-bind="local.Metrics.HighestCarSold" ng-cloak></span>
                        </div>
                    </li>
                    <li>
                        <div class="summary">
                            <span class="key">Total Sale(in $CAD mm) <i class="fa fa-question metrictooltip"><span>sum of vehicle's price, group by unique Deal number</span></i> </span>
                            <span class="value" ng-bind="local.Metrics.TotalSale" ng-cloak></span>
                        </div>
                    </li>
                    <li>
                        <div class="summary">
                            <span class="key">Total Users  <i class="fa fa-question metrictooltip"><span>count of  users with unique name</span></i></span>
                            <span class="value" ng-bind="local.Metrics.TotalUsers" ng-cloak></span>
                        </div>
                    </li>
                    <li>
                        <div class="summary">
                            <span class="key">Total Deals <i class="fa fa-question metrictooltip"><span>count of unique deal number</span></i></span>
                            <span class="value" ng-bind="local.Metrics.TotalDeals" ng-cloak></span>
                        </div>
                    </li>
                </ul>
                <%-- FILTER --%>
            </div>
        </div>
        <div class="row rowpadding">
            <div class="col-lg-6 col-md-12 col-sm-12 padding-right-5px">
                <%-- CHART --%>

                <%-- SALE BY TIME  --%>

                <%-- SALE BY VEHICLE --%>
                <div class="card">
                    <div class="card-header">
                        <h1>Sales Trend</h1>
                        
                    </div>
                    <div class="card-body">
                        <div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
                    </div>
                </div>

            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 padding-left-5px">
                <%-- CHART --%>

                <%-- SALE BY TIME  --%>

                <%-- SALE BY VEHICLE --%>
                <div class="card">
                    <div class="card-header">
                        <h1>Deals Trend</h1>
                    </div>
                    <div class="card-body">
                        <div id="Barcontainer" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row rowpadding">
            <div class="col-lg-12">
                <%-- GRID --%>
                <div class="card">
                    <div class="card-header">
                        <h1>Transactions</h1>
                        <div class="float-right btn">
                            <button type="button" class="fa fa-download btn btn-lg btn-primary float-right noprint" ng-click="hc.ExportGrid();">&nbsp;Export</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <table cellpadding="0" cellspacing="0" border="0" id="Grid" class="datatable table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Deal Number</th>
                                    <th>CustomerName</th>
                                    <th>DealershipName(s)</th>
                                    <th>Vehicle</th>
                                    <th>Price</th>
                                    <th>Deal Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>

                        </table>
                    </div>
                    <div class="card-footer">
                        <strong>Note: Prices are in CAD$</strong>
                    </div>
                </div>

            </div>
        </div>
        <div class="row rowpadding noprint">
            <div class="col-lg-11">
            </div>
            <div class="col-lg-1">
                <div class="float-right btn-block">
                    <button type="button" class="fa fa-print btn-lg btn-primary float-right" ng-click="hc.print();">Print</button>

                </div>
            </div>
        </div>

        <div class="row">
                <div class="col-lg-12">
                    <div class="modal fade" id="mySearchModal" tabindex="-1" role="dialog" aria-labelledby="mySearchLabel">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title" id="mySearchLabel">advanced Search</h4>
                                </div>
                                <div class="modal-body">
                                    <table>
                                        <tr>
                                            <td><label>Search Keyword:</label> </td>
                                            <td><label>Search By:</label></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input type="text" ng-model="local.Search.keyword"/>
                                            </td>
                                            <td>
                                                <select ng-model="local.Search.SearchBy">
                                                    <option value="all">All</option>
                                                    <option value="vehicle">Vehicle</option>
                                                    <option value="user">User</option>
                                                    <option value="dealership">Dealership</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input type="radio" id="contain" name="filterGroupIn" ng-model="local.Search.FilterBy" value="contain" />
                                                <label class="radiolabel" for="contain">contains</label> 
                                                <input type="radio" id="exact"  name="filterGroupIn" ng-model="local.Search.FilterBy"  value="exact" />
                                                <label class="radiolabel" for="exact">exact</label> 
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label>Price Range:</label></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input type="text" placeholder="Min Price" class="smalltextbox" ng-model="local.Search.MinPrice" />
                                                <input type="text" placeholder="Max Price" class="smalltextbox" ng-model="local.Search.MaxPrice" />
                                            </td>
                                        </tr>
                                        <tr id="message">
                                            <td colspan="3">
                                                <div class="alert alert-danger" role="alert" >
                                                   max price must be equal to or more than min price
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                     
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary" ng-click="hc.AdvancedSearch();" data-dismiss="modal">Go & Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <div class="row">
                <div class="col-lg-12">
                    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title" id="myModalLabel">Upload</h4>
                                </div>
                                <div class="modal-body">

                                    <div class="container">
                                        <br />
                                        <div class="row">

                                            <div class="col-md-12">
                                                <div class="panel panel-default">
                                                    <div class="panel-heading"><strong>Upload Sales Data</strong> <span class="smallred">only csv format supported...</span></div>
                                                    <div class="panel-body">
                                                           
                                                        <div class="input-group image-preview">
                                                            <input placeholder="browse file" type="text" id="filepath" class="form-control image-preview-filename" disabled="disabled">
                                                            <span class="input-group-btn">
                                                                <button type="button" class="btn btn-default image-preview-clear" style="display: none;"><span class="glyphicon glyphicon-remove"></span>Clear </button>
                                                                <div class="btn btn-default image-preview-input">
                                                                    <span class="glyphicon glyphicon-folder-open"></span><span class="image-preview-input-title">Browse</span>
                                                                    <input type="file" id="filebrowse" accept=".csv" name="input-file-preview"  file-model = "myFile" />
                                                                 </div>
                                                                <button type="button" class="btn btn-labeled btn-primary" ng-click="hc.UploadFile();"><span class="btn-label"><i class="glyphicon glyphicon-upload"></i></span>Upload</button>
                                                            </span>
                                                        </div>
                                                     

                                                        <br />
                                                     
                                                    </div>
                                                </div>
                                            </div>

                                           
                                        </div>
                                         <div class="row">
                                            <a href="#" class="fa fa-download" id="downloadformat" ng-click="hc.DownloadTemplate();">download sample template</a>
                                        </div>

                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</asp:Content>
