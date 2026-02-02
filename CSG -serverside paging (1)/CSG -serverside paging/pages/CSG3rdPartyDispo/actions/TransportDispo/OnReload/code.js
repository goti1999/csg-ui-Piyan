/// 1. Clear all filters
if (typeof ui.ontable11.resetFilters === "function") {
  ui.ontable11.resetFilters();
}

// 2. Clear single row selection
ui.ontable11.selectedRow = null;
ui.ontable11.selectedRowIndex = -1;

// 3. Clear multi-row selection
if (ui.ontable11.selectedRows) {
  ui.ontable11.selectedRows.data = [];
  ui.ontable11.selectedRows.length = 0; // ensure internal array is empty
}

// 4. Reset table internal state (forces UI refresh)
if (typeof ui.ontable11.setState === "function") {
  ui.ontable11.setState({
    selectedRow: null,
    selectedRowIndex: -1,
    selectedRows: { data: [], length: 0 }
  });
}

// 5. OPTIONAL: Clear related form fields
// if (ui.form11) ui.form11.reset();

// 6. Force table to refresh/re-render
if (typeof ui.ontable11.refresh === "function") {
  ui.ontable11.refresh();
}



// 4. OPTIONAL: Clear related form fields if bound
//ui.form11.reset(); // <-- Replace 'yourFormName' with actual form name

