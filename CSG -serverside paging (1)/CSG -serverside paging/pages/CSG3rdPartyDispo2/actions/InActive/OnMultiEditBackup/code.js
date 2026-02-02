// Collect multi-row data from UI Bakery form and selected table rows
const rows = ui.ontable5.selectedRows.data || [];
const form = ui.MultiEditform4.value;

return { rows, form };
