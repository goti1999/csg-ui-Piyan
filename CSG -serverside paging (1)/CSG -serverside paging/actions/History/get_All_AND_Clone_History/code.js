// Access your step result directly
return {{steps.load.data}}.filter(item =>
  item.Tabelle === "Transport_Clone" || item.Tabelle === "Transport_Dispo"|| item.Tabelle === "Transport_All"
);
