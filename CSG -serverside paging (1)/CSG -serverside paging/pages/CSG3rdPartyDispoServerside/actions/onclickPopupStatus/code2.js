(() => {
  const row = ui.ontable8?.clickedRow?.data;
  if (!row) {
    console.warn("No clicked row found.");
    return;
  }

  // ✅ Pass the entire row to the popup
  ui.popupForm20.open(row);
})();
