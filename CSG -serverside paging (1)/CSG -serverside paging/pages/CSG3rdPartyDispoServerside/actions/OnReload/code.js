// 1. Clear all filters
ui.ontable8.resetFilters();

// 2. Clear selected row (for single row selection)
ui.ontable8.selectedRow = null;
ui.ontable8.selectedRowIndex = -1;

// 3. Clear selected rows (for multi-row selection)
ui.ontable8.selectedRows = [];

// 4. OPTIONAL: Clear related form fields if bound
ui.form8.reset(); // <-- Replace 'yourFormName' with actual form name

