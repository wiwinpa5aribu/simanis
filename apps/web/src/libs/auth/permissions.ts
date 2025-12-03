/**
 * Definisi Role dan Permission untuk RBAC
 */

export type Role =
  | 'admin'
  | 'kepsek'
  | 'wakasek'
  | 'bendahara'
  | 'operator'
  | 'guru'

export type Permission =
  | 'view_dashboard'
  | 'manage_assets' // Create, Edit, Delete Assets
  | 'view_assets'
  | 'manage_loans' // Create, Return Loans
  | 'view_loans'
  | 'manage_inventory' // Scan, Upload Evidence
  | 'view_inventory'
  | 'manage_categories'
  | 'view_categories'
  | 'view_audit'
  | 'view_reports'
  | 'generate_kib'
  | 'view_depreciation'
  | 'approve_deletion'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'view_dashboard',
    'manage_assets',
    'view_assets',
    'manage_loans',
    'view_loans',
    'manage_inventory',
    'view_inventory',
    'manage_categories',
    'view_categories',
    'view_audit',
    'view_reports',
    'generate_kib',
    'view_depreciation',
    'approve_deletion',
  ],
  kepsek: [
    'view_dashboard',
    'view_assets',
    'view_loans',
    'view_inventory',
    'view_audit',
    'view_reports',
    'approve_deletion',
  ],
  wakasek: [
    'view_dashboard',
    'manage_assets',
    'view_assets',
    'view_loans',
    'manage_inventory',
    'view_inventory',
    'manage_categories',
    'view_categories',
    'view_reports',
  ],
  bendahara: [
    'view_dashboard',
    'view_assets',
    'view_reports',
    'generate_kib',
    'view_depreciation',
  ],
  operator: [
    'view_dashboard',
    'manage_assets',
    'view_assets',
    'manage_loans',
    'view_loans',
    'manage_inventory',
    'view_inventory',
    'view_categories',
  ],
  guru: [
    'view_dashboard',
    'view_assets',
    'view_loans', // Can only see own loans (handled by API/Page logic)
  ],
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  kepsek: 'Kepala Sekolah',
  wakasek: 'Wakasek Sarpras',
  bendahara: 'Bendahara BOS',
  operator: 'Operator',
  guru: 'Guru / Staff',
}
