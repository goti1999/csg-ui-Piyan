/// 1. Clear all filters
if (typeof ui.ontable.resetFilters === "function") {
  ui.ontable.resetFilters();
}

// 2. Clear single row selection
ui.ontable.selectedRow = null;
ui.ontable.selectedRowIndex = -1;

// 3. Clear multi-row selection
if (ui.ontable.selectedRows) {
  ui.ontable.selectedRows.data = [];
  ui.ontable.selectedRows.length = 0; // ensure internal array is empty
}

// 4. Reset table internal state (forces UI refresh)
if (typeof ui.ontable.setState === "function") {
  ui.ontable.setState({
    selectedRow: null,
    selectedRowIndex: -1,
    selectedRows: { data: [], length: 0 }
  });
}

// 5. OPTIONAL: Clear related form fields
// if (ui.form) ui.form.reset();

// 6. Force table to refresh/re-render
if (typeof ui.ontable.refresh === "function") {
  ui.ontable.refresh();
}



// 4. OPTIONAL: Clear related form fields if bound
//ui.form.reset(); // <-- Replace 'yourFormName' with actual form name

