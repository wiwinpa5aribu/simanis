import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','role','status','avatar','createdAt','updatedAt']);

export const LocationScalarFieldEnumSchema = z.enum(['id','name','type','parentId','assetCount','createdAt','updatedAt']);

export const AssetScalarFieldEnumSchema = z.enum(['id','name','category','status','location','purchaseDate','purchasePrice','condition','description','createdAt','updatedAt']);

export const MutationScalarFieldEnumSchema = z.enum(['id','assetId','assetName','fromLocation','toLocation','date','status','requester','notes','createdAt','updatedAt']);

export const StockOpnameSessionScalarFieldEnumSchema = z.enum(['id','date','location','status','foundCount','notFoundCount','totalAssets','createdAt','updatedAt']);

export const AuditLogScalarFieldEnumSchema = z.enum(['id','timestamp','user','action','module','details','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['id','name','email','avatar']);

export const NullsOrderSchema = z.enum(['first','last']);

export const LocationOrderByRelevanceFieldEnumSchema = z.enum(['id','name','parentId']);

export const AssetOrderByRelevanceFieldEnumSchema = z.enum(['id','name','category','location','purchaseDate','description']);

export const MutationOrderByRelevanceFieldEnumSchema = z.enum(['id','assetId','assetName','fromLocation','toLocation','date','requester','notes']);

export const StockOpnameSessionOrderByRelevanceFieldEnumSchema = z.enum(['id','date','location']);

export const AuditLogOrderByRelevanceFieldEnumSchema = z.enum(['id','timestamp','user','action','module','details']);

export const UserRoleSchema = z.enum(['admin','manager','staff','viewer']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const StatusSchema = z.enum(['aktif','tidak_aktif']);

export type StatusType = `${z.infer<typeof StatusSchema>}`

export const LocTypeSchema = z.enum(['gedung','lantai','ruangan']);

export type LocTypeType = `${z.infer<typeof LocTypeSchema>}`

export const AssetStatusSchema = z.enum(['aktif','tidak_aktif','maintenance','dihapuskan']);

export type AssetStatusType = `${z.infer<typeof AssetStatusSchema>}`

export const ConditionSchema = z.enum(['baik','cukup','kurang','rusak']);

export type ConditionType = `${z.infer<typeof ConditionSchema>}`

export const MutationStatusSchema = z.enum(['diproses','selesai','dibatalkan']);

export type MutationStatusType = `${z.infer<typeof MutationStatusSchema>}`

export const StockOpnameStatusSchema = z.enum(['sedang_berlangsung','selesai']);

export type StockOpnameStatusType = `${z.infer<typeof StockOpnameStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRoleSchema,
  status: StatusSchema,
  id: z.string().cuid(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// LOCATION SCHEMA
/////////////////////////////////////////

export const LocationSchema = z.object({
  type: LocTypeSchema,
  id: z.string().cuid(),
  name: z.string(),
  parentId: z.string().nullable(),
  assetCount: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Location = z.infer<typeof LocationSchema>

/////////////////////////////////////////
// ASSET SCHEMA
/////////////////////////////////////////

export const AssetSchema = z.object({
  status: AssetStatusSchema,
  condition: ConditionSchema,
  id: z.string().cuid(),
  name: z.string(),
  category: z.string(),
  location: z.string(),
  purchaseDate: z.string(),
  purchasePrice: z.number(),
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Asset = z.infer<typeof AssetSchema>

/////////////////////////////////////////
// MUTATION SCHEMA
/////////////////////////////////////////

export const MutationSchema = z.object({
  status: MutationStatusSchema,
  id: z.string().cuid(),
  assetId: z.string(),
  assetName: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  date: z.string(),
  requester: z.string(),
  notes: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Mutation = z.infer<typeof MutationSchema>

/////////////////////////////////////////
// STOCK OPNAME SESSION SCHEMA
/////////////////////////////////////////

export const StockOpnameSessionSchema = z.object({
  status: StockOpnameStatusSchema,
  id: z.string().cuid(),
  date: z.string(),
  location: z.string(),
  foundCount: z.number().int(),
  notFoundCount: z.number().int(),
  totalAssets: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type StockOpnameSession = z.infer<typeof StockOpnameSessionSchema>

/////////////////////////////////////////
// AUDIT LOG SCHEMA
/////////////////////////////////////////

export const AuditLogSchema = z.object({
  id: z.string().cuid(),
  timestamp: z.string(),
  user: z.string(),
  action: z.string(),
  module: z.string(),
  details: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type AuditLog = z.infer<typeof AuditLogSchema>
