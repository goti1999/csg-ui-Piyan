/// 1. Clear all filters
if (typeof ui.ontable10.resetFilters === "function") {
  ui.ontable10.resetFilters();
}

// 2. Clear single row selection
ui.ontable10.selectedRow = null;
ui.ontable10.selectedRowIndex = -1;

// 3. Clear multi-row selection
if (ui.ontable10.selectedRows) {
  ui.ontable10.selectedRows.data = [];
  ui.ontable10.selectedRows.length = 0; // ensure internal array is empty
}

// 4. Reset table internal state (forces UI refresh)
if (typeof ui.ontable10.setState === "function") {
  ui.ontable10.setState({
    selectedRow: null,
    selectedRowIndex: -1,
    selectedRows: { data: [], length: 0 }
  });
}

// 5. OPTIONAL: Clear related form fields
// if (ui.form10) ui.form10.reset();

// 6. Force table to refresh/re-render
if (typeof ui.ontable10.refresh === "function") {
  ui.ontable10.refresh();
}



// 4. OPTIONAL: Clear related form fields if bound
//ui.form10.reset(); // <-- Replace 'yourFormName' with actual form name

