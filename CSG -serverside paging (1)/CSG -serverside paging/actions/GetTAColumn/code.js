// Step 1: Get current user selection
state.visibleColumns = {{ ui.select4.value }};
const selected = state.visibleColumns || [];

// Step 2: Combine initial columns + selected columns
// Ensure no duplicates
const allProps = [
  ...state.showColumns.map(c => c.prop),
  ...selected
];
const uniqueProps = [...new Set(allProps)];

// Step 3: Build final column definitions
const executedView = state.allColumns.filter(col => uniqueProps.includes(col.prop));

// Step 4: Update showColumns so the table shows both
state.showColumns = executedView;

// Step 5: Return final column set
return executedView;
