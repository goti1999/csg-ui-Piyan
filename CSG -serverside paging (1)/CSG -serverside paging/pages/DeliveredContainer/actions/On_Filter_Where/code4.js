// ----------- On_Filter_Where JS Action -----------

// Get table filters
let filters = ui.ontable13.filters || [];
let where = [];

// ----------- STRING FILTERS -----------
if (filters.MBL_No) where.push(`tm.Wert LIKE '%${filters.MBL_No}%'`);
if (filters.Container_No) where.push(`tm2.Wert LIKE '%${filters.Container_No}%'`);
if (filters.Carrier) where.push(`d.Carrier LIKE '%${filters.Carrier}%'`);
if (filters.Vessel) where.push(`d.Vessel LIKE '%${filters.Vessel}%'`);
if (filters.Broker) where.push(`d.Broker LIKE '%${filters.Broker}%'`);
if (filters.PortOfDischarge_UNLOCO) where.push(`d.PortOfDischarge_UNLOCO LIKE '%${filters.PortOfDischarge_UNLOCO}%'`);
if (filters.Terminal_PortOfDischarge) where.push(`d.Terminal_PortOfDischarge LIKE '%${filters.Terminal_PortOfDischarge}%'`);
if (filters.DropOff_Terminal) where.push(`d.DropOff_Terminal LIKE '%${filters.DropOff_Terminal}%'`);
if (filters.DropOff_Terminal_TIR) where.push(`d.DropOff_Terminal_TIR LIKE '%${filters.DropOff_Terminal_TIR}%'`);
if (filters.DeliveryAddress) where.push(`d.DeliveryAddress LIKE '%${filters.DeliveryAddress}%'`);
if (filters.Terminal_Inland_Vorgabe_NTL) where.push(`d.Terminal_Inland_Vorgabe_NTL LIKE '%${filters.Terminal_Inland_Vorgabe_NTL}%'`);
if (filters.Terminal_Inland_CundA) where.push(`d.Terminal_Inland_CundA LIKE '%${filters.Terminal_Inland_CundA}%'`);
if (filters.Terminal_Inland_CTV) where.push(`d.Terminal_Inland_CTV LIKE '%${filters.Terminal_Inland_CTV}%'`);
if (filters.Condition) where.push(`d.Condition LIKE '%${filters.Condition}%'`);
if (filters.Status_Dispo) where.push(`d.Status_Dispo LIKE '%${filters.Status_Dispo}%'`);
if (filters.Status_Transport) where.push(`d.Status_Transport LIKE '%${filters.Status_Transport}%'`);
if (filters.Transport_Mode_final_DeliveryAddress) where.push(`d.Transport_Mode_final_DeliveryAddress LIKE '%${filters.Transport_Mode_final_DeliveryAddress}%'`);
if (filters.Transport_Mode_Terminal) where.push(`d.Transport_Mode_Terminal LIKE '%${filters.Transport_Mode_Terminal}%'`);
if (filters.CustomerID) where.push(`d.CustomerID LIKE '%${filters.CustomerID}%'`);
if (filters.MBL_ID) where.push(`d.MBL_ID LIKE '%${filters.MBL_ID}%'`);
if (filters.ContainerID) where.push(`d.ContainerID LIKE '%${filters.ContainerID}%'`);
if (filters.Pincode) where.push(`d.Pincode LIKE '%${filters.Pincode}%'`);
if (filters.to_Customer) where.push(`d.to_Customer LIKE '%${filters.to_Customer}%'`);
if (filters.to_Transporter) where.push(`d.to_Transporter LIKE '%${filters.to_Transporter}%'`);

// ----------- BOOLEAN (BIT) FILTERS -----------
if (filters.AdvertFlag !== undefined && filters.AdvertFlag !== null)
  where.push(`d.AdvertFlag = ${filters.AdvertFlag ? 1 : 0}`);
if (filters.RealAdvertFlag !== undefined && filters.RealAdvertFlag !== null)
  where.push(`d.RealAdvertFlag = ${filters.RealAdvertFlag ? 1 : 0}`);
if (filters.Direct_Truck !== undefined && filters.Direct_Truck !== null)
  where.push(`d.Direct_Truck = ${filters.Direct_Truck ? 1 : 0}`);

// ----------- DATE FILTERS -----------
const dateFields = [
  'EarliestAdvertDate',
  'ETA_PortOfDischarge',
  'ATD_Pickup_PortOfDischarge',
  'ETA_Terminal_Inland',
  'ATA_Terminal_Inland',
  'ETA_DeliveryAddress',
  'ATA_DeliveryAddress',
  'ATA_DropOff_Terminal',
  'ATA_Seaport',
  'TransmissionTimestamp'
];

for (let f of dateFields) {
  if (filters[f]) {
    let dateVal = filters[f].split('T')[0]; // only keep date part
    where.push(`CAST(d.${f} AS DATE) = CAST('${dateVal}' AS DATE)`);
  }
}

// ----------- NUMBER / OTHER FILTERS -----------
if (filters.ContainerSize) where.push(`d.ContainerSize LIKE '%${filters.ContainerSize}%'`);
if (filters.transport_Dispo_ID) where.push(`d.transport_Dispo_ID = ${filters.transport_Dispo_ID}`);
if (filters.FirstTimestamp) {
  let dateVal = filters.FirstTimestamp.split('T')[0];
  where.push(`CAST(ft.Timestamp AS DATE) = CAST('${dateVal}' AS DATE)`);
}

// ----------- FALLBACK IF NO FILTERS -----------
let filterString = where.length > 0 ? where.join(' AND ') : '1=1';

// ----------- ASSIGN TO UI BAKERY VARIABLE -----------
state.DynamicFilter = filterString;

// ----------- RETURN FOR DEBUG/REFERENCE -----------
return filterString;
