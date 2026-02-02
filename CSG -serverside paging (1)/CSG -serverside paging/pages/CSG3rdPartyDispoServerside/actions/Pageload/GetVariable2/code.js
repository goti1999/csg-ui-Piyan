const selected = ui.ontable.selectedRows;

if (!selected || !Array.isArray(selected.data) || selected.data.length === 0) {
  console.warn("No rows selected or invalid structure.");
  state.RowCustomerID = null;
  state.RowMBL_ID = null;
  state.RowContainerID = null;
  return {
    RowCustomerID: state.RowCustomerID,
    RowMBL_ID: state.RowMBL_ID,
    RowContainerID: state.RowContainerID

  };
}

// Get the **first selected row** values
const firstRow = selected.data[0];

state.RowCustomerID = firstRow.CustomerID;
state.RowMBL_ID = firstRow.MBL_ID;
state.RowContainerID = firstRow.ContainerID;

// Return the plain values
return {
  RowCustomerID: state.RowCustomerID,
  RowMBL_ID: state.RowMBL_ID,
  RowContainerID: state.RowContainerID
};
