/**
 * Central data source layer. Use dummy data now; later connect DB with credentials.
 * Import from @/data and call getData('containers'), getData('operations'), etc.
 *
 * Where dummy data lives: containersData.js (containers + config), logistics.js (datasets).
 * To add your DB: set credentials (e.g. env), then in getData('database') call your API/DB.
 */

import { datasets } from './logistics.js';
import { containers } from './containersData.js';

/** Available data source keys. Add 'database' when connecting real DB. */
export const DATA_SOURCE_KEYS = [
  { key: 'containers', label: 'Containers', description: 'Container & shipment data' },
  { key: 'operations', label: 'Operations', description: 'Operations dataset' },
  { key: 'fleet', label: 'Fleet', description: 'Fleet management data' },
  { key: 'warehouses', label: 'Warehouses', description: 'Warehouse data' },
  { key: 'analytics', label: 'Analytics', description: 'Analytics dataset' },
  { key: 'reports', label: 'Reports', description: 'Reports dataset' },
  { key: 'dashboard', label: 'Dashboard', description: 'Dashboard sample data' },
  { key: 'database', label: 'Database', description: 'Connect your database (credentials required)' },
];

const DUMMY_SOURCES = {
  containers,
  operations: datasets.operations,
  fleet: datasets.fleet,
  warehouses: datasets.warehouses,
  analytics: datasets.analytics,
  reports: datasets.reports,
  dashboard: datasets.dashboard,
};

/**
 * @param {string} sourceKey - One of DATA_SOURCE_KEYS[].key
 * @param {object} options - { credentials?, query? } for future DB use
 * @returns {Promise<Array>} Rows for tables/lists
 */
export async function getData(sourceKey, options = {}) {
  if (sourceKey === 'database') {
    // Placeholder: later use options.credentials, options.query to call real DB
    console.warn('[dataSource] Database connection not configured. Using containers as fallback.');
    return [...containers];
  }

  const rows = DUMMY_SOURCES[sourceKey];
  if (!rows) {
    console.warn(`[dataSource] Unknown source "${sourceKey}". Using containers.`);
    return [...containers];
  }

  return Promise.resolve([...rows]);
}

export default { getData, DATA_SOURCE_KEYS };
