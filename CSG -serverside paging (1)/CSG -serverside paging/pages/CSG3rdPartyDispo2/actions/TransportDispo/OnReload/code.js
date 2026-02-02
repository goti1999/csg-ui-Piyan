/// 1. Clear all filters
if (typeof ui.ontable5.resetFilters === "function") {
  ui.ontable5.resetFilters();
}

// 2. Clear single row selection
ui.ontable5.selectedRow = null;
ui.ontable5.selectedRowIndex = -1;

// 3. Clear multi-row selection
if (ui.ontable5.selectedRows) {
  ui.ontable5.selectedRows.data = [];
  ui.ontable5.selectedRows.length = 0; // ensure internal array is empty
}

// 4. Reset table internal state (forces UI refresh)
if (typeof ui.ontable5.setState === "function") {
  ui.ontable5.setState({
    selectedRow: null,
    selectedRowIndex: -1,
    selectedRows: { data: [], length: 0 }
  });
}

// 5. OPTIONAL: Clear related form fields
// if (ui.form4) ui.form4.reset();

// 6. Force table to refresh/re-render
if (typeof ui.ontable5.refresh === "function") {
  ui.ontable5.refresh();
}



// 4. OPTIONAL: Clear related form fields if bound
//ui.form4.reset(); // <-- Replace 'yourFormName' with actual form name

