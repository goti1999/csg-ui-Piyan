// Access your step result directly
return {{steps.loadTA.data}}.filter(item =>
  item.Tabelle === "Transport_TA"
);