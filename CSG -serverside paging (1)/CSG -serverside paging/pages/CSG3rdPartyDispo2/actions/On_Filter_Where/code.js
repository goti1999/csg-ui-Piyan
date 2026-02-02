(function() {
  let filter = "";
  const filters = ui.ontable5.filters || {};

  for (const [field, value] of Object.entries(filters)) {
    if (value === "" || value == null) continue;

    // boolean (bit) values
    if (typeof value === "boolean") {
      filter += `AND ${field} = ${value ? 1 : 0} `;
      continue;
    }

    // numeric 0/1 passed as number or string => treat as bit/numeric
    if (value === 0 || value === 1 || value === "0" || value === "1") {
      filter += `AND ${field} = ${Number(value)} `;
      continue;
    }

    // date / datetime detection
    const parsed = Date.parse(value);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const sqlDate = `${yyyy}-${mm}-${dd}`; // yyyy-MM-dd
      filter += `AND FORMAT(${field}, 'yyyy-MM-dd') LIKE '%${sqlDate}%' `;
      continue;
    }

    // default: treat as string, escape single quotes
    const safe = String(value).replace(/'/g, "''");
    filter += `AND ${field} LIKE '%${safe}%' `;
  }

  // return trimmed string or empty string (not null/undefined)
  return filter.trim() || "";
})();
