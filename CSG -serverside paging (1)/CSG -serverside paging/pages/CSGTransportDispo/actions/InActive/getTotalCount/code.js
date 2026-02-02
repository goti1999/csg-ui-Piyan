// Suppose your SQL action is named "getTotalCount"
const rows = {{steps.getTotalCount.data}}; // this is the array of objects the array of row objects
const totalRows = Array.isArray(rows) ? rows.length : 0;
return totalRows;
