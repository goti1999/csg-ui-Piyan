(() => {
  // Get the row data from the clicked row
  const row = ui.ontable13.clickedRow?.data || {};

  // Helper to safely handle null/undefined
  const sanitize = (value, defaultVal = null) => value ?? defaultVal;

  // Return only the required fields
  return {
    CustomerID: sanitize(row.CustomerID),
    MBL_ID: sanitize(row.MBL_ID),
    ContainerID: sanitize(row.ContainerID),
  };
})();
