const current = ui.form10.value;
const original = ui.form10.originalValue ?? {};

const trackedFields = ['ETA_DeliveryAddress', 'Direct_Truck', 'DropOff_Terminal_TIR', 'Pincode'];

const hasTrackedFieldChanged = trackedFields.some(field => {
  const currentVal = current[field] ?? '';
  const originalVal = original[field] ?? '';
  return currentVal !== originalVal;
});

return {
  toTransporter: hasTrackedFieldChanged ? 1 : 0
};
