return data.map(item => {
  // Helper function to calculate difference in days and hours
  const diffReadable = (date1, date2) => {
    if (!date1 || !date2) return "N/A";
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Get absolute difference in milliseconds
    const diffMs = Math.abs(d1 - d2);

    // Calculate days and hours
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    // Format result (e.g. "6 days 10 hours")
    return `${days} days ${hours} hours`;
  };

  // 1️⃣ ETA vs ATD - Port of Discharge
  const diff_PortOfDischarge = diffReadable(
    item.ETA_PortOfDischarge,
    item.ATD_Pickup_PortOfDischarge
  );

  // 2️⃣ ETA vs ATA - Terminal Inland
  const diff_TerminalInland = diffReadable(
    item.ETA_Terminal_Inland,
    item.ATA_Terminal_Inland
  );

  // 3️⃣ ETA vs ATA - Delivery Address
  const diff_DeliveryAddress = diffReadable(
    item.ETA_DeliveryAddress,
    item.ATA_DeliveryAddress
  );

  // 4️⃣ ATA vs ATD - Seaport
  const diff_Seaport_ATA_ATD = diffReadable(
    item.ATA_Seaport,
    item.ATD_Seaport
  );

  // 5️⃣ ETA vs ETD - Seaport
  const diff_Seaport_ETA_ETD = diffReadable(
    item.ETA_Seaport,
    item.ETD_Seaport
  );

  // Return the original row + calculated fields
  return {
    ...item,
    Diff_PortOfDischarge: String(diff_PortOfDischarge),
    Diff_TerminalInland: String(diff_TerminalInland),
    Diff_DeliveryAddress: String(diff_DeliveryAddress),
    Diff_Seaport_ATA_ATD: String(diff_Seaport_ATA_ATD),
    Diff_Seaport_ETA_ETD: String(diff_Seaport_ETA_ETD)
  };
});
