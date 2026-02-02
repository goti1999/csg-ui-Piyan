(() => {
  const row = ui.ontable13.selectedRow?.data || {};

  const sanitize = (value, defaultVal = null) => value ?? defaultVal;

  return {
    CustomerID: sanitize(row.CustomerID),
    MBL_ID: sanitize(row.MBL_ID),
    ContainerID: sanitize(row.ContainerID),

  };
})();
