

// 2. Clear selected row (for single row selection)
ui.ontable.selectedRow = null;
ui.ontable.selectedRowIndex = -1;

// 3. Clear selected rows (for multi-row selection)
ui.ontable.selectedRows = [];

// 4. OPTIONAL: Clear related form fields if bound
ui.form.reset(); // <-- Replace 'yourFormName' with actual form name

