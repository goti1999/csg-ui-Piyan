function getChangedFieldsWithTimestampAndUser(original, updated, userEmail) {
  const changes = {};

  Object.keys(updated).forEach(function (key) {
    if (String(original[key]) !== String(updated[key])) {
      changes[key] = updated[key];
    }
  });

  return changes;
}

// Prepare data
const originalData = ui.onTableloadTable2.selectedRow.data;
const updatedData = ui.form.value; 
const currentUser = user.email.split('@')[0]; // gets logged-in user

// Get changed fields only
const changedFields = getChangedFieldsWithTimestampAndUser(originalData, updatedData, currentUser);

const hasChanges = Object.keys(changedFields).length > 0;

// Build logtext JSON only if changes exist
let logtext = "";

if (hasChanges) {
  // Add timestamp and user inside the changes object for audit log
  changedFields.timestamp = new Date().toISOString();
  changedFields.user = currentUser;

  // Stringify the changes object
  logtext = JSON.stringify(changedFields);
}

return {
  logtext: logtext,              // either JSON string of changed fields or ""
  user: currentUser,
  timestamp: new Date().toISOString()
};
