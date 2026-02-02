// Build dynamic WHERE clause for SQL
const filters = [];
const f = ui.ontable4.filters;

// String/NVARCHAR filters
if (f.Status_Dispo) filters.push(`d.Status_Dispo LIKE '%${f.Status_Dispo}%'`);
if (f.Condition) filters.push(`d.Condition LIKE '%${f.Condition}%'`);
if (f.Voyage) filters.push(`d.Voyage LIKE '%${f.Voyage}%'`);
if (f.ContainerSize) filters.push(`d.ContainerSize LIKE '%${f.ContainerSize}%'`);
if (f.CustomerID) filters.push(`d.CustomerID LIKE '%${f.CustomerID}%'`);
if (f.MBL_ID) filters.push(`d.MBL_ID LIKE '%${f.MBL_ID}%'`);
if (f.ContainerID) filters.push(`d.ContainerID LIKE '%${f.ContainerID}%'`);
if (f.Status_Transport) filters.push(`d.Status_Transport LIKE '%${f.Status_Transport}%'`);
if (f.Broker) filters.push(`d.Broker LIKE '%${f.Broker}%'`);
if (f.Carrier) filters.push(`d.Carrier LIKE '%${f.Carrier}%'`);
if (f.Vessel) filters.push(`d.Vessel LIKE '%${f.Vessel}%'`);
if (f.PortOfDischarge_Lima) filters.push(`d.PortOfDischarge_Lima LIKE '%${f.PortOfDischarge_Lima}%'`);
if (f.PackingMethod) filters.push(`d.PackingMethod LIKE '%${f.PackingMethod}%'`);
if (f.TotalWeight) filters.push(`CAST(d.TotalWeight AS NVARCHAR) LIKE '%${f.TotalWeight}%'`);
if (f.last_eventID) filters.push(`d.last_eventID LIKE '%${f.last_eventID}%'`);
if (f.PortOfLoading_Lima) filters.push(`d.PortOfLoading_Lima LIKE '%${f.PortOfLoading_Lima}%'`);
if (f.Transport_Mode_Terminal) filters.push(`d.Transport_Mode_Terminal LIKE '%${f.Transport_Mode_Terminal}%'`);
if (f.Transport_Mode_final_DeliveryAddress) filters.push(`d.Transport_Mode_final_DeliveryAddress LIKE '%${f.Transport_Mode_final_DeliveryAddress}%'`);
if (f.DeliveryAddress) filters.push(`d.DeliveryAddress LIKE '%${f.DeliveryAddress}%'`);
if (f.MBL_No) filters.push(`tm.Wert LIKE '%${f.MBL_No}%'`);
if (f.Container_No) filters.push(`tm2.Wert LIKE '%${f.Container_No}%'`);
if (f.Terminal_Inland_CundA) filters.push(`d.Terminal_Inland_CundA = '${f.Terminal_Inland_CundA}'`);

// Boolean/bit filters
["AdvertFlag","RealAdvertFlag","Direct_Truck","todo","TAC","into_CW1","to_Customer","to_Transporter"].forEach(key => {
  if (f[key] !== null && f[key] !== undefined && f[key] !== "") {
    filters.push(`d.${key} = ${f[key] ? 1 : 0}`);
  }
});

// Date filters (as string match)
[
  "TransmissionTimestamp","ATA_DeliveryAddress","ATA_DropOff_Terminal","ATA_Seaport",
  "ATA_Terminal_Inland","ATD_Pickup_PortOfDischarge","ATD_Seaport","ATD_Terminal_Inland",
  "Containerverfuegbarkeit","CTV_ETA_PortOfDischarge","ETA_DeliveryAddress","ETA_Deliveryadress_CTV",
  "ETA_PortOfDischarge","ETA_Seaport","ETA_Service_Provider","ETA_Terminal_Inland",
  "ETA_Terminal_Inland_Vorgabe_NTL","ETD_Pickup_PortOfDischarge","ETD_PortOfLoading","ETD_Seaport",
  "DeliveryInfo_send_to_CTV","TAC_sent","Return_Date_to_Depot","final_date_delivery_address"
].forEach(col => {
  if (f[col]) {
    filters.push(`FORMAT(d.${col},'dd-MM-yyyy') LIKE '%${f[col]}%'`);
  }
});

// Return final WHERE snippet
return filters.length ? "AND " + filters.join(" AND ") : "";
