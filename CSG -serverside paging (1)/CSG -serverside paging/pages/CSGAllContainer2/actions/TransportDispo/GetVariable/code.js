(() => {
  // Try to get selected rows first, then fallback to clicked row
  let selected =
    ui.ontable9?.selectedRows?.data?.length
      ? ui.ontable9.selectedRows.data
      : ui.ontable9?.clickedRow?.data
        ? [ui.ontable9.clickedRow.data] // wrap single row into array
        : [];

  // helper for safe access
  const sanitize = (value, defaultVal = null) => value ?? defaultVal;

  // if nothing selected → reset all
  if (!Array.isArray(selected) || selected.length === 0) {
    console.warn("No row selected or clicked.");
    state.RowCustomerID = null;
    state.RowMBL_ID = null;
    state.RowContainerID = null;
    state.Rowtransport_Dispo_ID = null;
    state.RowContainer_No = null;
    state.RowMBL_No = null;

    return {
      RowCustomerID: null,
      RowMBL_ID: null,
      RowContainerID: null,
      Rowtransport_Dispo_ID: null,
      RowContainer_No: null,
      RowMBL_No: null
    };
  }

  // Always use first selected or clicked row
  const row = selected[0] || {};

  // Assign safely
  state.RowCustomerID = sanitize(row.CustomerID);
  state.RowMBL_ID = sanitize(row.MBL_ID);
  state.RowContainerID = sanitize(row.ContainerID);
  state.Rowtransport_Dispo_ID = sanitize(row.transport_Dispo_ID);
  state.RowContainer_No = sanitize(row.Container_No);
  state.RowMBL_No = sanitize(row.MBL_No);

  // Return for debug/log
  return {
    RowCustomerID: state.RowCustomerID,
    RowMBL_ID: state.RowMBL_ID,
    RowContainerID: state.RowContainerID,
    Rowtransport_Dispo_ID: state.Rowtransport_Dispo_ID,
    RowContainer_No: state.RowContainer_No,
    RowMBL_No: state.RowMBL_No
  };
})();
