sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller,
    Filter,
    FilterOperator,
    Fragment) {
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
        //Get selected Controller
        var iconPressed = oEvent.getSource();
        //Context from the model
        var oContext = iconPressed.getBindingContext("jsonEmployees");
        var oPath = oContext.getPath();

        if (!this._oDialogOrders) {
          //this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
          //this.getView().addDependent(this._oDialogOrders);
          Fragment.load({
            name: "logaligroup.employees.fragment.DialogOrders",
            controller: this
          }).then(function(oDialog){
          this._oDialogOrders = oDialog;
          this.getView().addDependent(oDialog);
          this._oDialogOrders.bindElement("jsonEmployees>" + oContext.getPath());
          this._oDialogOrders.open();
          }.bind(this));
        } else {
          //Dialog binding to the Context to have access to the data of selected item
          this._oDialogOrders.bindElement("jsonEmployees>" + oContext.getPath());
          //this._oDialogOrders.bindElement({
          //  path: oPath,
          //  model: "jsonEmployees>"
          //});
          this._oDialogOrders.open();
        }
      },

      onCloseOrders: function () {
        this._oDialogOrders.close();
      }

    });
  });
