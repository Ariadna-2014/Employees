sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"logaligroup/employees/model/formatter"

], function (Controller,formatter) {
	"use strict";

	return Controller.extend("logaligroup.employees.controller.EmployeeDetails", {

	    formatter: formatter,

		onInit: function () {

		},

		onCreateIncidence: function () {

			var tableIncidence = this.getView().byId("tableIncidence");
			var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
			var incidenceModel = this.getView().getModel("incidenceModel");
			var odata = incidenceModel.getData();
			var index = odata.length;
			odata.push({ index: index + 1 });
			incidenceModel.refresh();
			newIncidence.bindElement("incidenceModel>/" + index);
			tableIncidence.addContent(newIncidence);

		},

		onDeleteIncidence: function (oEvent) {

			var tableIncidence = this.getView().byId("tableIncidence");
			var rowIncidence = oEvent.getSource().getParent().getParent();
			var incidenceModel = this.getView().getModel("incidenceModel");
			var odata = incidenceModel.getData();
			var contextObj = rowIncidence.getBindingContext("incidenceModel");

			odata.splice(contextObj.index - 1, 1);
			for (var i in odata) {
				odata[i].index = parseInt(i) + 1;
			};

			incidenceModel.refresh();
			tableIncidence.removeContent(rowIncidence);

			for (var j in tableIncidence.getContent()) {
				tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
			}
		}


	});

});

