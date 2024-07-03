sap.ui.define([
  "logaligroup/employees/controller/Base.controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment"
],
 
  function (Base, Filter, FilterOperator, Fragment) {
    "use strict";

    return Base.extend("logaligroup.employees.controller.MasterEmployee", {

      onInit: function () {
        this._bus = sap.ui.getCore().getEventBus();
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

        this.byId("labelCountry").setVisible(true);
        this.byId("slCountry").setVisible(true);

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
        var oContext = iconPressed.getBindingContext("odataNorthwind");
        var oPath = oContext.getPath();

        if (!this._oDialogOrders) {
          Fragment.load({
            name: "logaligroup.employees.fragment.DialogOrders",
            controller: this
          }).then(function (oDialog) {
            this._oDialogOrders = oDialog;
            this.getView().addDependent(oDialog);
            this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
            this._oDialogOrders.open();
          }.bind(this));
        } else {
          //Dialog binding to the Context to have access to the data of selected item
          this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
          this._oDialogOrders.open();
        }
      },

      onCloseOrders: function () {
        this._oDialogOrders.close();
      },

      showEmployee: function (oEvent) {
        var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
        this._bus.publish("flexible", "showEmployee", path);
      }

    });
  });
