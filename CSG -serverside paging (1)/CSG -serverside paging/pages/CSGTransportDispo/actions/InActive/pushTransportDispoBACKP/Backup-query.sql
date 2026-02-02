const selected = ui.form.value;

const newETA = selected.data.ETA_DeliveryAddress
  ? new Date(selected.data.ETA_DeliveryAddress).toISOString()
  : '';
const originalETA = selected.originalData?.ETA_DeliveryAddress
  ? new Date(selected.originalData.ETA_DeliveryAddress).toISOString()
  : '';

const newTruck = form.value.Direct_Truck
  ? new (form.value.Direct_Trucks)
  : '';
const oldTruck = form.value.originalData?.Direct_Truck
  ? newtruck (sform.value.originalData.Direkt_Truck)
  : '';


let toTransporterValue = selected.data.to_Transporter || 0;

// If ETA changed and newETA is not empty, set to 1
if (newETA !== originalETA && newETA !== ''  || newTruck !== oldTruck && newTruck !== '') {
  toTransporterValue = 1;
}

return [{ toTransporter: toTransporterValue }];