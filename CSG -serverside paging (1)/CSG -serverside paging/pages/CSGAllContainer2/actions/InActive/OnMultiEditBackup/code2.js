// Parse the variables (they are stored as JSON strings)
const customers = JSON.parse(state.RowCustomerID || "[]");
const mbls = JSON.parse(state.RowMBL_ID || "[]");
const containers = JSON.parse(state.RowContainerID || "[]");

// Build combined array
const payloadArray = customers.map((c, i) => ({
  customer_id: c,
  MBL_ID: mbls[i],
  ContainerID: containers[i]
}));

// Return JSON string
return JSON.stringify(payloadArray, null, 2);
