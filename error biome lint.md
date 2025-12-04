1s
##[debug]Evaluating condition for step: 'Run Biome lint'
##[debug]Evaluating: success()
##[debug]Evaluating success:
##[debug]=> true
##[debug]Result: true
##[debug]Starting: Run Biome lint
##[debug]Loading inputs
##[debug]Loading env
Run pnpm run lint
##[debug]/usr/bin/bash -e /home/runner/work/_temp/719d9168-fee9-4e46-8ba0-e04b2550ad55.sh
> simanis@1.0.0 lint /home/runner/work/simanis/simanis
> turbo run lint
Attention:
Turborepo now collects completely anonymous telemetry regarding usage.
This information is used to shape the Turborepo roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://turborepo.com/docs/telemetry
• Packages in scope: @simanis/api, @simanis/database, @simanis/shared, @simanis/web
• Running lint in 4 packages
• Remote caching disabled
::group::@simanis/shared:lint
@simanis/shared:lint
::group::@simanis/database:lint
@simanis/database:lint
  
@simanis/web:lint
cache miss, executing 989352ca1df878f6
> @simanis/web@1.0.0 lint /home/runner/work/simanis/simanis/apps/web
> biome check .
src/components/layout/AppLayout.tsx:45:9 lint/a11y/useKeyWithClickEvents ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ! Enforce to have the onClick mouse event with the onKeyUp, the onKeyDown, or the onKeyPress keyboard event.
  
    43 │       {/* Mobile Sidebar Overlay */}
    44 │       {sidebarOpen && (
  > 45 │         <div
       │         ^^^^
  > 46 │           className="fixed inset-0 bg-black/50 z-40 md:hidden"
  > 47 │           onClick={() => setSidebarOpen(false)}
  > 48 │         />
       │         ^^
    49 │       )}
    50 │ 
  
  i Actions triggered using mouse events should have corresponding keyboard events to account for keyboard-only navigation.
  
src/components/ui/label.tsx:9:7 lint/a11y/noLabelWithoutControl ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ! A form label must be associated with an input.
  
     7 │   ({ className, children, ...props }, ref) => {
     8 │     return (
   > 9 │       <label
       │       ^^^^^^
  > 10 │         ref={ref}
        ...
  > 17 │         {children}
  > 18 │       </label>
       │       ^^^^^^^^
    19 │     )
    20 │   }
  
  i Consider adding a `for` or `htmlFor` attribute to the label element or moving the input element to inside the label element.
  
src/routes/assets/AssetCreatePage.tsx:71:53 lint/suspicious/noExplicitAny ━━━━━━━━━━━━━━━━━━━━━━━━━━
  ! Unexpected any. Specify a different type.
  
    69 │   } = useForm<CreateAssetFormInput>({
    70 │     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  > 71 │     resolver: zodResolver(createAssetFormSchema) as any,
       │                                                     ^^^
    72 │     defaultValues: {
    73 │       kondisi: 'Baik',
  
  i any disables many type checking rules. Its use should be avoided.
  
src/routes/assets/AssetsListPage.tsx:64:3 lint/correctness/useExhaustiveDependencies  FIXABLE  ━━━━━━━━━━
  ! This hook does not specify its dependency on can.
  
    63 │   // Lifecycle logging
  > 64 │   useEffect(() => {
       │   ^^^^^^^^^
    65 │     logger.lifecycle('AssetsListPage', 'mount', {
    66 │       savedFilters,
  
  i This dependency is being used here, but is not specified in the hook dependency list.
  
    65 │     logger.lifecycle('AssetsListPage', 'mount', {
    66 │       savedFilters,
  > 67 │       hasPermission: can('manage_assets'),
       │                      ^^^
    68 │     })
    69 │ 
  
  i Either include it or remove the dependency array.
  
  i Unsafe fix: Add the missing dependency to the list.
  
    74 │ ··},·[can])
       │       +++  
src/routes/assets/AssetsListPage.tsx:64:3 lint/correctness/useExhaustiveDependencies  FIXABLE  ━━━━━━━━━━
  ! This hook does not specify its dependency on savedFilters.
  
    63 │   // Lifecycle logging
  > 64 │   useEffect(() => {
       │   ^^^^^^^^^
    65 │     logger.lifecycle('AssetsListPage', 'mount', {
    66 │       savedFilters,
  
  i This dependency is being used here, but is not specified in the hook dependency list.
  
    64 │   useEffect(() => {
    65 │     logger.lifecycle('AssetsListPage', 'mount', {
  > 66 │       savedFilters,
       │       ^^^^^^^^^^^^
    67 │       hasPermission: can('manage_assets'),
    68 │     })
  
  i Either include it or remove the dependency array.
  
  i Unsafe fix: Add the missing dependency to the list.
  
    74 │ ··},·[savedFilters])
       │       ++++++++++++  
src/routes/assets/AssetsListPage.tsx:134:3 lint/correctness/useExhaustiveDependencies  FIXABLE  ━━━━━━━━━━
  ! This hook specifies more dependencies than necessary: searchTerm, categoryFilter, conditionFilter, pageSize
  
    133 │   // Reset to page 1 when filters change
  > 134 │   useEffect(() => {
        │   ^^^^^^^^^
    135 │     setCurrentPage(1)
    136 │   }, [searchTerm, categoryFilter, conditionFilter, pageSize])
  
  i This dependency can be removed from the list.
  
    134 │   useEffect(() => {
    135 │     setCurrentPage(1)
  > 136 │   }, [searchTerm, categoryFilter, conditionFilter, pageSize])
        │       ^^^^^^^^^^
    137 │ 
    138 │   // Helper function untuk mendapatkan warna badge kondisi
  
  i This dependency can be removed from the list.
  
    134 │   useEffect(() => {
    135 │     setCurrentPage(1)
  > 136 │   }, [searchTerm, categoryFilter, conditionFilter, pageSize])
        │                   ^^^^^^^^^^^^^^
    137 │ 
    138 │   // Helper function untuk mendapatkan warna badge kondisi
  
  i This dependency can be removed from the list.
  
    134 │   useEffect(() => {
    135 │     setCurrentPage(1)
  > 136 │   }, [searchTerm, categoryFilter, conditionFilter, pageSize])
        │                                   ^^^^^^^^^^^^^^^
    137 │ 
    138 │   // Helper function untuk mendapatkan warna badge kondisi
  
  i This dependency can be removed from the list.
  
    134 │   useEffect(() => {
    135 │     setCurrentPage(1)
  > 136 │   }, [searchTerm, categoryFilter, conditionFilter, pageSize])
        │                                                    ^^^^^^^^
    137 │ 
    138 │   // Helper function untuk mendapatkan warna badge kondisi
  
  i Unsafe fix: Remove the extra dependencies from the list.
  
    136 │ ··},·[searchTerm,·categoryFilter,·conditionFilter,·pageSize])
        │       -----------------------------------------------------  
src/routes/assets/components/AssetBulkActions.tsx:84:42 lint/suspicious/noExplicitAny ━━━━━━━━━━━━━━
  ! Unexpected any. Specify a different type.
  
    82 │       try {
    83 │         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  > 84 │         await updateAsset(id, updates as any)
       │                                          ^^^
    85 │         successCount++
    86 │       } catch (error) {
  
  i any disables many type checking rules. Its use should be avoided.
  
src/routes/inventory/InventoryListPage.tsx:30:3 lint/correctness/useExhaustiveDependencies  FIXABLE  ━━━━━━━━━━
  ! This hook does not specify its dependency on savedFilters.
  
    29 │   // Lifecycle logging
  > 30 │   useEffect(() => {
       │   ^^^^^^^^^
    31 │     logger.lifecycle('InventoryListPage', 'mount', {
    32 │       savedFilters,
  
  i This dependency is being used here, but is not specified in the hook dependency list.
  
    31 │     logger.lifecycle('InventoryListPage', 'mount', {
    32 │       savedFilters,
  > 33 │       hasFilters: Object.keys(savedFilters).length > 0,
       │                               ^^^^^^^^^^^^
    34 │     })
    35 │     return () => {
  
  i This dependency is being used here, but is not specified in the hook dependency list.
  
    30 │   useEffect(() => {
    31 │     logger.lifecycle('InventoryListPage', 'mount', {
  > 32 │       savedFilters,
       │       ^^^^^^^^^^^^
    33 │       hasFilters: Object.keys(savedFilters).length > 0,
    34 │     })
  
  i Either include it or remove the dependency array.
  
  i Unsafe fix: Add the missing dependency to the list.
  
    39 │ ··},·[savedFilters])
       │       ++++++++++++  
src/routes/loans/LoanCreatePage.tsx:38:48 lint/suspicious/noExplicitAny ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ! Unexpected any. Specify a different type.
  
    36 │   } = useForm<CreateLoanFormValues>({
    37 │     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  > 38 │     resolver: zodResolver(createLoanSchema) as any,
       │                                                ^^^
    39 │     defaultValues: {
    40 │       tanggalPinjam: new Date().toISOString().split('T')[0],
  
  i any disables many type checking rules. Its use should be avoided.
  
src/routes/loans/LoansListPage.tsx:34:3 lint/correctness/useExhaustiveDependencies  FIXABLE  ━━━━━━━━━━
  ! This hook does not specify its dependency on savedFilters.
  
    33 │   // Lifecycle logging
  > 34 │   useEffect(() => {
       │   ^^^^^^^^^
    35 │     logger.lifecycle('LoansListPage', 'mount', { savedFilters })
    36 │     return () => {
  
  i This dependency is being used here, but is not specified in the hook dependency list.
  
    33 │   // Lifecycle logging
    34 │   useEffect(() => {
  > 35 │     logger.lifecycle('LoansListPage', 'mount', { savedFilters })
       │                                                  ^^^^^^^^^^^^
    36 │     return () => {
    37 │       logger.lifecycle('LoansListPage', 'unmount')
  
  i Either include it or remove the dependency array.
  
  i Unsafe fix: Add the missing dependency to the list.
  
    40 │ ··},·[savedFilters])
       │       ++++++++++++  
src/test/setup.ts:47:22 lint/suspicious/noEmptyBlockStatements ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ! Unexpected empty block.
  
    45 │   }
    46 │ 
  > 47 │   disconnect(): void {}
       │                      ^^
    48 │   observe(): void {}
    49 │   unobserve(): void {}
  
  i Empty blocks are usually the result of an incomplete refactoring. Remove the empty block or add a comment inside it if it is intentional.
  
src/test/setup.ts:48:19 lint/suspicious/noEmptyBlockStatements ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ! Unexpected empty block.
  
    47 │   disconnect(): void {}
  > 48 │   observe(): void {}
       │                   ^^
    49 │   unobserve(): void {}
    50 │   takeRecords(): IntersectionObserverEntry[] {
  
  i Empty blocks are usually the result of an incomplete refactoring. Remove the empty block or add a comment inside it if it is intentional.
  
src/test/setup.ts:49:21 lint/suspicious/noEmptyBlockStatements ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ! Unexpected empty block.
  
    47 │   disconnect(): void {}
    48 │   observe(): void {}
  > 49 │   unobserve(): void {}
       │                     ^^
    50 │   takeRecords(): IntersectionObserverEntry[] {
    51 │     return []
  
  i Empty blocks are usually the result of an incomplete refactoring. Remove the empty block or add a comment inside it if it is intentional.
  
src/test/vitest.d.ts:10:27 lint/suspicious/noExplicitAny ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ! Unexpected any. Specify a different type.
  
     8 │ declare module 'vitest' {
     9 │   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  > 10 │   interface Assertion<T = any>
       │                           ^^^
    11 │     extends jest.Matchers<void>,
    12 │       TestingLibraryMatchers<T, void> {}
  
  i any disables many type checking rules. Its use should be avoided.
  
src/test/vitest.d.ts:16:30 lint/suspicious/noExplicitAny ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ! Unexpected any. Specify a different type.
  
    14 │     extends jest.Matchers<void>,
    15 │       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  > 16 │       TestingLibraryMatchers<any, void> {}
       │                              ^^^
    17 │ }
    18 │ 
  
  i any disables many type checking rules. Its use should be avoided.
  
src/routes/depreciation/DepreciationListPage.tsx:6:1 assist/source/organizeImports  FIXABLE  ━━━━━━━━━━
  × The imports and exports are not sorted.
  
    4 │  */
    5 │ 
  > 6 │ import { useMutation } from '@tanstack/react-query'
      │ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    7 │ import { Download, BarChart3, List, Settings, Calculator } from 'lucide-react'
    8 │ import { useState } from 'react'
  
  i Safe fix: Organize Imports (Biome)
  
      5   5 │   
      6   6 │   import { useMutation } from '@tanstack/react-query'
      7     │ - import·{·Download,·BarChart3,·List,·Settings,·Calculator·}·from·'lucide-react'
          7 │ + import·{·BarChart3,·Calculator,·Download,·List,·Settings·}·from·'lucide-react'
Error: @simanis/web#lint: command (/home/runner/work/simanis/simanis/apps/web) /home/runner/setup-pnpm/node_modules/.bin/pnpm run lint exited (1)
 ERROR  run failed: command  exited (1)
      8   8 │   import { useState } from 'react'
      9   9 │   import { toast } from 'sonner'
    ······· │ 
     11  11 │   import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
     12  12 │   import {
     13     │ - ··downloadDepreciationReport,
     14     │ - ··simulateDepreciation,
     15     │ - ··type·DepreciationListItem,
     16     │ - ··type·SimulateDepreciationResult,
         13 │ + ··type·DepreciationListItem,
         14 │ + ··downloadDepreciationReport,
         15 │ + ··type·SimulateDepreciationResult,
         16 │ + ··simulateDepreciation,
     17  17 │   } from '@/libs/api/depreciation'
     18  18 │   import {
  
src/routes/depreciation/components/DepreciationChart.tsx:6:1 assist/source/organizeImports  FIXABLE  ━━━━━━━━━━
  × The imports and exports are not sorted.
  
    4 │  */
    5 │ 
  > 6 │ import { useQuery } from '@tanstack/react-query'
      │ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    7 │ import {
    8 │   LineChart,
  
  i Safe fix: Organize Imports (Biome)
  
      6   6 │   import { useQuery } from '@tanstack/react-query'
      7   7 │   import {
      8     │ - ··LineChart,
      9     │ - ··Line,
     10     │ - ··XAxis,
     11     │ - ··YAxis,
     12     │ - ··CartesianGrid,
          8 │ + ··CartesianGrid,
          9 │ + ··Legend,
         10 │ + ··Line,
         11 │ + ··LineChart,
         12 │ + ··ResponsiveContainer,
     13  13 │     Tooltip,
     14     │ - ··Legend,
     15     │ - ··ResponsiveContainer,
         14 │ + ··XAxis,
         15 │ + ··YAxis,
     16  16 │   } from 'recharts'
     17  17 │   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  
src/routes/depreciation/components/DepreciationDetailModal.tsx:6:1 assist/source/organizeImports  FIXABLE  ━━━━━━━━━━
  × The imports and exports are not sorted.
  
    4 │  */
    5 │ 
  > 6 │ import { useQuery } from '@tanstack/react-query'
      │ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    7 │ import { X, Calendar, TrendingDown } from 'lucide-react'
    8 │ import { Button } from '@/components/ui/button'
  
  i Safe fix: Organize Imports (Biome)
  
      5   5 │   
      6   6 │   import { useQuery } from '@tanstack/react-query'
      7     │ - import·{·X,·Calendar,·TrendingDown·}·from·'lucide-react'
          7 │ + import·{·Calendar,·TrendingDown,·X·}·from·'lucide-react'
      8   8 │   import { Button } from '@/components/ui/button'
      9   9 │   import {
  
src/routes/depreciation/components/SimulationForm.tsx:6:1 assist/source/organizeImports  FIXABLE  ━━━━━━━━━━
  × The imports and exports are not sorted.
  
    4 │  */
    5 │ 
  > 6 │ import { zodResolver } from '@hookform/resolvers/zod'
      │ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    7 │ import { useQuery } from '@tanstack/react-query'
    8 │ import { Calculator } from 'lucide-react'
  
  i Safe fix: Organize Imports (Biome)
  
     22  22 │   import { getCategories } from '@/libs/api/categories'
     23  23 │   import {
     24     │ - ··simulateDepreciationSchema,
     25     │ - ··type·SimulateDepreciationInput,
         24 │ + ··type·SimulateDepreciationInput,
         25 │ + ··simulateDepreciationSchema,
     26  26 │   } from '@/libs/validation/depreciationSchemas'
     27  27 │   
  
src/routes/depreciation/components/SimulationResult.tsx:6:1 assist/source/organizeImports  FIXABLE  ━━━━━━━━━━
  × The imports and exports are not sorted.
  
    4 │  */
    5 │ 
  > 6 │ import { Calendar, TrendingDown } from 'lucide-react'
      │ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    7 │ import {
    8 │   LineChart,
  
  i Safe fix: Organize Imports (Biome)
  
      6   6 │   import { Calendar, TrendingDown } from 'lucide-react'
      7   7 │   import {
      8     │ - ··LineChart,
          8 │ + ··CartesianGrid,
      9   9 │     Line,
The number of diagnostics exceeds the limit allowed. Use --max-diagnostics to increase it.
Diagnostics not shown: 3.
Checked 162 files in 222ms. No fixes applied.
Found 8 errors.
Found 15 warnings.
     10     │ - ··XAxis,
     11     │ - ··YAxis,
     12     │ - ··CartesianGrid,
     13     │ - ··Tooltip,
     14     │ - ··ResponsiveContainer,
         10 │ + ··LineChart,
         11 │ + ··ResponsiveContainer,
         12 │ + ··Tooltip,
         13 │ + ··XAxis,
         14 │ + ··YAxis,
     15  15 │   } from 'recharts'
     16  16 │   import { Badge } from '@/components/ui/badge'
  
check ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  × Some errors were emitted while running checks.
  
 ELIFECYCLE  Command failed with exit code 1.
Error:  command finished with error: command (/home/runner/work/simanis/simanis/apps/web) /home/runner/setup-pnpm/node_modules/.bin/pnpm run lint exited (1)
::group::@simanis/api:lint
@simanis/api:lint
 Tasks:    2 successful, 4 total
Cached:    0 cached, 4 total
  Time:    1.148s 
Failed:    @simanis/web#lint
 ELIFECYCLE  Command failed with exit code 1.
Error: Process completed with exit code 1.
##[debug]Finishing: Run Biome lint