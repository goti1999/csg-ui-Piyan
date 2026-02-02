// Get payload from previous step
let payloadArray = {{ steps.Jsoncode.data }};

// Parse if it's a string
if (typeof payloadArray === "string") {
  try {
    payloadArray = JSON.parse(payloadArray);
  } catch (parseError) {
    console.error("Failed to parse payload:", parseError);
    return { error: "Invalid JSON payload", details: parseError.message };
  }
}

// Validate payload
if (!Array.isArray(payloadArray) || payloadArray.length === 0) {
  console.warn("No valid payload array found");
  return { error: "No valid payload array found" };
}

console.log("Sending payload array to API:", payloadArray);

try {
  // Send the ENTIRE array in one request (as per API documentation)
  const response = await fetch("https://api-dev.csg-helm.com/api/v2/ui/send-to-customer", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payloadArray), // Send the entire array, not individual items
    mode: 'cors'
  });

  console.log("Response status:", response.status);
  console.log("Response headers:", Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    
    return {
      success: false,
      error: `HTTP ${response.status}: ${errorText}`,
      status: response.status,
      sentPayload: payloadArray
    };
  }

  // Parse successful response
  let responseData;
  const contentType = response.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  console.log("Success! API Response:", responseData);

  return {
    success: true,
    status: response.status,
    sentPayload: payloadArray,
    totalItems: payloadArray.length,
    apiResponse: responseData,
    message: `Successfully sent ${payloadArray.length} item(s) to RabbitMQ queue`
  };

} catch (error) {
  console.error("Request failed:", error);
  
  return {
    success: false,
    error: error.message,
    errorType: error.name,
    sentPayload: payloadArray,
    totalItems: payloadArray.length,
    timestamp: new Date().toISOString(),
    troubleshooting: {
      possibleCauses: [
        "Network connectivity issue",
        "CORS policy restriction", 
        "API server is down",
        "Invalid API endpoint"
      ],
      suggestions: [
        "Check if https://api-dev.csg-helm.com/api/docs is accessible",
        "Verify network connection",
        "Contact API administrator about CORS settings"
      ]
    }
  };
}