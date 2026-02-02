// Get the full edited row from your popup
const row = {{ui.todopopup9.value}};

// Convert to_Customer boolean to 1 or 0 (integer)
const toCustomerInt = row.to_Customer === true ? 1 : 0;

// Return updated entity and filter by primary key 'disposed_id'
return {
  entity: {
    ...row,
    to_Customer: toCustomerInt,        // updated field
    transport_Dispo_ID: row.transport_Dispo_ID || null  // keep or null if undefined
  },
  filters: [
    {
      column: "disposed_id",           // your primary key column
      operation: "=",
      value: row.disposed_id           // primary key value to update the correct row
    }
  ]
};
