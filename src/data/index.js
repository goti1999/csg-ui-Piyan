/**
 * Central data exports. Import from @/data everywhere.
 * - datasets: logistics dummy data (logistics.js)
 * - containers, containersConfig: container schema + config (containersData.js)
 * - getData, DATA_SOURCE_KEYS: data source layer (dummy now; add DB in dataSource.js)
 */

export { datasets, generateRecords } from './logistics.js';
export { containers, columns, headerFields, detailFields, filterFields, containersConfig } from './containersData.js';
export { getData, DATA_SOURCE_KEYS } from './dataSource.js';
