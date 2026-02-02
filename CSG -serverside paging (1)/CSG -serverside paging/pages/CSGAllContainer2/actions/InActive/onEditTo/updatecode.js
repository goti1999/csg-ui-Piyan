let dbRow = {{steps.code.data}}; // Replace with your actual update query name

if (dbRow && dbRow.to_Customer !== undefined) {
  dbRow.to_Customer = dbRow.to_Customer === 1 ? true : false;
}

return dbRow;
