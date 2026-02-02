

let test={}
let filter = "WHERE ";
for (const [field, value] of Object.entries(ui.ontable13.filters)) {
  if (typeof value === 'string') {
    if (value != "" && value != null) {
      test[field] = value;
      filter = filter + field + " LIKE '%" + value + "%' AND ";
    }
  }
}

return filter.replace(/\s+AND\s*$/, '');
