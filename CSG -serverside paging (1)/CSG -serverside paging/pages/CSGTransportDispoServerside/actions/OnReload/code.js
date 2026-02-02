// 1. Clear all filters
ui.ontable7.resetFilters();

// 2. Clear selected row (for single row selection)
ui.ontable7.selectedRow = null;
ui.ontable7.selectedRowIndex = -1;

// 3. Clear selected rows (for multi-row selection)
ui.ontable7.selectedRows = [];

// 4. OPTIONAL: Clear related form fields if bound
ui.form7.reset(); // <-- Replace 'yourFormName' with actual form name

