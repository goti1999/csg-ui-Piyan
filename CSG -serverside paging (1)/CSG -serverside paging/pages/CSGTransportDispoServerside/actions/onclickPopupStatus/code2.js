(() => {
  const row = ui.ontable7?.clickedRow?.data;
  if (!row) {
    console.warn("No clicked row found.");
    return;
  }

  // ✅ Pass the entire row to the popup
  ui.popupForm17.open(row);
})();
