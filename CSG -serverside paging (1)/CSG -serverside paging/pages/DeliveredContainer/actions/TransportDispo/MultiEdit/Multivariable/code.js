(() => {
  // Get selected rows first, fallback to clicked row
  let selected =
    ui.ontable13?.selectedRows?.data?.length
      ? ui.ontable13.selectedRows.data
      : ui.ontable13?.clickedRow?.data
        ? [ui.ontable13.clickedRow.data]
        : [];

  const sanitize = (value, defaultVal = null) => value ?? defaultVal;

  if (!Array.isArray(selected) || selected.length === 0) {
    console.warn("No row selected or clicked.");
    state.RowCustomerID = null;
    state.RowMBL_ID = null;
    state.RowContainerID = null;
    state.Rowtransport_Dispo_ID = null;
    return {};
  }

  // Map values and create comma-separated string
  const RowCustomerID = selected.map(r => `"${sanitize(r.CustomerID)}"`).join(",");
  const RowMBL_ID = selected.map(r => `"${sanitize(r.MBL_ID)}"`).join(",");
  const RowContainerID = selected.map(r => `"${sanitize(r.ContainerID)}"`).join(",");
  const Rowtransport_Dispo_ID = selected.map(r => sanitize(r.transport_Dispo_ID)).join(",");

  // Save in state
  state.RowCustomerID = RowCustomerID;
  state.RowMBL_ID = RowMBL_ID;
  state.RowContainerID = RowContainerID;
  state.Rowtransport_Dispo_ID = Rowtransport_Dispo_ID;

  // Return for debugging
  return {
    RowCustomerID,
    RowMBL_ID,
    RowContainerID,
    Rowtransport_Dispo_ID
  };
})();
