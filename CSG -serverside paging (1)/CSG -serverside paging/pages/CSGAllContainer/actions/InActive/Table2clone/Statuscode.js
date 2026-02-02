function addStatusToData(data) {
    data.forEach(item => {
      item.status = {
        pinState: item.pinState,
        nationalTransportState: item.nationalTransportState,
        finalDeliveryState: item.finalDeliveryState,
        emptyReturnState: item.emptyReturnState
    };

      // Create an simple state for pinState
        if (/(urgent)$/.test(item.pinState)) {
          item.status.pinState = "red";
        }
        else if (/(delay)$/.test(item.pinState)) {
          item.status.pinState = "yellow";
        }
        else {
          item.status.pinState = "green";
        }

        // Create an simple state for nationalTransportState
        if (/(urgent)$/.test(item.nationalTransportState) || /(rejected)$/.test(item.nationalTransportState)) {
          item.status.nationalTransportState = "red";
        }
        else if (/(delay)$/.test(item.nationalTransportState)) {
          item.status.nationalTransportState = "yellow";
        }
        else {
          item.status.nationalTransportState = "green";
        }

        // Create an simple state for finalDeliveryState
        if (/(urgent)$/.test(item.finalDeliveryState) || /(rejected)$/.test(item.finalDeliveryState)) {
          item.status.finalDeliveryState = "red";
        }
        else if (/(delay)$/.test(item.finalDeliveryState)) {
          item.status.finalDeliveryState = "yellow";
        }
        else {
          item.status.finalDeliveryState = "green";
        }

        // Create an simple state for emptyReturnState
        if (/(urgent)$/.test(item.emptyReturnState)) {
          item.status.emptyReturnState = "red";
        }
        else if (/(delay)$/.test(item.emptyReturnState) || /(transit)$/.test(item.emptyReturnState) || /(caution)$/.test(item.emptyReturnState)) {
          item.status.emptyReturnState = "yellow";
        }
        else {
          item.status.emptyReturnState = "green";
        }

        // Create an simple state for overAll
        if (item.status.pinState === "red" || item.status.nationalTransportState === "red" || item.status.finalDeliveryState === "red" || item.status.emptyReturnState === "red") {
          item.status.overAll = "red";
        }
        else if (item.status.pinState === "yellow" || item.status.nationalTransportState === "yellow" || item.status.finalDeliveryState === "yellow" || item.status.emptyReturnState === "yellow") {
          item.status.overAll = "yellow";
        }
        else {
          item.statusOverAll = "green";
        }
    })
}

// Call the function to update the data array
addStatusToData(data);

return {{data}};
