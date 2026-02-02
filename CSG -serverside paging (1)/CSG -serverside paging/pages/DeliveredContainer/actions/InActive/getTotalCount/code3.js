let filter = "WHERE ";
const filters = ui.ontable13.filters || {};

for (const [field, value] of Object.entries(filters)) {
  if (value === "" || value == null) continue;

  // Handle BIT (true/false/0/1)
  if (typeof value === "boolean" || value === 0 || value === 1 || value === "0" || value === "1") {
    filter += `${field} = ${value} AND `;
  }
  // Handle Date / DateTime
  else if (!isNaN(Date.parse(value))) {
    // convert to SQL format yyyy-MM-dd
    const d = new Date(value);
    const sqlDate = d.toISOString().split("T")[0];
    filter += `FORMAT(${field}, 'yyyy-MM-dd') LIKE '%${sqlDate}%' AND `;
  }
  // Handle String (default)
  else if (typeof value === "string") {
    filter += `${field} LIKE '%${value}%' AND `;
  }
}

return filter.replace(/\s+AND\s*$/, "");
