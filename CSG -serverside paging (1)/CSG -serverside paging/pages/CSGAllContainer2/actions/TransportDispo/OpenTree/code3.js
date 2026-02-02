{{ (() => {
  const data = actions.get_All_AND_Clone_History.data || [];

  const isDateField = (key, value) => 
    key.toLowerCase().includes('date') ||
    key.toLowerCase().includes('time') ||
    (typeof value === 'string' && /\d{4}-\d{2}-\d{2}t/i.test(value));

  const isBoolField = (val) => val === true || val === false || val === 0 || val === 1 || val === '0' || val === '1';

  return data.map((row, idx) => {
    const headerFields = [
      'Timestamp','Interface','direction','CustomerID','MBL_ID','ContainerID',
      'MBL_Number','Container_Number','Carrier','Vessel','ContainerSize','Status'
    ];
    const header = headerFields
      .filter(k => row[k] !== undefined)
      .map(k => ({
        data: { name: k, kind: 'field', value: String(row[k] ?? '') },
        icon: 'file_text'
      }));

    const termine = Object.entries(row)
      .filter(([k, v]) => isDateField(k, v))
      .map(([k, v]) => ({
        data: { name: k, kind: 'datetime', value: String(v ?? '') },
        icon: 'calendar'
      }));

    const status = Object.entries(row)
      .filter(([k, v]) => isBoolField(v))
      .map(([k, v]) => ({
        data: { name: k, kind: 'boolean', value: String(v) },
        icon: v ? 'check_circle' : 'x_circle'
      }));

    const detailsKeys = [
      'Transport_Mode_Terminal_Vorgabe_NTL','Transport_Mode_final_DeliveryAddress',
      'DeliveryAddress','DropOff_Terminal','Broker','PortOfDischarge_Lima',
      'PortOfLoading_Lima','Relation','User','Tabelle'
    ];
    const details = detailsKeys
      .filter(k => row[k] !== undefined)
      .map(k => ({
        data: { name: k, kind: 'text', value: String(row[k] ?? '') },
        icon: 'align_left'
      }));

    const allUsedKeys = new Set([
      ...headerFields,
      ...detailsKeys,
      ...termine.map(t => t.data.name),
      ...status.map(t => t.data.name)
    ]);
    const additional = Object.entries(row)
      .filter(([k]) => !allUsedKeys.has(k))
      .map(([k, v]) => ({
        data: { name: k, kind: 'text', value: String(v ?? '') },
        icon: 'info'
      }));

    return {
      data: {
        name: `${row.MBL_Number || 'MBL-' + row.MBL_ID || 'Record'} - ${row.Container_Number || row.ContainerID || 'Unknown'}`,
        kind: 'record'
      },
      children: [
        { data: { name: 'Header', kind: 'group' }, children: header, icon: 'folder_material' },
        { data: { name: 'Details', kind: 'group' }, children: details, icon: 'folder_material' },
        { data: { name: 'Termine', kind: 'group' }, children: termine, icon: 'calendar' },
        { data: { name: 'Status', kind: 'group' }, children: status, icon: 'check_circle' },
        { data: { name: 'Additional Info', kind: 'group' }, children: additional, icon: 'folder_material' }
      ],
      icon: 'folder_material'
    };
  });
})() }}
