(() => {
  const data = ui.ontable8?.data || [];

  if (!Array.isArray(data)) return { data: [] };

  data.forEach(item => {
    item.status = {
      pinState: item.pinState ?? "green",
      nationalTransportState: item.nationalTransportState ?? "green",
      finalDeliveryState: item.finalDeliveryState ?? "green",
      emptyReturnState: item.emptyReturnState ?? "green"
    };

    // Calculate status colors
    for (const [key, val] of Object.entries(item.status)) {
      if (/urgent|rejected/i.test(val)) item.status[key] = "red";
      else if (/delay|transit|caution/i.test(val)) item.status[key] = "yellow";
      else item.status[key] = "green";
    }

    // Overall color
    if (Object.values(item.status).includes("red"))
      item.statusOverAll = "red";
    else if (Object.values(item.status).includes("yellow"))
      item.statusOverAll = "yellow";
    else item.statusOverAll = "green";
  });

  return { data };
})();
