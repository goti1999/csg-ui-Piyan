// Collect multi-row data from UI Bakery form and selected table rows
const rows = ui.ontable13.selectedRows.data || [];
const form = ui.MultiEditform12.value;

return { rows, form };
