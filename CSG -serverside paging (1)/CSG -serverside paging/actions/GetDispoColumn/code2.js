const standardView = ["Status_Dispo","Status_Transport","Condition","MBL_No","Container_No","TransmissionTimestamp"];

//const selected = state.visibleColumns?.length ? state.visibleColumns : standardView;
let executedView = [];
if (state.visibleColumns.length != 0) {
  selected =  state.visibleColumns
} else {
  selected = standardView
}
executedView = state.allColumns.filter(col => selected.includes(col.prop));
state.showColumns = executedView;
return executedView;
