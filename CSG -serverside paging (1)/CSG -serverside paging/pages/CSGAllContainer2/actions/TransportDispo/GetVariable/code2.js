(() => {
  const selected = ui.ontable9?.selectedRows?.data;

  // helper for safe access
  const sanitize = (value, defaultVal = null) => value ?? defaultVal;

  // if nothing selected → return clean nulls
  if (!Array.isArray(selected) || selected.length === 0) {
    console.warn("No rows selected or invalid structure.");
    state.RowCustomerID = null;
    state.RowMBL_ID = null;
    state.RowContainerID = null;
    state.Rowtransport_Dispo_ID = null;

    return {
      RowCustomerID: state.RowCustomerID,
      RowMBL_ID: state.RowMBL_ID,
      RowContainerID: state.RowContainerID,
      Rowtransport_Dispo_ID: state.Rowtransport_Dispo_ID
    };
  }

  // Get first row and safely sanitize fields
  const firstRow = selected[0] || {};

  state.RowCustomerID = sanitize(firstRow.CustomerID);
  state.RowMBL_ID = sanitize(firstRow.MBL_ID);
  state.RowContainerID = sanitize(firstRow.ContainerID);
  state.Rowtransport_Dispo_ID = sanitize(firstRow.transport_Dispo_ID);

  // Return all in one object
  return {
    RowCustomerID: state.RowCustomerID,
    RowMBL_ID: state.RowMBL_ID,
    RowContainerID: state.RowContainerID,
    Rowtransport_Dispo_ID: state.Rowtransport_Dispo_ID
  };
})();
