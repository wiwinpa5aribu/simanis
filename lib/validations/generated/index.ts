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

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  role: z.boolean().optional(),
  status: z.boolean().optional(),
  avatar: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()

// LOCATION
//------------------------------------------------------

export const LocationIncludeSchema: z.ZodType<Prisma.LocationInclude> = z.object({
  parent: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  children: z.union([z.boolean(),z.lazy(() => LocationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LocationCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const LocationArgsSchema: z.ZodType<Prisma.LocationDefaultArgs> = z.object({
  select: z.lazy(() => LocationSelectSchema).optional(),
  include: z.lazy(() => LocationIncludeSchema).optional(),
}).strict();

export const LocationCountOutputTypeArgsSchema: z.ZodType<Prisma.LocationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => LocationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const LocationCountOutputTypeSelectSchema: z.ZodType<Prisma.LocationCountOutputTypeSelect> = z.object({
  children: z.boolean().optional(),
}).strict();

export const LocationSelectSchema: z.ZodType<Prisma.LocationSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  parentId: z.boolean().optional(),
  assetCount: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  parent: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  children: z.union([z.boolean(),z.lazy(() => LocationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LocationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ASSET
//------------------------------------------------------

export const AssetSelectSchema: z.ZodType<Prisma.AssetSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  category: z.boolean().optional(),
  status: z.boolean().optional(),
  location: z.boolean().optional(),
  purchaseDate: z.boolean().optional(),
  purchasePrice: z.boolean().optional(),
  condition: z.boolean().optional(),
  description: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()

// MUTATION
//------------------------------------------------------

export const MutationSelectSchema: z.ZodType<Prisma.MutationSelect> = z.object({
  id: z.boolean().optional(),
  assetId: z.boolean().optional(),
  assetName: z.boolean().optional(),
  fromLocation: z.boolean().optional(),
  toLocation: z.boolean().optional(),
  date: z.boolean().optional(),
  status: z.boolean().optional(),
  requester: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()

// STOCK OPNAME SESSION
//------------------------------------------------------

export const StockOpnameSessionSelectSchema: z.ZodType<Prisma.StockOpnameSessionSelect> = z.object({
  id: z.boolean().optional(),
  date: z.boolean().optional(),
  location: z.boolean().optional(),
  status: z.boolean().optional(),
  foundCount: z.boolean().optional(),
  notFoundCount: z.boolean().optional(),
  totalAssets: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()

// AUDIT LOG
//------------------------------------------------------

export const AuditLogSelectSchema: z.ZodType<Prisma.AuditLogSelect> = z.object({
  id: z.boolean().optional(),
  timestamp: z.boolean().optional(),
  user: z.boolean().optional(),
  action: z.boolean().optional(),
  module: z.boolean().optional(),
  details: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema), z.lazy(() => UserRoleSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema), z.lazy(() => StatusSchema) ]).optional(),
  avatar: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _relevance: z.lazy(() => UserOrderByRelevanceInputSchema).optional(),
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.cuid(),
    email: z.string(),
  }),
  z.object({
    id: z.cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema), z.lazy(() => UserRoleSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema), z.lazy(() => StatusSchema) ]).optional(),
  avatar: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleWithAggregatesFilterSchema), z.lazy(() => UserRoleSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusWithAggregatesFilterSchema), z.lazy(() => StatusSchema) ]).optional(),
  avatar: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const LocationWhereInputSchema: z.ZodType<Prisma.LocationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LocationWhereInputSchema), z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema), z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumLocTypeFilterSchema), z.lazy(() => LocTypeSchema) ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  assetCount: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  parent: z.union([ z.lazy(() => LocationNullableScalarRelationFilterSchema), z.lazy(() => LocationWhereInputSchema) ]).optional().nullable(),
  children: z.lazy(() => LocationListRelationFilterSchema).optional(),
}).strict();

export const LocationOrderByWithRelationInputSchema: z.ZodType<Prisma.LocationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  assetCount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  parent: z.lazy(() => LocationOrderByWithRelationInputSchema).optional(),
  children: z.lazy(() => LocationOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => LocationOrderByRelevanceInputSchema).optional(),
}).strict();

export const LocationWhereUniqueInputSchema: z.ZodType<Prisma.LocationWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.object({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => LocationWhereInputSchema), z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema), z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumLocTypeFilterSchema), z.lazy(() => LocTypeSchema) ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  assetCount: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  parent: z.union([ z.lazy(() => LocationNullableScalarRelationFilterSchema), z.lazy(() => LocationWhereInputSchema) ]).optional().nullable(),
  children: z.lazy(() => LocationListRelationFilterSchema).optional(),
}).strict());

export const LocationOrderByWithAggregationInputSchema: z.ZodType<Prisma.LocationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  assetCount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LocationCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LocationAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LocationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LocationMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LocationSumOrderByAggregateInputSchema).optional(),
}).strict();

export const LocationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LocationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LocationScalarWhereWithAggregatesInputSchema), z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationScalarWhereWithAggregatesInputSchema), z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumLocTypeWithAggregatesFilterSchema), z.lazy(() => LocTypeSchema) ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  assetCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const AssetWhereInputSchema: z.ZodType<Prisma.AssetWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AssetWhereInputSchema), z.lazy(() => AssetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssetWhereInputSchema), z.lazy(() => AssetWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  category: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumAssetStatusFilterSchema), z.lazy(() => AssetStatusSchema) ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  purchaseDate: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  purchasePrice: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  condition: z.union([ z.lazy(() => EnumConditionFilterSchema), z.lazy(() => ConditionSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const AssetOrderByWithRelationInputSchema: z.ZodType<Prisma.AssetOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  purchaseDate: z.lazy(() => SortOrderSchema).optional(),
  purchasePrice: z.lazy(() => SortOrderSchema).optional(),
  condition: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _relevance: z.lazy(() => AssetOrderByRelevanceInputSchema).optional(),
}).strict();

export const AssetWhereUniqueInputSchema: z.ZodType<Prisma.AssetWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.object({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => AssetWhereInputSchema), z.lazy(() => AssetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssetWhereInputSchema), z.lazy(() => AssetWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  category: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumAssetStatusFilterSchema), z.lazy(() => AssetStatusSchema) ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  purchaseDate: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  purchasePrice: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  condition: z.union([ z.lazy(() => EnumConditionFilterSchema), z.lazy(() => ConditionSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict());

export const AssetOrderByWithAggregationInputSchema: z.ZodType<Prisma.AssetOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  purchaseDate: z.lazy(() => SortOrderSchema).optional(),
  purchasePrice: z.lazy(() => SortOrderSchema).optional(),
  condition: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AssetCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AssetAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AssetMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AssetMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AssetSumOrderByAggregateInputSchema).optional(),
}).strict();

export const AssetScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AssetScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AssetScalarWhereWithAggregatesInputSchema), z.lazy(() => AssetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssetScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssetScalarWhereWithAggregatesInputSchema), z.lazy(() => AssetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  category: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumAssetStatusWithAggregatesFilterSchema), z.lazy(() => AssetStatusSchema) ]).optional(),
  location: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  purchaseDate: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  purchasePrice: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  condition: z.union([ z.lazy(() => EnumConditionWithAggregatesFilterSchema), z.lazy(() => ConditionSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const MutationWhereInputSchema: z.ZodType<Prisma.MutationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MutationWhereInputSchema), z.lazy(() => MutationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MutationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MutationWhereInputSchema), z.lazy(() => MutationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  assetId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  assetName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fromLocation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  toLocation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  date: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumMutationStatusFilterSchema), z.lazy(() => MutationStatusSchema) ]).optional(),
  requester: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const MutationOrderByWithRelationInputSchema: z.ZodType<Prisma.MutationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  assetId: z.lazy(() => SortOrderSchema).optional(),
  assetName: z.lazy(() => SortOrderSchema).optional(),
  fromLocation: z.lazy(() => SortOrderSchema).optional(),
  toLocation: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requester: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _relevance: z.lazy(() => MutationOrderByRelevanceInputSchema).optional(),
}).strict();

export const MutationWhereUniqueInputSchema: z.ZodType<Prisma.MutationWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.object({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => MutationWhereInputSchema), z.lazy(() => MutationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MutationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MutationWhereInputSchema), z.lazy(() => MutationWhereInputSchema).array() ]).optional(),
  assetId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  assetName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fromLocation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  toLocation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  date: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumMutationStatusFilterSchema), z.lazy(() => MutationStatusSchema) ]).optional(),
  requester: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict());

export const MutationOrderByWithAggregationInputSchema: z.ZodType<Prisma.MutationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  assetId: z.lazy(() => SortOrderSchema).optional(),
  assetName: z.lazy(() => SortOrderSchema).optional(),
  fromLocation: z.lazy(() => SortOrderSchema).optional(),
  toLocation: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requester: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MutationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MutationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MutationMinOrderByAggregateInputSchema).optional(),
}).strict();

export const MutationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MutationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MutationScalarWhereWithAggregatesInputSchema), z.lazy(() => MutationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MutationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MutationScalarWhereWithAggregatesInputSchema), z.lazy(() => MutationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  assetId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  assetName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  fromLocation: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  toLocation: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  date: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumMutationStatusWithAggregatesFilterSchema), z.lazy(() => MutationStatusSchema) ]).optional(),
  requester: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const StockOpnameSessionWhereInputSchema: z.ZodType<Prisma.StockOpnameSessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => StockOpnameSessionWhereInputSchema), z.lazy(() => StockOpnameSessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StockOpnameSessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StockOpnameSessionWhereInputSchema), z.lazy(() => StockOpnameSessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  date: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStockOpnameStatusFilterSchema), z.lazy(() => StockOpnameStatusSchema) ]).optional(),
  foundCount: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  notFoundCount: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  totalAssets: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const StockOpnameSessionOrderByWithRelationInputSchema: z.ZodType<Prisma.StockOpnameSessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  foundCount: z.lazy(() => SortOrderSchema).optional(),
  notFoundCount: z.lazy(() => SortOrderSchema).optional(),
  totalAssets: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _relevance: z.lazy(() => StockOpnameSessionOrderByRelevanceInputSchema).optional(),
}).strict();

export const StockOpnameSessionWhereUniqueInputSchema: z.ZodType<Prisma.StockOpnameSessionWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.object({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => StockOpnameSessionWhereInputSchema), z.lazy(() => StockOpnameSessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StockOpnameSessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StockOpnameSessionWhereInputSchema), z.lazy(() => StockOpnameSessionWhereInputSchema).array() ]).optional(),
  date: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStockOpnameStatusFilterSchema), z.lazy(() => StockOpnameStatusSchema) ]).optional(),
  foundCount: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  notFoundCount: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  totalAssets: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict());

export const StockOpnameSessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.StockOpnameSessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  foundCount: z.lazy(() => SortOrderSchema).optional(),
  notFoundCount: z.lazy(() => SortOrderSchema).optional(),
  totalAssets: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => StockOpnameSessionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => StockOpnameSessionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => StockOpnameSessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => StockOpnameSessionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => StockOpnameSessionSumOrderByAggregateInputSchema).optional(),
}).strict();

export const StockOpnameSessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.StockOpnameSessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => StockOpnameSessionScalarWhereWithAggregatesInputSchema), z.lazy(() => StockOpnameSessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => StockOpnameSessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StockOpnameSessionScalarWhereWithAggregatesInputSchema), z.lazy(() => StockOpnameSessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  date: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStockOpnameStatusWithAggregatesFilterSchema), z.lazy(() => StockOpnameStatusSchema) ]).optional(),
  foundCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  notFoundCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  totalAssets: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const AuditLogWhereInputSchema: z.ZodType<Prisma.AuditLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AuditLogWhereInputSchema), z.lazy(() => AuditLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuditLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuditLogWhereInputSchema), z.lazy(() => AuditLogWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  user: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  action: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  module: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const AuditLogOrderByWithRelationInputSchema: z.ZodType<Prisma.AuditLogOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  module: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _relevance: z.lazy(() => AuditLogOrderByRelevanceInputSchema).optional(),
}).strict();

export const AuditLogWhereUniqueInputSchema: z.ZodType<Prisma.AuditLogWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.object({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => AuditLogWhereInputSchema), z.lazy(() => AuditLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuditLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuditLogWhereInputSchema), z.lazy(() => AuditLogWhereInputSchema).array() ]).optional(),
  timestamp: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  user: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  action: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  module: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict());

export const AuditLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.AuditLogOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  module: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AuditLogCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AuditLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AuditLogMinOrderByAggregateInputSchema).optional(),
}).strict();

export const AuditLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AuditLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AuditLogScalarWhereWithAggregatesInputSchema), z.lazy(() => AuditLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuditLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuditLogScalarWhereWithAggregatesInputSchema), z.lazy(() => AuditLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  user: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  action: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  module: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => StatusSchema).optional(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => StatusSchema).optional(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  email: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  status: z.lazy(() => StatusSchema).optional(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema), z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationCreateInputSchema: z.ZodType<Prisma.LocationCreateInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  type: z.lazy(() => LocTypeSchema),
  assetCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  parent: z.lazy(() => LocationCreateNestedOneWithoutChildrenInputSchema).optional(),
  children: z.lazy(() => LocationCreateNestedManyWithoutParentInputSchema).optional(),
}).strict();

export const LocationUncheckedCreateInputSchema: z.ZodType<Prisma.LocationUncheckedCreateInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  type: z.lazy(() => LocTypeSchema),
  parentId: z.string().optional().nullable(),
  assetCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  children: z.lazy(() => LocationUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
}).strict();

export const LocationUpdateInputSchema: z.ZodType<Prisma.LocationUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => EnumLocTypeFieldUpdateOperationsInputSchema) ]).optional(),
  assetCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  parent: z.lazy(() => LocationUpdateOneWithoutChildrenNestedInputSchema).optional(),
  children: z.lazy(() => LocationUpdateManyWithoutParentNestedInputSchema).optional(),
}).strict();

export const LocationUncheckedUpdateInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => EnumLocTypeFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assetCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  children: z.lazy(() => LocationUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
}).strict();

export const LocationCreateManyInputSchema: z.ZodType<Prisma.LocationCreateManyInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  type: z.lazy(() => LocTypeSchema),
  parentId: z.string().optional().nullable(),
  assetCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const LocationUpdateManyMutationInputSchema: z.ZodType<Prisma.LocationUpdateManyMutationInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => EnumLocTypeFieldUpdateOperationsInputSchema) ]).optional(),
  assetCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => EnumLocTypeFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assetCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssetCreateInputSchema: z.ZodType<Prisma.AssetCreateInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  category: z.string(),
  status: z.lazy(() => AssetStatusSchema).optional(),
  location: z.string(),
  purchaseDate: z.string(),
  purchasePrice: z.number(),
  condition: z.lazy(() => ConditionSchema).optional(),
  description: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const AssetUncheckedCreateInputSchema: z.ZodType<Prisma.AssetUncheckedCreateInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  category: z.string(),
  status: z.lazy(() => AssetStatusSchema).optional(),
  location: z.string(),
  purchaseDate: z.string(),
  purchasePrice: z.number(),
  condition: z.lazy(() => ConditionSchema).optional(),
  description: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const AssetUpdateInputSchema: z.ZodType<Prisma.AssetUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => AssetStatusSchema), z.lazy(() => EnumAssetStatusFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseDate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchasePrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.lazy(() => ConditionSchema), z.lazy(() => EnumConditionFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssetUncheckedUpdateInputSchema: z.ZodType<Prisma.AssetUncheckedUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => AssetStatusSchema), z.lazy(() => EnumAssetStatusFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseDate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchasePrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.lazy(() => ConditionSchema), z.lazy(() => EnumConditionFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssetCreateManyInputSchema: z.ZodType<Prisma.AssetCreateManyInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  category: z.string(),
  status: z.lazy(() => AssetStatusSchema).optional(),
  location: z.string(),
  purchaseDate: z.string(),
  purchasePrice: z.number(),
  condition: z.lazy(() => ConditionSchema).optional(),
  description: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const AssetUpdateManyMutationInputSchema: z.ZodType<Prisma.AssetUpdateManyMutationInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => AssetStatusSchema), z.lazy(() => EnumAssetStatusFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseDate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchasePrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.lazy(() => ConditionSchema), z.lazy(() => EnumConditionFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssetUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AssetUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => AssetStatusSchema), z.lazy(() => EnumAssetStatusFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseDate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchasePrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  condition: z.union([ z.lazy(() => ConditionSchema), z.lazy(() => EnumConditionFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MutationCreateInputSchema: z.ZodType<Prisma.MutationCreateInput> = z.object({
  id: z.cuid().optional(),
  assetId: z.string(),
  assetName: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  date: z.string(),
  status: z.lazy(() => MutationStatusSchema).optional(),
  requester: z.string(),
  notes: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const MutationUncheckedCreateInputSchema: z.ZodType<Prisma.MutationUncheckedCreateInput> = z.object({
  id: z.cuid().optional(),
  assetId: z.string(),
  assetName: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  date: z.string(),
  status: z.lazy(() => MutationStatusSchema).optional(),
  requester: z.string(),
  notes: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const MutationUpdateInputSchema: z.ZodType<Prisma.MutationUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MutationStatusSchema), z.lazy(() => EnumMutationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requester: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MutationUncheckedUpdateInputSchema: z.ZodType<Prisma.MutationUncheckedUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MutationStatusSchema), z.lazy(() => EnumMutationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requester: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MutationCreateManyInputSchema: z.ZodType<Prisma.MutationCreateManyInput> = z.object({
  id: z.cuid().optional(),
  assetId: z.string(),
  assetName: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  date: z.string(),
  status: z.lazy(() => MutationStatusSchema).optional(),
  requester: z.string(),
  notes: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const MutationUpdateManyMutationInputSchema: z.ZodType<Prisma.MutationUpdateManyMutationInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MutationStatusSchema), z.lazy(() => EnumMutationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requester: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MutationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MutationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => MutationStatusSchema), z.lazy(() => EnumMutationStatusFieldUpdateOperationsInputSchema) ]).optional(),
  requester: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StockOpnameSessionCreateInputSchema: z.ZodType<Prisma.StockOpnameSessionCreateInput> = z.object({
  id: z.cuid().optional(),
  date: z.string(),
  location: z.string(),
  status: z.lazy(() => StockOpnameStatusSchema).optional(),
  foundCount: z.number().int().optional(),
  notFoundCount: z.number().int().optional(),
  totalAssets: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const StockOpnameSessionUncheckedCreateInputSchema: z.ZodType<Prisma.StockOpnameSessionUncheckedCreateInput> = z.object({
  id: z.cuid().optional(),
  date: z.string(),
  location: z.string(),
  status: z.lazy(() => StockOpnameStatusSchema).optional(),
  foundCount: z.number().int().optional(),
  notFoundCount: z.number().int().optional(),
  totalAssets: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const StockOpnameSessionUpdateInputSchema: z.ZodType<Prisma.StockOpnameSessionUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StockOpnameStatusSchema), z.lazy(() => EnumStockOpnameStatusFieldUpdateOperationsInputSchema) ]).optional(),
  foundCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  notFoundCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalAssets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StockOpnameSessionUncheckedUpdateInputSchema: z.ZodType<Prisma.StockOpnameSessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StockOpnameStatusSchema), z.lazy(() => EnumStockOpnameStatusFieldUpdateOperationsInputSchema) ]).optional(),
  foundCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  notFoundCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalAssets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StockOpnameSessionCreateManyInputSchema: z.ZodType<Prisma.StockOpnameSessionCreateManyInput> = z.object({
  id: z.cuid().optional(),
  date: z.string(),
  location: z.string(),
  status: z.lazy(() => StockOpnameStatusSchema).optional(),
  foundCount: z.number().int().optional(),
  notFoundCount: z.number().int().optional(),
  totalAssets: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const StockOpnameSessionUpdateManyMutationInputSchema: z.ZodType<Prisma.StockOpnameSessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StockOpnameStatusSchema), z.lazy(() => EnumStockOpnameStatusFieldUpdateOperationsInputSchema) ]).optional(),
  foundCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  notFoundCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalAssets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StockOpnameSessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.StockOpnameSessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StockOpnameStatusSchema), z.lazy(() => EnumStockOpnameStatusFieldUpdateOperationsInputSchema) ]).optional(),
  foundCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  notFoundCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalAssets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AuditLogCreateInputSchema: z.ZodType<Prisma.AuditLogCreateInput> = z.object({
  id: z.cuid().optional(),
  timestamp: z.string(),
  user: z.string(),
  action: z.string(),
  module: z.string(),
  details: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const AuditLogUncheckedCreateInputSchema: z.ZodType<Prisma.AuditLogUncheckedCreateInput> = z.object({
  id: z.cuid().optional(),
  timestamp: z.string(),
  user: z.string(),
  action: z.string(),
  module: z.string(),
  details: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const AuditLogUpdateInputSchema: z.ZodType<Prisma.AuditLogUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  module: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AuditLogUncheckedUpdateInputSchema: z.ZodType<Prisma.AuditLogUncheckedUpdateInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  module: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AuditLogCreateManyInputSchema: z.ZodType<Prisma.AuditLogCreateManyInput> = z.object({
  id: z.cuid().optional(),
  timestamp: z.string(),
  user: z.string(),
  action: z.string(),
  module: z.string(),
  details: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const AuditLogUpdateManyMutationInputSchema: z.ZodType<Prisma.AuditLogUpdateManyMutationInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  module: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AuditLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AuditLogUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  module: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const EnumUserRoleFilterSchema: z.ZodType<Prisma.EnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const EnumStatusFilterSchema: z.ZodType<Prisma.EnumStatusFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema), z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const UserOrderByRelevanceInputSchema: z.ZodType<Prisma.UserOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => UserOrderByRelevanceFieldEnumSchema), z.lazy(() => UserOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
}).strict();

export const EnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
}).strict();

export const EnumStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema), z.lazy(() => NestedEnumStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
}).strict();

export const EnumLocTypeFilterSchema: z.ZodType<Prisma.EnumLocTypeFilter> = z.object({
  equals: z.lazy(() => LocTypeSchema).optional(),
  in: z.lazy(() => LocTypeSchema).array().optional(),
  notIn: z.lazy(() => LocTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => NestedEnumLocTypeFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const LocationNullableScalarRelationFilterSchema: z.ZodType<Prisma.LocationNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => LocationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => LocationWhereInputSchema).optional().nullable(),
}).strict();

export const LocationListRelationFilterSchema: z.ZodType<Prisma.LocationListRelationFilter> = z.object({
  every: z.lazy(() => LocationWhereInputSchema).optional(),
  some: z.lazy(() => LocationWhereInputSchema).optional(),
  none: z.lazy(() => LocationWhereInputSchema).optional(),
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
}).strict();

export const LocationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LocationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const LocationOrderByRelevanceInputSchema: z.ZodType<Prisma.LocationOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => LocationOrderByRelevanceFieldEnumSchema), z.lazy(() => LocationOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
}).strict();

export const LocationCountOrderByAggregateInputSchema: z.ZodType<Prisma.LocationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  assetCount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const LocationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LocationAvgOrderByAggregateInput> = z.object({
  assetCount: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const LocationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LocationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  assetCount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const LocationMinOrderByAggregateInputSchema: z.ZodType<Prisma.LocationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  assetCount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const LocationSumOrderByAggregateInputSchema: z.ZodType<Prisma.LocationSumOrderByAggregateInput> = z.object({
  assetCount: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumLocTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumLocTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => LocTypeSchema).optional(),
  in: z.lazy(() => LocTypeSchema).array().optional(),
  notIn: z.lazy(() => LocTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => NestedEnumLocTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumLocTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumLocTypeFilterSchema).optional(),
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
}).strict();

export const EnumAssetStatusFilterSchema: z.ZodType<Prisma.EnumAssetStatusFilter> = z.object({
  equals: z.lazy(() => AssetStatusSchema).optional(),
  in: z.lazy(() => AssetStatusSchema).array().optional(),
  notIn: z.lazy(() => AssetStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => AssetStatusSchema), z.lazy(() => NestedEnumAssetStatusFilterSchema) ]).optional(),
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const EnumConditionFilterSchema: z.ZodType<Prisma.EnumConditionFilter> = z.object({
  equals: z.lazy(() => ConditionSchema).optional(),
  in: z.lazy(() => ConditionSchema).array().optional(),
  notIn: z.lazy(() => ConditionSchema).array().optional(),
  not: z.union([ z.lazy(() => ConditionSchema), z.lazy(() => NestedEnumConditionFilterSchema) ]).optional(),
}).strict();

export const AssetOrderByRelevanceInputSchema: z.ZodType<Prisma.AssetOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => AssetOrderByRelevanceFieldEnumSchema), z.lazy(() => AssetOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
}).strict();

export const AssetCountOrderByAggregateInputSchema: z.ZodType<Prisma.AssetCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  purchaseDate: z.lazy(() => SortOrderSchema).optional(),
  purchasePrice: z.lazy(() => SortOrderSchema).optional(),
  condition: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AssetAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AssetAvgOrderByAggregateInput> = z.object({
  purchasePrice: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AssetMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AssetMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  purchaseDate: z.lazy(() => SortOrderSchema).optional(),
  purchasePrice: z.lazy(() => SortOrderSchema).optional(),
  condition: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AssetMinOrderByAggregateInputSchema: z.ZodType<Prisma.AssetMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  purchaseDate: z.lazy(() => SortOrderSchema).optional(),
  purchasePrice: z.lazy(() => SortOrderSchema).optional(),
  condition: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AssetSumOrderByAggregateInputSchema: z.ZodType<Prisma.AssetSumOrderByAggregateInput> = z.object({
  purchasePrice: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumAssetStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumAssetStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AssetStatusSchema).optional(),
  in: z.lazy(() => AssetStatusSchema).array().optional(),
  notIn: z.lazy(() => AssetStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => AssetStatusSchema), z.lazy(() => NestedEnumAssetStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAssetStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAssetStatusFilterSchema).optional(),
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
}).strict();

export const EnumConditionWithAggregatesFilterSchema: z.ZodType<Prisma.EnumConditionWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ConditionSchema).optional(),
  in: z.lazy(() => ConditionSchema).array().optional(),
  notIn: z.lazy(() => ConditionSchema).array().optional(),
  not: z.union([ z.lazy(() => ConditionSchema), z.lazy(() => NestedEnumConditionWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumConditionFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumConditionFilterSchema).optional(),
}).strict();

export const EnumMutationStatusFilterSchema: z.ZodType<Prisma.EnumMutationStatusFilter> = z.object({
  equals: z.lazy(() => MutationStatusSchema).optional(),
  in: z.lazy(() => MutationStatusSchema).array().optional(),
  notIn: z.lazy(() => MutationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MutationStatusSchema), z.lazy(() => NestedEnumMutationStatusFilterSchema) ]).optional(),
}).strict();

export const MutationOrderByRelevanceInputSchema: z.ZodType<Prisma.MutationOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => MutationOrderByRelevanceFieldEnumSchema), z.lazy(() => MutationOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
}).strict();

export const MutationCountOrderByAggregateInputSchema: z.ZodType<Prisma.MutationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  assetId: z.lazy(() => SortOrderSchema).optional(),
  assetName: z.lazy(() => SortOrderSchema).optional(),
  fromLocation: z.lazy(() => SortOrderSchema).optional(),
  toLocation: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requester: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const MutationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MutationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  assetId: z.lazy(() => SortOrderSchema).optional(),
  assetName: z.lazy(() => SortOrderSchema).optional(),
  fromLocation: z.lazy(() => SortOrderSchema).optional(),
  toLocation: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requester: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const MutationMinOrderByAggregateInputSchema: z.ZodType<Prisma.MutationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  assetId: z.lazy(() => SortOrderSchema).optional(),
  assetName: z.lazy(() => SortOrderSchema).optional(),
  fromLocation: z.lazy(() => SortOrderSchema).optional(),
  toLocation: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  requester: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumMutationStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumMutationStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MutationStatusSchema).optional(),
  in: z.lazy(() => MutationStatusSchema).array().optional(),
  notIn: z.lazy(() => MutationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MutationStatusSchema), z.lazy(() => NestedEnumMutationStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMutationStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMutationStatusFilterSchema).optional(),
}).strict();

export const EnumStockOpnameStatusFilterSchema: z.ZodType<Prisma.EnumStockOpnameStatusFilter> = z.object({
  equals: z.lazy(() => StockOpnameStatusSchema).optional(),
  in: z.lazy(() => StockOpnameStatusSchema).array().optional(),
  notIn: z.lazy(() => StockOpnameStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StockOpnameStatusSchema), z.lazy(() => NestedEnumStockOpnameStatusFilterSchema) ]).optional(),
}).strict();

export const StockOpnameSessionOrderByRelevanceInputSchema: z.ZodType<Prisma.StockOpnameSessionOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => StockOpnameSessionOrderByRelevanceFieldEnumSchema), z.lazy(() => StockOpnameSessionOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
}).strict();

export const StockOpnameSessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.StockOpnameSessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  foundCount: z.lazy(() => SortOrderSchema).optional(),
  notFoundCount: z.lazy(() => SortOrderSchema).optional(),
  totalAssets: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const StockOpnameSessionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.StockOpnameSessionAvgOrderByAggregateInput> = z.object({
  foundCount: z.lazy(() => SortOrderSchema).optional(),
  notFoundCount: z.lazy(() => SortOrderSchema).optional(),
  totalAssets: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const StockOpnameSessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.StockOpnameSessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  foundCount: z.lazy(() => SortOrderSchema).optional(),
  notFoundCount: z.lazy(() => SortOrderSchema).optional(),
  totalAssets: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const StockOpnameSessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.StockOpnameSessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  foundCount: z.lazy(() => SortOrderSchema).optional(),
  notFoundCount: z.lazy(() => SortOrderSchema).optional(),
  totalAssets: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const StockOpnameSessionSumOrderByAggregateInputSchema: z.ZodType<Prisma.StockOpnameSessionSumOrderByAggregateInput> = z.object({
  foundCount: z.lazy(() => SortOrderSchema).optional(),
  notFoundCount: z.lazy(() => SortOrderSchema).optional(),
  totalAssets: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumStockOpnameStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumStockOpnameStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StockOpnameStatusSchema).optional(),
  in: z.lazy(() => StockOpnameStatusSchema).array().optional(),
  notIn: z.lazy(() => StockOpnameStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StockOpnameStatusSchema), z.lazy(() => NestedEnumStockOpnameStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStockOpnameStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStockOpnameStatusFilterSchema).optional(),
}).strict();

export const AuditLogOrderByRelevanceInputSchema: z.ZodType<Prisma.AuditLogOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => AuditLogOrderByRelevanceFieldEnumSchema), z.lazy(() => AuditLogOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string(),
}).strict();

export const AuditLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.AuditLogCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  module: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AuditLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AuditLogMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  module: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const AuditLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.AuditLogMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  module: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional(),
}).strict();

export const EnumUserRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => UserRoleSchema).optional(),
}).strict();

export const EnumStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => StatusSchema).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional(),
}).strict();

export const LocationCreateNestedOneWithoutChildrenInputSchema: z.ZodType<Prisma.LocationCreateNestedOneWithoutChildrenInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutChildrenInputSchema), z.lazy(() => LocationUncheckedCreateWithoutChildrenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LocationCreateOrConnectWithoutChildrenInputSchema).optional(),
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional(),
}).strict();

export const LocationCreateNestedManyWithoutParentInputSchema: z.ZodType<Prisma.LocationCreateNestedManyWithoutParentInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutParentInputSchema), z.lazy(() => LocationCreateWithoutParentInputSchema).array(), z.lazy(() => LocationUncheckedCreateWithoutParentInputSchema), z.lazy(() => LocationUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationCreateOrConnectWithoutParentInputSchema), z.lazy(() => LocationCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationCreateManyParentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LocationWhereUniqueInputSchema), z.lazy(() => LocationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LocationUncheckedCreateNestedManyWithoutParentInputSchema: z.ZodType<Prisma.LocationUncheckedCreateNestedManyWithoutParentInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutParentInputSchema), z.lazy(() => LocationCreateWithoutParentInputSchema).array(), z.lazy(() => LocationUncheckedCreateWithoutParentInputSchema), z.lazy(() => LocationUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationCreateOrConnectWithoutParentInputSchema), z.lazy(() => LocationCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationCreateManyParentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LocationWhereUniqueInputSchema), z.lazy(() => LocationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumLocTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumLocTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => LocTypeSchema).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
}).strict();

export const LocationUpdateOneWithoutChildrenNestedInputSchema: z.ZodType<Prisma.LocationUpdateOneWithoutChildrenNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutChildrenInputSchema), z.lazy(() => LocationUncheckedCreateWithoutChildrenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LocationCreateOrConnectWithoutChildrenInputSchema).optional(),
  upsert: z.lazy(() => LocationUpsertWithoutChildrenInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LocationUpdateToOneWithWhereWithoutChildrenInputSchema), z.lazy(() => LocationUpdateWithoutChildrenInputSchema), z.lazy(() => LocationUncheckedUpdateWithoutChildrenInputSchema) ]).optional(),
}).strict();

export const LocationUpdateManyWithoutParentNestedInputSchema: z.ZodType<Prisma.LocationUpdateManyWithoutParentNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutParentInputSchema), z.lazy(() => LocationCreateWithoutParentInputSchema).array(), z.lazy(() => LocationUncheckedCreateWithoutParentInputSchema), z.lazy(() => LocationUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationCreateOrConnectWithoutParentInputSchema), z.lazy(() => LocationCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LocationUpsertWithWhereUniqueWithoutParentInputSchema), z.lazy(() => LocationUpsertWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationCreateManyParentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LocationWhereUniqueInputSchema), z.lazy(() => LocationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LocationWhereUniqueInputSchema), z.lazy(() => LocationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LocationWhereUniqueInputSchema), z.lazy(() => LocationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LocationWhereUniqueInputSchema), z.lazy(() => LocationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LocationUpdateWithWhereUniqueWithoutParentInputSchema), z.lazy(() => LocationUpdateWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LocationUpdateManyWithWhereWithoutParentInputSchema), z.lazy(() => LocationUpdateManyWithWhereWithoutParentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LocationScalarWhereInputSchema), z.lazy(() => LocationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable(),
}).strict();

export const LocationUncheckedUpdateManyWithoutParentNestedInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateManyWithoutParentNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutParentInputSchema), z.lazy(() => LocationCreateWithoutParentInputSchema).array(), z.lazy(() => LocationUncheckedCreateWithoutParentInputSchema), z.lazy(() => LocationUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LocationCreateOrConnectWithoutParentInputSchema), z.lazy(() => LocationCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LocationUpsertWithWhereUniqueWithoutParentInputSchema), z.lazy(() => LocationUpsertWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LocationCreateManyParentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LocationWhereUniqueInputSchema), z.lazy(() => LocationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LocationWhereUniqueInputSchema), z.lazy(() => LocationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LocationWhereUniqueInputSchema), z.lazy(() => LocationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LocationWhereUniqueInputSchema), z.lazy(() => LocationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LocationUpdateWithWhereUniqueWithoutParentInputSchema), z.lazy(() => LocationUpdateWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LocationUpdateManyWithWhereWithoutParentInputSchema), z.lazy(() => LocationUpdateManyWithWhereWithoutParentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LocationScalarWhereInputSchema), z.lazy(() => LocationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EnumAssetStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumAssetStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => AssetStatusSchema).optional(),
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
}).strict();

export const EnumConditionFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumConditionFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ConditionSchema).optional(),
}).strict();

export const EnumMutationStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumMutationStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => MutationStatusSchema).optional(),
}).strict();

export const EnumStockOpnameStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumStockOpnameStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => StockOpnameStatusSchema).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedEnumUserRoleFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const NestedEnumStatusFilterSchema: z.ZodType<Prisma.NestedEnumStatusFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema), z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedEnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
}).strict();

export const NestedEnumStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema), z.lazy(() => NestedEnumStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
}).strict();

export const NestedEnumLocTypeFilterSchema: z.ZodType<Prisma.NestedEnumLocTypeFilter> = z.object({
  equals: z.lazy(() => LocTypeSchema).optional(),
  in: z.lazy(() => LocTypeSchema).array().optional(),
  notIn: z.lazy(() => LocTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => NestedEnumLocTypeFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumLocTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumLocTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => LocTypeSchema).optional(),
  in: z.lazy(() => LocTypeSchema).array().optional(),
  notIn: z.lazy(() => LocTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => NestedEnumLocTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumLocTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumLocTypeFilterSchema).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumAssetStatusFilterSchema: z.ZodType<Prisma.NestedEnumAssetStatusFilter> = z.object({
  equals: z.lazy(() => AssetStatusSchema).optional(),
  in: z.lazy(() => AssetStatusSchema).array().optional(),
  notIn: z.lazy(() => AssetStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => AssetStatusSchema), z.lazy(() => NestedEnumAssetStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumConditionFilterSchema: z.ZodType<Prisma.NestedEnumConditionFilter> = z.object({
  equals: z.lazy(() => ConditionSchema).optional(),
  in: z.lazy(() => ConditionSchema).array().optional(),
  notIn: z.lazy(() => ConditionSchema).array().optional(),
  not: z.union([ z.lazy(() => ConditionSchema), z.lazy(() => NestedEnumConditionFilterSchema) ]).optional(),
}).strict();

export const NestedEnumAssetStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumAssetStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AssetStatusSchema).optional(),
  in: z.lazy(() => AssetStatusSchema).array().optional(),
  notIn: z.lazy(() => AssetStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => AssetStatusSchema), z.lazy(() => NestedEnumAssetStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAssetStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAssetStatusFilterSchema).optional(),
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
}).strict();

export const NestedEnumConditionWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumConditionWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ConditionSchema).optional(),
  in: z.lazy(() => ConditionSchema).array().optional(),
  notIn: z.lazy(() => ConditionSchema).array().optional(),
  not: z.union([ z.lazy(() => ConditionSchema), z.lazy(() => NestedEnumConditionWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumConditionFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumConditionFilterSchema).optional(),
}).strict();

export const NestedEnumMutationStatusFilterSchema: z.ZodType<Prisma.NestedEnumMutationStatusFilter> = z.object({
  equals: z.lazy(() => MutationStatusSchema).optional(),
  in: z.lazy(() => MutationStatusSchema).array().optional(),
  notIn: z.lazy(() => MutationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MutationStatusSchema), z.lazy(() => NestedEnumMutationStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumMutationStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumMutationStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MutationStatusSchema).optional(),
  in: z.lazy(() => MutationStatusSchema).array().optional(),
  notIn: z.lazy(() => MutationStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MutationStatusSchema), z.lazy(() => NestedEnumMutationStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMutationStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMutationStatusFilterSchema).optional(),
}).strict();

export const NestedEnumStockOpnameStatusFilterSchema: z.ZodType<Prisma.NestedEnumStockOpnameStatusFilter> = z.object({
  equals: z.lazy(() => StockOpnameStatusSchema).optional(),
  in: z.lazy(() => StockOpnameStatusSchema).array().optional(),
  notIn: z.lazy(() => StockOpnameStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StockOpnameStatusSchema), z.lazy(() => NestedEnumStockOpnameStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumStockOpnameStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumStockOpnameStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StockOpnameStatusSchema).optional(),
  in: z.lazy(() => StockOpnameStatusSchema).array().optional(),
  notIn: z.lazy(() => StockOpnameStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StockOpnameStatusSchema), z.lazy(() => NestedEnumStockOpnameStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStockOpnameStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStockOpnameStatusFilterSchema).optional(),
}).strict();

export const LocationCreateWithoutChildrenInputSchema: z.ZodType<Prisma.LocationCreateWithoutChildrenInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  type: z.lazy(() => LocTypeSchema),
  assetCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  parent: z.lazy(() => LocationCreateNestedOneWithoutChildrenInputSchema).optional(),
}).strict();

export const LocationUncheckedCreateWithoutChildrenInputSchema: z.ZodType<Prisma.LocationUncheckedCreateWithoutChildrenInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  type: z.lazy(() => LocTypeSchema),
  parentId: z.string().optional().nullable(),
  assetCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const LocationCreateOrConnectWithoutChildrenInputSchema: z.ZodType<Prisma.LocationCreateOrConnectWithoutChildrenInput> = z.object({
  where: z.lazy(() => LocationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LocationCreateWithoutChildrenInputSchema), z.lazy(() => LocationUncheckedCreateWithoutChildrenInputSchema) ]),
}).strict();

export const LocationCreateWithoutParentInputSchema: z.ZodType<Prisma.LocationCreateWithoutParentInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  type: z.lazy(() => LocTypeSchema),
  assetCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  children: z.lazy(() => LocationCreateNestedManyWithoutParentInputSchema).optional(),
}).strict();

export const LocationUncheckedCreateWithoutParentInputSchema: z.ZodType<Prisma.LocationUncheckedCreateWithoutParentInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  type: z.lazy(() => LocTypeSchema),
  assetCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  children: z.lazy(() => LocationUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
}).strict();

export const LocationCreateOrConnectWithoutParentInputSchema: z.ZodType<Prisma.LocationCreateOrConnectWithoutParentInput> = z.object({
  where: z.lazy(() => LocationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LocationCreateWithoutParentInputSchema), z.lazy(() => LocationUncheckedCreateWithoutParentInputSchema) ]),
}).strict();

export const LocationCreateManyParentInputEnvelopeSchema: z.ZodType<Prisma.LocationCreateManyParentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LocationCreateManyParentInputSchema), z.lazy(() => LocationCreateManyParentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const LocationUpsertWithoutChildrenInputSchema: z.ZodType<Prisma.LocationUpsertWithoutChildrenInput> = z.object({
  update: z.union([ z.lazy(() => LocationUpdateWithoutChildrenInputSchema), z.lazy(() => LocationUncheckedUpdateWithoutChildrenInputSchema) ]),
  create: z.union([ z.lazy(() => LocationCreateWithoutChildrenInputSchema), z.lazy(() => LocationUncheckedCreateWithoutChildrenInputSchema) ]),
  where: z.lazy(() => LocationWhereInputSchema).optional(),
}).strict();

export const LocationUpdateToOneWithWhereWithoutChildrenInputSchema: z.ZodType<Prisma.LocationUpdateToOneWithWhereWithoutChildrenInput> = z.object({
  where: z.lazy(() => LocationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LocationUpdateWithoutChildrenInputSchema), z.lazy(() => LocationUncheckedUpdateWithoutChildrenInputSchema) ]),
}).strict();

export const LocationUpdateWithoutChildrenInputSchema: z.ZodType<Prisma.LocationUpdateWithoutChildrenInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => EnumLocTypeFieldUpdateOperationsInputSchema) ]).optional(),
  assetCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  parent: z.lazy(() => LocationUpdateOneWithoutChildrenNestedInputSchema).optional(),
}).strict();

export const LocationUncheckedUpdateWithoutChildrenInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateWithoutChildrenInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => EnumLocTypeFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assetCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationUpsertWithWhereUniqueWithoutParentInputSchema: z.ZodType<Prisma.LocationUpsertWithWhereUniqueWithoutParentInput> = z.object({
  where: z.lazy(() => LocationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LocationUpdateWithoutParentInputSchema), z.lazy(() => LocationUncheckedUpdateWithoutParentInputSchema) ]),
  create: z.union([ z.lazy(() => LocationCreateWithoutParentInputSchema), z.lazy(() => LocationUncheckedCreateWithoutParentInputSchema) ]),
}).strict();

export const LocationUpdateWithWhereUniqueWithoutParentInputSchema: z.ZodType<Prisma.LocationUpdateWithWhereUniqueWithoutParentInput> = z.object({
  where: z.lazy(() => LocationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LocationUpdateWithoutParentInputSchema), z.lazy(() => LocationUncheckedUpdateWithoutParentInputSchema) ]),
}).strict();

export const LocationUpdateManyWithWhereWithoutParentInputSchema: z.ZodType<Prisma.LocationUpdateManyWithWhereWithoutParentInput> = z.object({
  where: z.lazy(() => LocationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LocationUpdateManyMutationInputSchema), z.lazy(() => LocationUncheckedUpdateManyWithoutParentInputSchema) ]),
}).strict();

export const LocationScalarWhereInputSchema: z.ZodType<Prisma.LocationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LocationScalarWhereInputSchema), z.lazy(() => LocationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationScalarWhereInputSchema), z.lazy(() => LocationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumLocTypeFilterSchema), z.lazy(() => LocTypeSchema) ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  assetCount: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const LocationCreateManyParentInputSchema: z.ZodType<Prisma.LocationCreateManyParentInput> = z.object({
  id: z.cuid().optional(),
  name: z.string(),
  type: z.lazy(() => LocTypeSchema),
  assetCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const LocationUpdateWithoutParentInputSchema: z.ZodType<Prisma.LocationUpdateWithoutParentInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => EnumLocTypeFieldUpdateOperationsInputSchema) ]).optional(),
  assetCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  children: z.lazy(() => LocationUpdateManyWithoutParentNestedInputSchema).optional(),
}).strict();

export const LocationUncheckedUpdateWithoutParentInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateWithoutParentInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => EnumLocTypeFieldUpdateOperationsInputSchema) ]).optional(),
  assetCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  children: z.lazy(() => LocationUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
}).strict();

export const LocationUncheckedUpdateManyWithoutParentInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateManyWithoutParentInput> = z.object({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => LocTypeSchema), z.lazy(() => EnumLocTypeFieldUpdateOperationsInputSchema) ]).optional(),
  assetCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const LocationFindFirstArgsSchema: z.ZodType<Prisma.LocationFindFirstArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereInputSchema.optional(), 
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(), LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema, LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LocationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LocationFindFirstOrThrowArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereInputSchema.optional(), 
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(), LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema, LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LocationFindManyArgsSchema: z.ZodType<Prisma.LocationFindManyArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereInputSchema.optional(), 
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(), LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema, LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LocationAggregateArgsSchema: z.ZodType<Prisma.LocationAggregateArgs> = z.object({
  where: LocationWhereInputSchema.optional(), 
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(), LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const LocationGroupByArgsSchema: z.ZodType<Prisma.LocationGroupByArgs> = z.object({
  where: LocationWhereInputSchema.optional(), 
  orderBy: z.union([ LocationOrderByWithAggregationInputSchema.array(), LocationOrderByWithAggregationInputSchema ]).optional(),
  by: LocationScalarFieldEnumSchema.array(), 
  having: LocationScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const LocationFindUniqueArgsSchema: z.ZodType<Prisma.LocationFindUniqueArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema, 
}).strict();

export const LocationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LocationFindUniqueOrThrowArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema, 
}).strict();

export const AssetFindFirstArgsSchema: z.ZodType<Prisma.AssetFindFirstArgs> = z.object({
  select: AssetSelectSchema.optional(),
  where: AssetWhereInputSchema.optional(), 
  orderBy: z.union([ AssetOrderByWithRelationInputSchema.array(), AssetOrderByWithRelationInputSchema ]).optional(),
  cursor: AssetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssetScalarFieldEnumSchema, AssetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AssetFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AssetFindFirstOrThrowArgs> = z.object({
  select: AssetSelectSchema.optional(),
  where: AssetWhereInputSchema.optional(), 
  orderBy: z.union([ AssetOrderByWithRelationInputSchema.array(), AssetOrderByWithRelationInputSchema ]).optional(),
  cursor: AssetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssetScalarFieldEnumSchema, AssetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AssetFindManyArgsSchema: z.ZodType<Prisma.AssetFindManyArgs> = z.object({
  select: AssetSelectSchema.optional(),
  where: AssetWhereInputSchema.optional(), 
  orderBy: z.union([ AssetOrderByWithRelationInputSchema.array(), AssetOrderByWithRelationInputSchema ]).optional(),
  cursor: AssetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssetScalarFieldEnumSchema, AssetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AssetAggregateArgsSchema: z.ZodType<Prisma.AssetAggregateArgs> = z.object({
  where: AssetWhereInputSchema.optional(), 
  orderBy: z.union([ AssetOrderByWithRelationInputSchema.array(), AssetOrderByWithRelationInputSchema ]).optional(),
  cursor: AssetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AssetGroupByArgsSchema: z.ZodType<Prisma.AssetGroupByArgs> = z.object({
  where: AssetWhereInputSchema.optional(), 
  orderBy: z.union([ AssetOrderByWithAggregationInputSchema.array(), AssetOrderByWithAggregationInputSchema ]).optional(),
  by: AssetScalarFieldEnumSchema.array(), 
  having: AssetScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AssetFindUniqueArgsSchema: z.ZodType<Prisma.AssetFindUniqueArgs> = z.object({
  select: AssetSelectSchema.optional(),
  where: AssetWhereUniqueInputSchema, 
}).strict();

export const AssetFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AssetFindUniqueOrThrowArgs> = z.object({
  select: AssetSelectSchema.optional(),
  where: AssetWhereUniqueInputSchema, 
}).strict();

export const MutationFindFirstArgsSchema: z.ZodType<Prisma.MutationFindFirstArgs> = z.object({
  select: MutationSelectSchema.optional(),
  where: MutationWhereInputSchema.optional(), 
  orderBy: z.union([ MutationOrderByWithRelationInputSchema.array(), MutationOrderByWithRelationInputSchema ]).optional(),
  cursor: MutationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MutationScalarFieldEnumSchema, MutationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MutationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MutationFindFirstOrThrowArgs> = z.object({
  select: MutationSelectSchema.optional(),
  where: MutationWhereInputSchema.optional(), 
  orderBy: z.union([ MutationOrderByWithRelationInputSchema.array(), MutationOrderByWithRelationInputSchema ]).optional(),
  cursor: MutationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MutationScalarFieldEnumSchema, MutationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MutationFindManyArgsSchema: z.ZodType<Prisma.MutationFindManyArgs> = z.object({
  select: MutationSelectSchema.optional(),
  where: MutationWhereInputSchema.optional(), 
  orderBy: z.union([ MutationOrderByWithRelationInputSchema.array(), MutationOrderByWithRelationInputSchema ]).optional(),
  cursor: MutationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MutationScalarFieldEnumSchema, MutationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MutationAggregateArgsSchema: z.ZodType<Prisma.MutationAggregateArgs> = z.object({
  where: MutationWhereInputSchema.optional(), 
  orderBy: z.union([ MutationOrderByWithRelationInputSchema.array(), MutationOrderByWithRelationInputSchema ]).optional(),
  cursor: MutationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MutationGroupByArgsSchema: z.ZodType<Prisma.MutationGroupByArgs> = z.object({
  where: MutationWhereInputSchema.optional(), 
  orderBy: z.union([ MutationOrderByWithAggregationInputSchema.array(), MutationOrderByWithAggregationInputSchema ]).optional(),
  by: MutationScalarFieldEnumSchema.array(), 
  having: MutationScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MutationFindUniqueArgsSchema: z.ZodType<Prisma.MutationFindUniqueArgs> = z.object({
  select: MutationSelectSchema.optional(),
  where: MutationWhereUniqueInputSchema, 
}).strict();

export const MutationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MutationFindUniqueOrThrowArgs> = z.object({
  select: MutationSelectSchema.optional(),
  where: MutationWhereUniqueInputSchema, 
}).strict();

export const StockOpnameSessionFindFirstArgsSchema: z.ZodType<Prisma.StockOpnameSessionFindFirstArgs> = z.object({
  select: StockOpnameSessionSelectSchema.optional(),
  where: StockOpnameSessionWhereInputSchema.optional(), 
  orderBy: z.union([ StockOpnameSessionOrderByWithRelationInputSchema.array(), StockOpnameSessionOrderByWithRelationInputSchema ]).optional(),
  cursor: StockOpnameSessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StockOpnameSessionScalarFieldEnumSchema, StockOpnameSessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const StockOpnameSessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.StockOpnameSessionFindFirstOrThrowArgs> = z.object({
  select: StockOpnameSessionSelectSchema.optional(),
  where: StockOpnameSessionWhereInputSchema.optional(), 
  orderBy: z.union([ StockOpnameSessionOrderByWithRelationInputSchema.array(), StockOpnameSessionOrderByWithRelationInputSchema ]).optional(),
  cursor: StockOpnameSessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StockOpnameSessionScalarFieldEnumSchema, StockOpnameSessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const StockOpnameSessionFindManyArgsSchema: z.ZodType<Prisma.StockOpnameSessionFindManyArgs> = z.object({
  select: StockOpnameSessionSelectSchema.optional(),
  where: StockOpnameSessionWhereInputSchema.optional(), 
  orderBy: z.union([ StockOpnameSessionOrderByWithRelationInputSchema.array(), StockOpnameSessionOrderByWithRelationInputSchema ]).optional(),
  cursor: StockOpnameSessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StockOpnameSessionScalarFieldEnumSchema, StockOpnameSessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const StockOpnameSessionAggregateArgsSchema: z.ZodType<Prisma.StockOpnameSessionAggregateArgs> = z.object({
  where: StockOpnameSessionWhereInputSchema.optional(), 
  orderBy: z.union([ StockOpnameSessionOrderByWithRelationInputSchema.array(), StockOpnameSessionOrderByWithRelationInputSchema ]).optional(),
  cursor: StockOpnameSessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const StockOpnameSessionGroupByArgsSchema: z.ZodType<Prisma.StockOpnameSessionGroupByArgs> = z.object({
  where: StockOpnameSessionWhereInputSchema.optional(), 
  orderBy: z.union([ StockOpnameSessionOrderByWithAggregationInputSchema.array(), StockOpnameSessionOrderByWithAggregationInputSchema ]).optional(),
  by: StockOpnameSessionScalarFieldEnumSchema.array(), 
  having: StockOpnameSessionScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const StockOpnameSessionFindUniqueArgsSchema: z.ZodType<Prisma.StockOpnameSessionFindUniqueArgs> = z.object({
  select: StockOpnameSessionSelectSchema.optional(),
  where: StockOpnameSessionWhereUniqueInputSchema, 
}).strict();

export const StockOpnameSessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.StockOpnameSessionFindUniqueOrThrowArgs> = z.object({
  select: StockOpnameSessionSelectSchema.optional(),
  where: StockOpnameSessionWhereUniqueInputSchema, 
}).strict();

export const AuditLogFindFirstArgsSchema: z.ZodType<Prisma.AuditLogFindFirstArgs> = z.object({
  select: AuditLogSelectSchema.optional(),
  where: AuditLogWhereInputSchema.optional(), 
  orderBy: z.union([ AuditLogOrderByWithRelationInputSchema.array(), AuditLogOrderByWithRelationInputSchema ]).optional(),
  cursor: AuditLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuditLogScalarFieldEnumSchema, AuditLogScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AuditLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AuditLogFindFirstOrThrowArgs> = z.object({
  select: AuditLogSelectSchema.optional(),
  where: AuditLogWhereInputSchema.optional(), 
  orderBy: z.union([ AuditLogOrderByWithRelationInputSchema.array(), AuditLogOrderByWithRelationInputSchema ]).optional(),
  cursor: AuditLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuditLogScalarFieldEnumSchema, AuditLogScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AuditLogFindManyArgsSchema: z.ZodType<Prisma.AuditLogFindManyArgs> = z.object({
  select: AuditLogSelectSchema.optional(),
  where: AuditLogWhereInputSchema.optional(), 
  orderBy: z.union([ AuditLogOrderByWithRelationInputSchema.array(), AuditLogOrderByWithRelationInputSchema ]).optional(),
  cursor: AuditLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuditLogScalarFieldEnumSchema, AuditLogScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AuditLogAggregateArgsSchema: z.ZodType<Prisma.AuditLogAggregateArgs> = z.object({
  where: AuditLogWhereInputSchema.optional(), 
  orderBy: z.union([ AuditLogOrderByWithRelationInputSchema.array(), AuditLogOrderByWithRelationInputSchema ]).optional(),
  cursor: AuditLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AuditLogGroupByArgsSchema: z.ZodType<Prisma.AuditLogGroupByArgs> = z.object({
  where: AuditLogWhereInputSchema.optional(), 
  orderBy: z.union([ AuditLogOrderByWithAggregationInputSchema.array(), AuditLogOrderByWithAggregationInputSchema ]).optional(),
  by: AuditLogScalarFieldEnumSchema.array(), 
  having: AuditLogScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AuditLogFindUniqueArgsSchema: z.ZodType<Prisma.AuditLogFindUniqueArgs> = z.object({
  select: AuditLogSelectSchema.optional(),
  where: AuditLogWhereUniqueInputSchema, 
}).strict();

export const AuditLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AuditLogFindUniqueOrThrowArgs> = z.object({
  select: AuditLogSelectSchema.optional(),
  where: AuditLogWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const LocationCreateArgsSchema: z.ZodType<Prisma.LocationCreateArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  data: z.union([ LocationCreateInputSchema, LocationUncheckedCreateInputSchema ]),
}).strict();

export const LocationUpsertArgsSchema: z.ZodType<Prisma.LocationUpsertArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema, 
  create: z.union([ LocationCreateInputSchema, LocationUncheckedCreateInputSchema ]),
  update: z.union([ LocationUpdateInputSchema, LocationUncheckedUpdateInputSchema ]),
}).strict();

export const LocationCreateManyArgsSchema: z.ZodType<Prisma.LocationCreateManyArgs> = z.object({
  data: z.union([ LocationCreateManyInputSchema, LocationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const LocationDeleteArgsSchema: z.ZodType<Prisma.LocationDeleteArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema, 
}).strict();

export const LocationUpdateArgsSchema: z.ZodType<Prisma.LocationUpdateArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  data: z.union([ LocationUpdateInputSchema, LocationUncheckedUpdateInputSchema ]),
  where: LocationWhereUniqueInputSchema, 
}).strict();

export const LocationUpdateManyArgsSchema: z.ZodType<Prisma.LocationUpdateManyArgs> = z.object({
  data: z.union([ LocationUpdateManyMutationInputSchema, LocationUncheckedUpdateManyInputSchema ]),
  where: LocationWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const LocationDeleteManyArgsSchema: z.ZodType<Prisma.LocationDeleteManyArgs> = z.object({
  where: LocationWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AssetCreateArgsSchema: z.ZodType<Prisma.AssetCreateArgs> = z.object({
  select: AssetSelectSchema.optional(),
  data: z.union([ AssetCreateInputSchema, AssetUncheckedCreateInputSchema ]),
}).strict();

export const AssetUpsertArgsSchema: z.ZodType<Prisma.AssetUpsertArgs> = z.object({
  select: AssetSelectSchema.optional(),
  where: AssetWhereUniqueInputSchema, 
  create: z.union([ AssetCreateInputSchema, AssetUncheckedCreateInputSchema ]),
  update: z.union([ AssetUpdateInputSchema, AssetUncheckedUpdateInputSchema ]),
}).strict();

export const AssetCreateManyArgsSchema: z.ZodType<Prisma.AssetCreateManyArgs> = z.object({
  data: z.union([ AssetCreateManyInputSchema, AssetCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AssetDeleteArgsSchema: z.ZodType<Prisma.AssetDeleteArgs> = z.object({
  select: AssetSelectSchema.optional(),
  where: AssetWhereUniqueInputSchema, 
}).strict();

export const AssetUpdateArgsSchema: z.ZodType<Prisma.AssetUpdateArgs> = z.object({
  select: AssetSelectSchema.optional(),
  data: z.union([ AssetUpdateInputSchema, AssetUncheckedUpdateInputSchema ]),
  where: AssetWhereUniqueInputSchema, 
}).strict();

export const AssetUpdateManyArgsSchema: z.ZodType<Prisma.AssetUpdateManyArgs> = z.object({
  data: z.union([ AssetUpdateManyMutationInputSchema, AssetUncheckedUpdateManyInputSchema ]),
  where: AssetWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AssetDeleteManyArgsSchema: z.ZodType<Prisma.AssetDeleteManyArgs> = z.object({
  where: AssetWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MutationCreateArgsSchema: z.ZodType<Prisma.MutationCreateArgs> = z.object({
  select: MutationSelectSchema.optional(),
  data: z.union([ MutationCreateInputSchema, MutationUncheckedCreateInputSchema ]),
}).strict();

export const MutationUpsertArgsSchema: z.ZodType<Prisma.MutationUpsertArgs> = z.object({
  select: MutationSelectSchema.optional(),
  where: MutationWhereUniqueInputSchema, 
  create: z.union([ MutationCreateInputSchema, MutationUncheckedCreateInputSchema ]),
  update: z.union([ MutationUpdateInputSchema, MutationUncheckedUpdateInputSchema ]),
}).strict();

export const MutationCreateManyArgsSchema: z.ZodType<Prisma.MutationCreateManyArgs> = z.object({
  data: z.union([ MutationCreateManyInputSchema, MutationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MutationDeleteArgsSchema: z.ZodType<Prisma.MutationDeleteArgs> = z.object({
  select: MutationSelectSchema.optional(),
  where: MutationWhereUniqueInputSchema, 
}).strict();

export const MutationUpdateArgsSchema: z.ZodType<Prisma.MutationUpdateArgs> = z.object({
  select: MutationSelectSchema.optional(),
  data: z.union([ MutationUpdateInputSchema, MutationUncheckedUpdateInputSchema ]),
  where: MutationWhereUniqueInputSchema, 
}).strict();

export const MutationUpdateManyArgsSchema: z.ZodType<Prisma.MutationUpdateManyArgs> = z.object({
  data: z.union([ MutationUpdateManyMutationInputSchema, MutationUncheckedUpdateManyInputSchema ]),
  where: MutationWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MutationDeleteManyArgsSchema: z.ZodType<Prisma.MutationDeleteManyArgs> = z.object({
  where: MutationWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const StockOpnameSessionCreateArgsSchema: z.ZodType<Prisma.StockOpnameSessionCreateArgs> = z.object({
  select: StockOpnameSessionSelectSchema.optional(),
  data: z.union([ StockOpnameSessionCreateInputSchema, StockOpnameSessionUncheckedCreateInputSchema ]),
}).strict();

export const StockOpnameSessionUpsertArgsSchema: z.ZodType<Prisma.StockOpnameSessionUpsertArgs> = z.object({
  select: StockOpnameSessionSelectSchema.optional(),
  where: StockOpnameSessionWhereUniqueInputSchema, 
  create: z.union([ StockOpnameSessionCreateInputSchema, StockOpnameSessionUncheckedCreateInputSchema ]),
  update: z.union([ StockOpnameSessionUpdateInputSchema, StockOpnameSessionUncheckedUpdateInputSchema ]),
}).strict();

export const StockOpnameSessionCreateManyArgsSchema: z.ZodType<Prisma.StockOpnameSessionCreateManyArgs> = z.object({
  data: z.union([ StockOpnameSessionCreateManyInputSchema, StockOpnameSessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const StockOpnameSessionDeleteArgsSchema: z.ZodType<Prisma.StockOpnameSessionDeleteArgs> = z.object({
  select: StockOpnameSessionSelectSchema.optional(),
  where: StockOpnameSessionWhereUniqueInputSchema, 
}).strict();

export const StockOpnameSessionUpdateArgsSchema: z.ZodType<Prisma.StockOpnameSessionUpdateArgs> = z.object({
  select: StockOpnameSessionSelectSchema.optional(),
  data: z.union([ StockOpnameSessionUpdateInputSchema, StockOpnameSessionUncheckedUpdateInputSchema ]),
  where: StockOpnameSessionWhereUniqueInputSchema, 
}).strict();

export const StockOpnameSessionUpdateManyArgsSchema: z.ZodType<Prisma.StockOpnameSessionUpdateManyArgs> = z.object({
  data: z.union([ StockOpnameSessionUpdateManyMutationInputSchema, StockOpnameSessionUncheckedUpdateManyInputSchema ]),
  where: StockOpnameSessionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const StockOpnameSessionDeleteManyArgsSchema: z.ZodType<Prisma.StockOpnameSessionDeleteManyArgs> = z.object({
  where: StockOpnameSessionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AuditLogCreateArgsSchema: z.ZodType<Prisma.AuditLogCreateArgs> = z.object({
  select: AuditLogSelectSchema.optional(),
  data: z.union([ AuditLogCreateInputSchema, AuditLogUncheckedCreateInputSchema ]),
}).strict();

export const AuditLogUpsertArgsSchema: z.ZodType<Prisma.AuditLogUpsertArgs> = z.object({
  select: AuditLogSelectSchema.optional(),
  where: AuditLogWhereUniqueInputSchema, 
  create: z.union([ AuditLogCreateInputSchema, AuditLogUncheckedCreateInputSchema ]),
  update: z.union([ AuditLogUpdateInputSchema, AuditLogUncheckedUpdateInputSchema ]),
}).strict();

export const AuditLogCreateManyArgsSchema: z.ZodType<Prisma.AuditLogCreateManyArgs> = z.object({
  data: z.union([ AuditLogCreateManyInputSchema, AuditLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AuditLogDeleteArgsSchema: z.ZodType<Prisma.AuditLogDeleteArgs> = z.object({
  select: AuditLogSelectSchema.optional(),
  where: AuditLogWhereUniqueInputSchema, 
}).strict();

export const AuditLogUpdateArgsSchema: z.ZodType<Prisma.AuditLogUpdateArgs> = z.object({
  select: AuditLogSelectSchema.optional(),
  data: z.union([ AuditLogUpdateInputSchema, AuditLogUncheckedUpdateInputSchema ]),
  where: AuditLogWhereUniqueInputSchema, 
}).strict();

export const AuditLogUpdateManyArgsSchema: z.ZodType<Prisma.AuditLogUpdateManyArgs> = z.object({
  data: z.union([ AuditLogUpdateManyMutationInputSchema, AuditLogUncheckedUpdateManyInputSchema ]),
  where: AuditLogWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AuditLogDeleteManyArgsSchema: z.ZodType<Prisma.AuditLogDeleteManyArgs> = z.object({
  where: AuditLogWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();