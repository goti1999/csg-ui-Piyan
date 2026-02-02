// Your selected row variables
const RowCustomerID = "10229";
const RowMBL_ID = "443254319";
const RowContainerID = "443468810";

// Assuming `rows` is your full dataset array (the big list you showed)
const filteredRows = rows.filter(r =>
  r.CustomerID === RowCustomerID &&
  r.MBL_ID === RowMBL_ID &&
  r.ContainerID === RowContainerID
);

// Now calculate differences only for the matched record(s)
const result = filteredRows.map(r => {
  const formatDiff = (start, end) => {
    if (!start || !end) return "N/A";
    const diffMs = new Date(end) - new Date(start);
    if (isNaN(diffMs)) return "Invalid date";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${diffDays} days ${diffHours} hours`;
  };

  return {
    CustomerID: r.CustomerID,
    MBL_ID: r.MBL_ID,
    ContainerID: r.ContainerID,
    Container_No: r.Container_No,
    MBL_No: r.MBL_No,
    transport_Dispo_ID: r.transport_Dispo_ID,

    Diff_PortOfDischarge: formatDiff(r.ATD_Pickup_PortOfDischarge, r.ETA_PortOfDischarge),
    Diff_TerminalInland: formatDiff(r.ETA_Terminal_Inland, r.ATA_Terminal_Inland),
    Diff_DeliveryAddress: formatDiff(r.ETA_DeliveryAddress, r.ATA_DeliveryAddress),
    Diff_Seaport_ATA_ATD: formatDiff(r.ATD_Seaport, r.ATA_Seaport),
    Diff_Seaport_ETA_ETD: formatDiff(r.ETD_Seaport, r.ETA_Seaport),
  };
});

// Log or return only the selected record with its calculated diffs
console.log(result);
return result;
