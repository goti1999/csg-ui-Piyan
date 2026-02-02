const step1Rows = steps.CombinedArray.data || [];   // first step result
const step2Rows = steps.code5.data || [];          // second step result

// Merge both based on CustomerID + MBL_ID + ContainerID
const finalMerged = step1Rows.map(s1 => {
  const s2 = step2Rows.find(r =>
    r.CustomerID === s1.CustomerID &&
    r.MBL_ID === s1.MBL_ID &&
    r.ContainerID === s1.ContainerID
  ) || {};

  return {
    customer_id: s1.CustomerID,        // lowercase customer_id
    MBL_ID: s1.MBL_ID,
    ContainerID: s1.ContainerID,
    Transport_Dispo_ID: s1.transport_Dispo_ID ?? s2.Transport_Dispo_ID ?? null,
    ATA_Terminal_Inland: s1.ATA_Terminal_Inland ?? s2.ATA_Terminal_Inland ?? null,
    DeliveryAddress: s1.DeliveryAddress ?? s2.DeliveryAddress ?? null,
    Direct_Truck: s1.Direct_Truck ?? s2.Direct_Truck ?? null,
    DropOff_Terminal: s1.DropOff_Terminal ?? s2.DropOff_Terminal ?? null,
    DropOff_Terminal_TIR: s1.DropOff_Terminal_TIR ?? s2.DropOff_Terminal_TIR ?? null,
    ETA_DeliveryAddress: s1.ETA_DeliveryAddress ?? s2.ETA_DeliveryAddress ?? null,
    Pincode: s1.Pincode ?? s2.Pincode ?? null,
    Transport_Mode_final_DeliveryAddress: s1.Transport_Mode_final_DeliveryAddress ?? s2.Transport_Mode_final_DeliveryAddress ?? null
  };
});

// Only include the three fields for string output


// Return as JSON string

