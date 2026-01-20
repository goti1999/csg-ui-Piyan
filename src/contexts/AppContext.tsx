import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { datasets } from '@/data/logistics';

type Language = 'en' | 'de';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  action: string;
  details: string;
  user: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
}

export interface User {
  id: string;
  username: string;
  password: string; // Hashed in real app, plain text for demo
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

// Edit Mode Types for Admin Builder
export interface TableColumnConfig {
  id: string;
  key: string;
  label: string;
  visible: boolean;
  width?: number;
  sortable: boolean;
  filterable: boolean;
  editable: boolean;
  actions?: ComponentAction[];
}

export interface ComponentAction {
  id: string;
  label: string;
  type: 'button' | 'link' | 'dropdown';
  actionType: 'navigate' | 'api' | 'modal' | 'custom';
  config: Record<string, unknown>;
}

export interface ComponentConfig {
  id: string;
  type: 'table' | 'card' | 'chart' | 'form' | 'custom';
  name: string;
  props: Record<string, unknown>;
  columns?: TableColumnConfig[];
  actions?: ComponentAction[];
  styles?: Record<string, string>;
}

interface AppSettings {
  language: Language;
  darkMode: boolean;
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

interface AppContextType {
  settings: AppSettings;
  setLanguage: (lang: Language) => void;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  toggleAutoRefresh: () => void;
  t: (key: string) => string;
  // Data management
  exportAllData: () => void;
  importData: (file: File) => Promise<void>;
  createBackup: () => void;
  syncDatabase: () => Promise<void>;
  clearCache: () => void;
  // System data
  systemLogs: SystemLog[];
  addSystemLog: (level: SystemLog['level'], action: string, details: string) => void;
  auditTrail: AuditEntry[];
  addAuditEntry: (action: string, resource: string, details: string) => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  validateUser: (username: string, password: string) => User | null;
  updateUserLastLogin: (userId: string) => void;
  isSyncing: boolean;
  // Edit Mode (Admin Builder)
  editMode: boolean;
  toggleEditMode: () => void;
  selectedComponentId: string | null;
  selectComponent: (id: string | null) => void;
  componentConfigs: Record<string, ComponentConfig>;
  updateComponentConfig: (id: string, config: Partial<ComponentConfig>) => void;
  updateColumnConfig: (componentId: string, columnId: string, config: Partial<TableColumnConfig>) => void;
  addColumnAction: (componentId: string, columnId: string, action: ComponentAction) => void;
  removeColumnAction: (componentId: string, columnId: string, actionId: string) => void;
}

const defaultSettings: AppSettings = {
  language: 'en',
  darkMode: false,
  notifications: true,
  autoRefresh: true,
  refreshInterval: 30000,
};

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    operations: 'Operations',
    fleet: 'Fleet',
    warehouses: 'Warehouses',
    analytics: 'Analytics',
    reports: 'Reports',
    
    // Header
    logisticsHQ: 'Logistics HQ',
    dailyDashboard: 'Daily Dashboard',
    smartSearch: 'Smart search across all pages...',
    
    // Actions
    export: 'Export',
    refresh: 'Refresh',
    signOut: 'Sign Out',
    new: 'New',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    submit: 'Submit',
    
    // Authentication
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    signIn: 'Sign In',
    welcomeBack: 'Welcome back',
    invalidCredentials: 'Invalid username or password',
    adminLogin: 'Admin Login',
    signInDescription: 'Sign in with your credentials to access the system',
    
    // Advanced Menu
    advancedMenu: 'Advanced Menu',
    systemConfiguration: 'System configuration and quick access',
    userEnvironment: 'User & Environment',
    loggedInAs: 'Logged in as',
    environment: 'Environment',
    visualBuilder: 'Visual Builder',
    enabled: 'Enabled',
    disabled: 'Disabled',
    
    // Quick Actions
    quickActions: 'Quick Actions',
    exportAllData: 'Export All Data',
    importData: 'Import Data',
    createBackup: 'Create Backup',
    syncDatabase: 'Sync Database',
    syncing: 'Syncing...',
    
    // System Settings
    systemSettings: 'System Settings',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    autoRefresh: 'Auto Refresh',
    language: 'Language',
    
    // Quick Access
    quickAccess: 'Quick Access',
    views: 'Views',
    documentation: 'Documentation',
    profile: 'Profile',
    settings: 'Settings',
    alerts: 'Alerts',
    
    // System Tools
    systemTools: 'System Tools',
    viewSystemLogs: 'View System Logs',
    clearCache: 'Clear Cache',
    manageUsers: 'Manage Users',
    securitySettings: 'Security Settings',
    auditTrail: 'Audit Trail',
    
    // Dashboard Cards
    customerNumber: 'Customer Number',
    containerNumber: 'Container Number',
    applyFilter: 'Apply Filter',
    activeLanes: 'Active lanes',
    onTime: 'On-time',
    delayed: 'Delayed',
    avgCompletion: 'Avg. completion',
    atRisk: 'At Risk',
    totalVolume: 'Total Volume',
    velocityRisk: 'Velocity & Risk',
    statusMix: 'Status mix',
    topLocations: 'Top Locations',
    recentActivity: 'Recent Activity',
    
    // Table
    status: 'Status',
    priority: 'Priority',
    name: 'Name',
    category: 'Category',
    eta: 'ETA',
    progress: 'Progress',
    amount: 'Amount',
    location: 'Location',
    updated: 'Updated',
    actions: 'Actions',
    
    // User Management
    userManagement: 'User Management',
    totalUsers: 'Total Users',
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
    admins: 'Admins',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    email: 'Email',
    role: 'Role',
    lastLogin: 'Last Login',
    created: 'Created',
    admin: 'Admin',
    user: 'User',
    viewer: 'Viewer',
    
    // Table
    searchTable: 'Search table...',
    allStatus: 'All status',
    noResults: 'No results — adjust filters or search.',
    showing: 'Showing',
    of: 'of',
    selected: 'selected',
    reload: 'Reload',
    editDetails: 'Edit Details',
    close: 'Close',
    
    // Messages
    languageChanged: 'Language changed to English',
    filtersApplied: 'Filters applied successfully',
    dataRefreshed: 'Data refreshed',
    exportStarted: 'Export started',
    dataSaved: 'Data saved successfully',
    errorOccurred: 'An error occurred',
    confirmDelete: 'Are you sure you want to delete?',
  },
  de: {
    // Navigation
    dashboard: 'Übersicht',
    operations: 'Betrieb',
    fleet: 'Flotte',
    warehouses: 'Lager',
    analytics: 'Analytik',
    reports: 'Berichte',
    
    // Header
    logisticsHQ: 'Logistik Zentrale',
    dailyDashboard: 'Tagesübersicht',
    smartSearch: 'Intelligente Suche auf allen Seiten...',
    
    // Actions
    export: 'Exportieren',
    refresh: 'Aktualisieren',
    signOut: 'Abmelden',
    new: 'Neu',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    search: 'Suchen',
    filter: 'Filtern',
    clear: 'Leeren',
    submit: 'Absenden',
    
    // Authentication
    login: 'Anmelden',
    logout: 'Abmelden',
    username: 'Benutzername',
    password: 'Passwort',
    enterUsername: 'Benutzername eingeben',
    enterPassword: 'Passwort eingeben',
    signIn: 'Anmelden',
    welcomeBack: 'Willkommen zurück',
    invalidCredentials: 'Ungültiger Benutzername oder Passwort',
    adminLogin: 'Administrator-Anmeldung',
    signInDescription: 'Melden Sie sich mit Ihren Zugangsdaten an',
    
    // Advanced Menu
    advancedMenu: 'Erweitertes Menü',
    systemConfiguration: 'Systemkonfiguration und Schnellzugriff',
    userEnvironment: 'Benutzer & Umgebung',
    loggedInAs: 'Angemeldet als',
    environment: 'Umgebung',
    visualBuilder: 'Visueller Editor',
    enabled: 'Aktiviert',
    disabled: 'Deaktiviert',
    
    // Quick Actions
    quickActions: 'Schnellaktionen',
    exportAllData: 'Alle Daten exportieren',
    importData: 'Daten importieren',
    createBackup: 'Sicherung erstellen',
    syncDatabase: 'Datenbank synchronisieren',
    syncing: 'Synchronisiere...',
    
    // System Settings
    systemSettings: 'Systemeinstellungen',
    darkMode: 'Dunkelmodus',
    notifications: 'Benachrichtigungen',
    autoRefresh: 'Auto-Aktualisierung',
    language: 'Sprache',
    
    // Quick Access
    quickAccess: 'Schnellzugriff',
    views: 'Ansichten',
    documentation: 'Dokumentation',
    profile: 'Profil',
    settings: 'Einstellungen',
    alerts: 'Warnungen',
    
    // System Tools
    systemTools: 'Systemwerkzeuge',
    viewSystemLogs: 'Systemprotokolle anzeigen',
    clearCache: 'Cache leeren',
    manageUsers: 'Benutzer verwalten',
    securitySettings: 'Sicherheitseinstellungen',
    auditTrail: 'Prüfprotokoll',
    
    // Dashboard Cards
    customerNumber: 'Kundennummer',
    containerNumber: 'Containernummer',
    applyFilter: 'Filter anwenden',
    activeLanes: 'Aktive Routen',
    onTime: 'Pünktlich',
    delayed: 'Verspätet',
    avgCompletion: 'Durchschn. Abschluss',
    atRisk: 'Gefährdet',
    totalVolume: 'Gesamtvolumen',
    velocityRisk: 'Geschwindigkeit & Risiko',
    statusMix: 'Status-Verteilung',
    topLocations: 'Top-Standorte',
    recentActivity: 'Letzte Aktivität',
    
    // Table
    status: 'Status',
    priority: 'Priorität',
    name: 'Name',
    category: 'Kategorie',
    eta: 'Ankunftszeit',
    progress: 'Fortschritt',
    amount: 'Betrag',
    location: 'Standort',
    updated: 'Aktualisiert',
    actions: 'Aktionen',
    searchTable: 'Tabelle durchsuchen...',
    allStatus: 'Alle Status',
    noResults: 'Keine Ergebnisse — Filter oder Suche anpassen.',
    showing: 'Anzeige',
    of: 'von',
    selected: 'ausgewählt',
    reload: 'Neu laden',
    editDetails: 'Details bearbeiten',
    close: 'Schließen',
    
    // User Management
    userManagement: 'Benutzerverwaltung',
    totalUsers: 'Gesamtbenutzer',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    suspended: 'Gesperrt',
    admins: 'Administratoren',
    addUser: 'Benutzer hinzufügen',
    editUser: 'Benutzer bearbeiten',
    deleteUser: 'Benutzer löschen',
    email: 'E-Mail',
    role: 'Rolle',
    lastLogin: 'Letzte Anmeldung',
    created: 'Erstellt',
    admin: 'Administrator',
    user: 'Benutzer',
    viewer: 'Betrachter',
    
    // Messages
    languageChanged: 'Sprache auf Deutsch geändert',
    filtersApplied: 'Filter erfolgreich angewendet',
    dataRefreshed: 'Daten aktualisiert',
    exportStarted: 'Export gestartet',
    dataSaved: 'Daten erfolgreich gespeichert',
    errorOccurred: 'Ein Fehler ist aufgetreten',
    confirmDelete: 'Möchten Sie wirklich löschen?',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'app_settings';
const LOGS_KEY = 'system_logs';
const AUDIT_KEY = 'audit_trail';
const USERS_KEY = 'app_users';

// Generate initial mock data
const generateInitialLogs = (): SystemLog[] => [
  { id: '1', timestamp: new Date(Date.now() - 300000).toISOString(), level: 'info', action: 'System Started', details: 'Application initialized successfully', user: 'System' },
  { id: '2', timestamp: new Date(Date.now() - 240000).toISOString(), level: 'success', action: 'Database Connected', details: 'PostgreSQL connection established', user: 'System' },
  { id: '3', timestamp: new Date(Date.now() - 180000).toISOString(), level: 'info', action: 'User Login', details: 'Admin user logged in', user: 'Admin' },
  { id: '4', timestamp: new Date(Date.now() - 120000).toISOString(), level: 'warning', action: 'High Memory Usage', details: 'Memory usage exceeded 80%', user: 'System' },
  { id: '5', timestamp: new Date(Date.now() - 60000).toISOString(), level: 'info', action: 'Cache Refreshed', details: 'Data cache refreshed successfully', user: 'System' },
];

const generateInitialAudit = (): AuditEntry[] => [
  { id: '1', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'Admin', action: 'LOGIN', resource: 'Authentication', details: 'Successful login', ipAddress: '192.168.1.100' },
  { id: '2', timestamp: new Date(Date.now() - 3000000).toISOString(), user: 'Admin', action: 'VIEW', resource: 'Dashboard', details: 'Viewed main dashboard', ipAddress: '192.168.1.100' },
  { id: '3', timestamp: new Date(Date.now() - 2400000).toISOString(), user: 'Admin', action: 'EXPORT', resource: 'Operations Data', details: 'Exported 36 records', ipAddress: '192.168.1.100' },
  { id: '4', timestamp: new Date(Date.now() - 1800000).toISOString(), user: 'Admin', action: 'UPDATE', resource: 'Settings', details: 'Changed language to German', ipAddress: '192.168.1.100' },
  { id: '5', timestamp: new Date(Date.now() - 1200000).toISOString(), user: 'Admin', action: 'VIEW', resource: 'Fleet Management', details: 'Accessed fleet data', ipAddress: '192.168.1.100' },
];

const generateInitialUsers = (): User[] => [
  { id: '1', username: 'Admin', password: 'Admin@1881', email: 'admin@csg-logistics.com', role: 'admin', status: 'active', lastLogin: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: '2', username: 'JohnDoe', password: 'John@123', email: 'john.doe@csg-logistics.com', role: 'user', status: 'active', lastLogin: new Date(Date.now() - 3600000).toISOString(), createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: '3', username: 'JaneSmith', password: 'Jane@123', email: 'jane.smith@csg-logistics.com', role: 'user', status: 'active', lastLogin: new Date(Date.now() - 7200000).toISOString(), createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: '4', username: 'Viewer01', password: 'View@123', email: 'viewer@csg-logistics.com', role: 'viewer', status: 'inactive', lastLogin: new Date(Date.now() - 86400000 * 5).toISOString(), createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => {
    const stored = localStorage.getItem(LOGS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return generateInitialLogs();
      }
    }
    return generateInitialLogs();
  });

  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(() => {
    const stored = localStorage.getItem(AUDIT_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return generateInitialAudit();
      }
    }
    return generateInitialAudit();
  });

  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return generateInitialUsers();
      }
    }
    return generateInitialUsers();
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Edit Mode State (Admin Builder)
  const [editMode, setEditMode] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [componentConfigs, setComponentConfigs] = useState<Record<string, ComponentConfig>>(() => {
    const stored = localStorage.getItem('component_configs');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {};
      }
    }
    return {};
  });

  // Persist component configs
  useEffect(() => {
    localStorage.setItem('component_configs', JSON.stringify(componentConfigs));
  }, [componentConfigs]);

  const toggleEditMode = useCallback(() => {
    setEditMode(prev => {
      const newMode = !prev;
      if (newMode) {
        addSystemLog('info', 'Edit Mode Enabled', 'Admin entered edit mode');
        toast.success('Edit Mode enabled - Click on components to edit');
      } else {
        addSystemLog('info', 'Edit Mode Disabled', 'Admin exited edit mode');
        toast.success('Edit Mode disabled');
        setSelectedComponentId(null);
      }
      return newMode;
    });
  }, []);

  const selectComponent = useCallback((id: string | null) => {
    setSelectedComponentId(id);
  }, []);

  const updateComponentConfig = useCallback((id: string, config: Partial<ComponentConfig>) => {
    setComponentConfigs(prev => ({
      ...prev,
      [id]: { ...prev[id], ...config } as ComponentConfig,
    }));
    addSystemLog('info', 'Component Updated', `Updated config for component: ${id}`);
    addAuditEntry('UPDATE', 'Component Config', `Updated component: ${id}`);
  }, []);

  const updateColumnConfig = useCallback((componentId: string, columnId: string, config: Partial<TableColumnConfig>) => {
    setComponentConfigs(prev => {
      const component = prev[componentId];
      if (!component || !component.columns) return prev;
      
      return {
        ...prev,
        [componentId]: {
          ...component,
          columns: component.columns.map(col =>
            col.id === columnId ? { ...col, ...config } : col
          ),
        },
      };
    });
    addSystemLog('info', 'Column Updated', `Updated column ${columnId} in component ${componentId}`);
  }, []);

  const addColumnAction = useCallback((componentId: string, columnId: string, action: ComponentAction) => {
    setComponentConfigs(prev => {
      const component = prev[componentId];
      if (!component || !component.columns) return prev;
      
      return {
        ...prev,
        [componentId]: {
          ...component,
          columns: component.columns.map(col =>
            col.id === columnId
              ? { ...col, actions: [...(col.actions || []), action] }
              : col
          ),
        },
      };
    });
    addSystemLog('info', 'Action Added', `Added action to column ${columnId}`);
  }, []);

  const removeColumnAction = useCallback((componentId: string, columnId: string, actionId: string) => {
    setComponentConfigs(prev => {
      const component = prev[componentId];
      if (!component || !component.columns) return prev;
      
      return {
        ...prev,
        [componentId]: {
          ...component,
          columns: component.columns.map(col =>
            col.id === columnId
              ? { ...col, actions: (col.actions || []).filter(a => a.id !== actionId) }
              : col
          ),
        },
      };
    });
    addSystemLog('info', 'Action Removed', `Removed action from column ${columnId}`);
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(systemLogs));
  }, [systemLogs]);

  useEffect(() => {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(auditTrail));
  }, [auditTrail]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const addSystemLog = useCallback((level: SystemLog['level'], action: string, details: string) => {
    const newLog: SystemLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      action,
      details,
      user: 'Admin',
    };
    setSystemLogs((prev) => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  }, []);

  const addAuditEntry = useCallback((action: string, resource: string, details: string) => {
    const newEntry: AuditEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      user: 'Admin',
      action,
      resource,
      details,
      ipAddress: '192.168.1.100',
    };
    setAuditTrail((prev) => [newEntry, ...prev].slice(0, 500)); // Keep last 500 entries
  }, []);

  const setLanguage = (lang: Language) => {
    setSettings((prev) => ({ ...prev, language: lang }));
    addSystemLog('info', 'Language Changed', `Language changed to ${lang === 'en' ? 'English' : 'German'}`);
    addAuditEntry('UPDATE', 'Settings', `Language changed to ${lang === 'en' ? 'English' : 'German'}`);
    toast.success(lang === 'en' ? translations.en.languageChanged : translations.de.languageChanged);
  };

  const toggleDarkMode = () => {
    const newValue = !settings.darkMode;
    setSettings((prev) => ({ ...prev, darkMode: newValue }));
    addSystemLog('info', 'Theme Changed', `Theme changed to ${newValue ? 'dark' : 'light'} mode`);
    toast.info(newValue ? 'Dark mode enabled' : 'Light mode enabled');
  };

  const toggleNotifications = () => {
    const newValue = !settings.notifications;
    setSettings((prev) => ({ ...prev, notifications: newValue }));
    addSystemLog('info', 'Notifications Toggle', `Notifications ${newValue ? 'enabled' : 'disabled'}`);
    toast.info(newValue ? 'Notifications enabled' : 'Notifications disabled');
  };

  const toggleAutoRefresh = () => {
    const newValue = !settings.autoRefresh;
    setSettings((prev) => ({ ...prev, autoRefresh: newValue }));
    addSystemLog('info', 'Auto-Refresh Toggle', `Auto-refresh ${newValue ? 'enabled' : 'disabled'}`);
    toast.info(newValue ? 'Auto-refresh enabled' : 'Auto-refresh disabled');
  };

  const t = (key: string): string => {
    return translations[settings.language][key as keyof typeof translations.en] || key;
  };

  // Data management functions
  const exportAllData = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      settings,
      datasets,
      systemLogs,
      auditTrail,
      users: users.map(u => ({ ...u, email: '***' })), // Mask sensitive data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `csg-logistics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addSystemLog('success', 'Data Export', 'All data exported successfully');
    addAuditEntry('EXPORT', 'All Data', 'Complete data export performed');
    toast.success('All data exported successfully!');
  }, [settings, systemLogs, auditTrail, users, addSystemLog, addAuditEntry]);

  const importData = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.settings) {
            setSettings({ ...defaultSettings, ...data.settings });
          }
          
          addSystemLog('success', 'Data Import', `Imported data from ${file.name}`);
          addAuditEntry('IMPORT', 'Data File', `Imported ${file.name}`);
          toast.success('Data imported successfully!');
          resolve();
        } catch (error) {
          addSystemLog('error', 'Import Failed', `Failed to import ${file.name}`);
          toast.error('Failed to import data. Invalid file format.');
          reject(error);
        }
      };
      reader.onerror = () => {
        addSystemLog('error', 'Import Failed', 'File read error');
        toast.error('Failed to read file');
        reject(new Error('File read error'));
      };
      reader.readAsText(file);
    });
  }, [addSystemLog, addAuditEntry]);

  const createBackup = useCallback(() => {
    const backupData = {
      backupDate: new Date().toISOString(),
      type: 'full_backup',
      settings,
      datasets,
      systemLogs,
      auditTrail,
      users,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `csg-logistics-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addSystemLog('success', 'Backup Created', 'Full system backup created');
    addAuditEntry('BACKUP', 'System', 'Full backup created and downloaded');
    toast.success('Backup created successfully!');
  }, [settings, systemLogs, auditTrail, users, addSystemLog, addAuditEntry]);

  const syncDatabase = useCallback(async (): Promise<void> => {
    setIsSyncing(true);
    addSystemLog('info', 'Sync Started', 'Database synchronization initiated');
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addSystemLog('success', 'Sync Complete', 'Database synchronized successfully');
    addAuditEntry('SYNC', 'Database', 'Database synchronization completed');
    setIsSyncing(false);
    toast.success('Database synchronized successfully!');
  }, [addSystemLog, addAuditEntry]);

  const clearCache = useCallback(() => {
    // Clear specific cache items but preserve essential data
    const keysToPreserve = [STORAGE_KEY, LOGS_KEY, AUDIT_KEY, USERS_KEY];
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToPreserve.includes(key)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear session storage
    sessionStorage.clear();
    
    addSystemLog('success', 'Cache Cleared', `Cleared ${keysToRemove.length} cached items`);
    addAuditEntry('CLEAR', 'Cache', 'Application cache cleared');
    toast.success('Cache cleared successfully!');
  }, [addSystemLog, addAuditEntry]);

  // User management functions
  const addUser = useCallback((user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    addSystemLog('success', 'User Created', `New user ${user.username} created`);
    addAuditEntry('CREATE', 'User', `Created user: ${user.username}`);
    toast.success(`User ${user.username} created successfully!`);
  }, [addSystemLog, addAuditEntry]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    addSystemLog('info', 'User Updated', `User ID ${id} updated`);
    addAuditEntry('UPDATE', 'User', `Updated user ID: ${id}`);
    toast.success('User updated successfully!');
  }, [addSystemLog, addAuditEntry]);

  const deleteUser = useCallback((id: string) => {
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    addSystemLog('warning', 'User Deleted', `User ${user?.username} deleted`);
    addAuditEntry('DELETE', 'User', `Deleted user: ${user?.username}`);
    toast.success('User deleted successfully!');
  }, [users, addSystemLog, addAuditEntry]);

  const validateUser = useCallback((username: string, password: string): User | null => {
    // Get fresh users from localStorage to avoid stale state
    const storedUsers = localStorage.getItem(USERS_KEY);
    const currentUsers = storedUsers ? JSON.parse(storedUsers) : users;
    
    const user = currentUsers.find((u: User) => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password &&
      u.status === 'active'
    );
    
    if (user) {
      console.log('User validated successfully:', user.username);
    } else {
      console.log('Validation failed for:', username);
      console.log('Available users:', currentUsers.map((u: User) => ({ username: u.username, status: u.status })));
    }
    
    return user || null;
  }, [users]);

  const updateUserLastLogin = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, lastLogin: new Date().toISOString() } : u
    ));
  }, []);

  return (
    <AppContext.Provider
      value={{
        settings,
        setLanguage,
        toggleDarkMode,
        toggleNotifications,
        toggleAutoRefresh,
        t,
        exportAllData,
        importData,
        createBackup,
        syncDatabase,
        clearCache,
        systemLogs,
        addSystemLog,
        auditTrail,
        addAuditEntry,
        users,
        addUser,
        updateUser,
        deleteUser,
        validateUser,
        updateUserLastLogin,
        isSyncing,
        // Edit Mode
        editMode,
        toggleEditMode,
        selectedComponentId,
        selectComponent,
        componentConfigs,
        updateComponentConfig,
        updateColumnConfig,
        addColumnAction,
        removeColumnAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
