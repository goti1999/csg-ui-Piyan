

// 2. Clear selected row (for single row selection)
ui.ontable10.selectedRow = null;
ui.ontable10.selectedRowIndex = -1;

// 3. Clear selected rows (for multi-row selection)
ui.ontable10.selectedRows = [];

// 4. OPTIONAL: Clear related form fields if bound
ui.form10.reset(); // <-- Replace 'yourFormName' with actual form name

