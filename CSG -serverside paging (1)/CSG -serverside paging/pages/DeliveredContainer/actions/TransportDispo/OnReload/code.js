/// 1. Clear all filters
if (typeof ui.ontable13.resetFilters === "function") {
  ui.ontable13.resetFilters();
}

// 2. Clear single row selection
ui.ontable13.selectedRow = null;
ui.ontable13.selectedRowIndex = -1;

// 3. Clear multi-row selection
if (ui.ontable13.selectedRows) {
  ui.ontable13.selectedRows.data = [];
  ui.ontable13.selectedRows.length = 0; // ensure internal array is empty
}

// 4. Reset table internal state (forces UI refresh)
if (typeof ui.ontable13.setState === "function") {
  ui.ontable13.setState({
    selectedRow: null,
    selectedRowIndex: -1,
    selectedRows: { data: [], length: 0 }
  });
}

// 5. OPTIONAL: Clear related form fields
// if (ui.form13) ui.form13.reset();

// 6. Force table to refresh/re-render
if (typeof ui.ontable13.refresh === "function") {
  ui.ontable13.refresh();
}



// 4. OPTIONAL: Clear related form fields if bound
//ui.form13.reset(); // <-- Replace 'yourFormName' with actual form name

