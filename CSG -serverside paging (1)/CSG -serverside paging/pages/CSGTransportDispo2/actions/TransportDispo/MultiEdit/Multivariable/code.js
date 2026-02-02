(() => {
  // Try to get selected rows first, then fallback to clicked row
  let selected =
    ui.ontable4?.selectedRows?.data?.length
      ? ui.ontable4.selectedRows.data
      : ui.ontable4?.clickedRow?.data
        ? [ui.ontable4.clickedRow.data] // wrap single row into array
        : [];

  const sanitize = (value, defaultVal = null) => value ?? defaultVal;

  // If nothing selected → reset
  if (!Array.isArray(selected) || selected.length === 0) {
    console.warn("No row selected or clicked.");
    state.RowCustomerID = "[]";
    state.RowMBL_ID = "[]";
    state.RowContainerID = "[]";
    state.Rowtransport_Dispo_ID = "[]";
    return {};
  }

  // Build arrays for each field
  const RowCustomerID = selected.map(r => sanitize(r.CustomerID));
  const RowMBL_ID = selected.map(r => sanitize(r.MBL_ID));
  const RowContainerID = selected.map(r => sanitize(r.ContainerID));
  const Rowtransport_Dispo_ID = selected.map(r => sanitize(r.transport_Dispo_ID));

  // Store as JSON strings in state (so JSON.parse works later)
  state.RowCustomerID = JSON.stringify(RowCustomerID);
  state.RowMBL_ID = JSON.stringify(RowMBL_ID);
  state.RowContainerID = JSON.stringify(RowContainerID);
  state.Rowtransport_Dispo_ID = JSON.stringify(Rowtransport_Dispo_ID);

  // Return for debugging
  return {
    RowCustomerID,
    RowMBL_ID,
    RowContainerID,
    Rowtransport_Dispo_ID
  };
})();
