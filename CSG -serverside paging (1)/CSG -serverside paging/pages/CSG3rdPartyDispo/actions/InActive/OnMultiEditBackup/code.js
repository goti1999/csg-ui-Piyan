// Collect multi-row data from UI Bakery form and selected table rows
const rows = ui.ontable11.selectedRows.data || [];
const form = ui.MultiEditform10.value;

return { rows, form };
