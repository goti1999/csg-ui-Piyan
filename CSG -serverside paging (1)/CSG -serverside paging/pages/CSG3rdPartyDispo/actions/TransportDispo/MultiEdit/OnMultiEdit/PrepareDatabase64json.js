// Get the array data from CombinedArray step
const arrayData = steps.CombinedArray.data;

// Convert to JSON string and then to Base64 to avoid special characters
const jsonString = JSON.stringify(arrayData);
const base64Json = btoa(jsonString); // Convert to Base64

// Get form values and handle arrays properly
const formData = ui.MultiEditform10.value;

// Helper function to convert arrays to strings
const arrayToString = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(',') : '';
  }
  return value || '';
};

// Prepare all the form values
const preparedData = {
  base64Json: base64Json,
  pincode: formData.Pincode || '',
  dropOffTerminal: arrayToString(formData.DropOff_Terminal),
  dropOffTerminalTIR: formData.DropOff_Terminal_TIR || '',
  etaDeliveryAddress: formData.ETA_DeliveryAddress || '',
  deliveryAddress: arrayToString(formData.DeliveryAddress),
  ataTerminalInland: formData.ATA_Terminal_Inland || '',
  transportMode: arrayToString(formData.Transport_Mode_final_DeliveryAddress),
  directTruck: formData.Direct_Truck === true || formData.Direct_Truck === 'true' ? 1 : 0
};

return preparedData;