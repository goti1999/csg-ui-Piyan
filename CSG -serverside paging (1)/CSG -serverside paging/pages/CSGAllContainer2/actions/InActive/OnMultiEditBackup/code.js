// Collect multi-row data from UI Bakery form and selected table rows
const rows = ui.ontable9.selectedRows.data || [];
const form = ui.MultiEditform8.value;

return { rows, form };
