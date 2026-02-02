// Collect multi-row data from UI Bakery form and selected table rows
const rows = ui.ontable.selectedRows.data || [];
const form = ui.MultiEditform.value;

return { rows, form };
