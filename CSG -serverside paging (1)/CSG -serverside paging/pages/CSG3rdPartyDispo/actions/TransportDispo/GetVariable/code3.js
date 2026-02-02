(() => {
  const selected = ui.ontable11?.selectedRows?.data;

  // Early exit if nothing is selected
  if (!Array.isArray(selected) || selected.length === 0) {
    console.warn("No rows selected or invalid structure.");
    return {
      RowCustomerID: null,
      RowMBL_ID: null,
      RowContainerID: null,
      Rowtransport_Dispo_ID: null
    };
  }

  // Destructure directly for faster access
  const { CustomerID, MBL_ID, ContainerID, transport_Dispo_ID } = selected[0] || {};

  // Assign to state (if needed elsewhere)
  state.RowCustomerID = CustomerID ?? null;
  state.RowMBL_ID = MBL_ID ?? null;
  state.RowContainerID = ContainerID ?? null;
  state.Rowtransport_Dispo_ID = transport_Dispo_ID ?? null;

  // Return all 4 in one object
  return {
    RowCustomerID: state.RowCustomerID,
    RowMBL_ID: state.RowMBL_ID,
    RowContainerID: state.RowContainerID,
    Rowtransport_Dispo_ID: state.Rowtransport_Dispo_ID
  };
})();
