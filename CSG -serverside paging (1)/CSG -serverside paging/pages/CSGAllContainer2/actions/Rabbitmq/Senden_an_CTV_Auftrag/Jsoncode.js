const selected = ui.ontable9.selectedRows;

if (!selected || !Array.isArray(selected.data)) {
  console.warn("No rows selected or invalid structure.");
  return "[]";
}

// Build plain text output
const result = `Container_No:\n` +
  selected.data
    .map((row, index) => `${index + 1}:- ${row.Container_No}`)
    .join('\n');

return result;
