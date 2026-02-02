const selected = ui.ontable13.selectedRows;

if (!selected || !Array.isArray(selected.data)) {
  console.warn("No rows selected or invalid structure.");
  return "[]"; // Return empty JSON array string
}

// Step 1: Extract the required fields
const payloadArray = selected.data.map(row => ({
  customer_id: row.CustomerID,
  MBL_ID: row.MBL_ID,
  ContainerID: row.ContainerID
}));

// Step 2: Convert to JSON string
const jsonString = JSON.stringify(payloadArray, null, 2); // Pretty printed

return jsonString
// return payloadArray;
