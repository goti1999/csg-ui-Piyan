/// 1. Clear all filters
if (typeof ui.ontable9.resetFilters === "function") {
  ui.ontable9.resetFilters();
}

// 2. Clear single row selection
ui.ontable9.selectedRow = null;
ui.ontable9.selectedRowIndex = -1;

// 3. Clear multi-row selection
if (ui.ontable9.selectedRows) {
  ui.ontable9.selectedRows.data = [];
  ui.ontable9.selectedRows.length = 0; // ensure internal array is empty
}

// 4. Reset table internal state (forces UI refresh)
if (typeof ui.ontable9.setState === "function") {
  ui.ontable9.setState({
    selectedRow: null,
    selectedRowIndex: -1,
    selectedRows: { data: [], length: 0 }
  });
}

// 5. OPTIONAL: Clear related form fields
// if (ui.form9) ui.form9.reset();

// 6. Force table to refresh/re-render
if (typeof ui.ontable9.refresh === "function") {
  ui.ontable9.refresh();
}



// 4. OPTIONAL: Clear related form fields if bound
//ui.form9.reset(); // <-- Replace 'yourFormName' with actual form name

