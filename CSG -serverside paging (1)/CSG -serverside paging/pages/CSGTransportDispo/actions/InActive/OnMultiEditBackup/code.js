// Collect multi-row data from UI Bakery form and selected table rows
const rows = ui.ontable10.selectedRows.data || [];
const form = ui.MultiEditform9.value;

return { rows, form };
