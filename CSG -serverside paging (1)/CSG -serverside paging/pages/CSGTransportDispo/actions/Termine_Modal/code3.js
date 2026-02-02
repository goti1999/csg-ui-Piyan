(async () => {
  try {
    // 1️⃣ Get clicked row data
    const row = ui.ontable10.clickedRow?.data || {};
    if (!row.CustomerID || !row.MBL_ID || !row.ContainerID) {
      throw new Error("Missing required IDs from clicked row");
    }

    // 2️⃣ Run SQL query (query2) with row parameters
    await steps.query2.run({
      CustomerID: row.CustomerID,
      MBL_ID: row.MBL_ID,
      ContainerID: row.ContainerID
    });

    // 3️⃣ Wait a short moment to ensure data is loaded
    await new Promise((resolve) => setTimeout(resolve, 150));

    // 4️⃣ Open modal
    ui.modal16.open();

  } catch (err) {
    console.error("Error running query or opening modal:", err);
  }
})();
