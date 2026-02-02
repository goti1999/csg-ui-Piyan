let filter = "";
let filterKeys = [];
for (const [field, value] of Object.entries(ui.ontable4.filters)) {
  if (typeof value === 'string') {
    if (value != "" && value != null) {
      filter = filter + "d." + field + " LIKE '%" + value + "%' AND ";
      filterKeys.push({ "field": field, "value": value, "operator": "=" });
    }
  } else if (typeof value === 'boolean') {
    if (value != null) {
      if (value === true) {
	      filter = filter + "d." + field + " = 1 AND "
        filterKeys.push({ "field": field, "value": 1, "operator": "=" });
      } else if (value === false) {
	      filter = filter + "d." + field + " = 0 AND "
        filterKeys.push({ "field": field, "value": 0, "operator": "=" });
      }
    }
  }
}
if (filter == "") {
  console.log("No filter for request");
} else {
  console.log(filterKeys);
  return filterKeys;
  // filter = "WHERE " + filter;
  // filter = " AND " + filter;
  // return filter.replace(/\s+AND\n\s*$/, '');
}