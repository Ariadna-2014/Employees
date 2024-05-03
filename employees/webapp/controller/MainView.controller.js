sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("logaligroup.employees.controller.MainView", {

      onInit: function () {


        var oView = this.getView();
        //var i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

        var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
        oJSONModelEmpl.loadData("../localService/mockdata/Employees.json", false);
        oView.setModel(oJSONModelEmpl, "jsonEmployees");

        var oJSONModelCountries = new sap.ui.model.json.JSONModel();
        oJSONModelCountries.loadData("../localService/mockdata/Countries.json", false);
        oView.setModel(oJSONModelCountries, "jsonCountries");

        var oJSONModelConfig = new sap.ui.model.json.JSONModel({
          visibleID: true,
          visibleName: true,
          visibleCountry: true,
          visibleCity: false,
          visibleBtnShowCity: true,
          visibleBtnHideCity: false
        });
        oView.setModel(oJSONModelConfig, "jsonConfig");
      },

      onFilter: function () {
        var oJSONCountries = this.getView().getModel("jsonCountries").getData();
        var filters = [];

        if (oJSONCountries.EmployeeId !== "") {
          filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
        }

        if (oJSONCountries.CountryKey !== "") {
          filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
        }

        var oList = this.getView().byId("tableEmployee");
        var oBinding = oList.getBinding("items");
        oBinding.filter(filters);

      },

      onClearFilter: function () {
        var oModel = this.getView().getModel("jsonCountries");
        oModel.setProperty("/EmployeeId", "");
        oModel.setProperty("/CountryKey", "");
      },

      onValidate: function () {
        var inputEmployee = this.byId("inputEmployee");
        var valueEmployee = inputEmployee.getValue();

        //if (valueEmployee.length == 6) {
        //inputEmployee.setDescription("OK");
        this.byId("labelCountry").setVisible(true);
        this.byId("slCountry").setVisible(true);
        //} else {
        //   //inputEmployee.setDescription("Not OK");
        //   this.byId("labelCountry").setVisible(false);
        //   this.byId("slCountry").setVisible(false);
        // };

      },

      showPostalCode: function (oEvent) {
        var itemPressed = oEvent.getSource();
        var oContext = itemPressed.getBindingContext("jsonEmployees");
        var objectContext = oContext.getObject();

        sap.m.MessageToast.show(objectContext.PostalCode);

      },

      onShowCity: function () {
        var OJSONModelConfig = this.getView().getModel("jsonConfig");
        OJSONModelConfig.setProperty("/visibleCity", true);
        OJSONModelConfig.setProperty("/visibleBtnShowCity", false);
        OJSONModelConfig.setProperty("/visibleBtnHideCity", true);
      },

      onHideCity: function () {
        var OJSONModelConfig = this.getView().getModel("jsonConfig");
        OJSONModelConfig.setProperty("/visibleCity", false);
        OJSONModelConfig.setProperty("/visibleBtnShowCity", true);
        OJSONModelConfig.setProperty("/visibleBtnHideCity", false);

      },

      showOrders: function (oEvent) {

        var ordersTable = this.getView().byId("ordersTable");

        ordersTable.destroyItems();

        var itemPressed = oEvent.getSource();
        var oContext = itemPressed.getBindingContext("jsonEmployees");

        var objectContext = oContext.getObject();
        var orders = objectContext.Orders;

        var ordersItems = [];

        for (var i in orders) {
          ordersItems.push(new sap.m.ColumnListItem({
            cells: [
              new sap.m.Label({ text: orders[i].OrderID }),
              new sap.m.Label({ text: orders[i].Freight }),
              new sap.m.Label({ text: orders[i].ShipAddress })
            ]

          }));

        }

        var newTable = new sap.m.Table({
          width: "auto",
          columns: [
            new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
            new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
            new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) })
          ],
          items: ordersItems
        }).addStyleClass("sapUiSmallMargin");

        ordersTable.addItem(newTable);

        var newTableJSON = new sap.m.Table();
        newTableJSON.setWidth("auto");
        newTableJSON.addStyleClass("sapUiSmallMargin");

        var columnOrderID = new sap.m.Column();
        var labelOrderID = new sap.m.Label();
        labelOrderID.bindProperty("text", "i18n>orderID");
        columnOrderID.setHeader(labelOrderID);
        newTableJSON.addColumn(columnOrderID);

        var columnFreight = new sap.m.Column();
        var labelFreight = new sap.m.Label();
        labelFreight.bindProperty("text", "i18n>freight");
        columnFreight.setHeader(labelFreight);
        newTableJSON.addColumn(columnFreight);

        var columnShipAddress = new sap.m.Column();
        var labelShipAddress = new sap.m.Label();
        labelShipAddress.bindProperty("text", "i18n>shipAddress");
        columnShipAddress.setHeader(labelShipAddress);
        newTableJSON.addColumn(columnShipAddress);

        //Celdas
        var columnListItem = new sap.m.ColumnListItem();

        var cellOrderID = new sap.m.Label();
        cellOrderID.bindProperty("text", "jsonEmployees>OrderID");
        columnListItem.addCell(cellOrderID);

        var cellFreight = new sap.m.Label();
        cellFreight.bindProperty("text", "jsonEmployees>Freight");
        columnListItem.addCell(cellFreight);
        
        var cellShipAddress = new sap.m.Label();
        cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress");
        columnListItem.addCell(cellShipAddress);
        
        var oBindingInfo= {
           model : "jsonEmployees",
           path: "Orders",
           template: columnListItem
        };

        newTableJSON.bindAggregation("items", oBindingInfo);
        newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());

        ordersTable.addItem(newTableJSON);
      }

    });
  });
