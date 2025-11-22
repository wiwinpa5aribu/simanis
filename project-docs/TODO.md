# TODO - SIMANIS Code Quality Refactoring

**Last Updated:** 2024-11-20  
**Priority Legend:** 🔴 High | 🟡 Medium | 🟢 Low

---

## 🔥 Immediate (Next Session)

### 1. Complete Phase 2: Lifecycle Logging 🔴
**Status:** 2/8 components done  
**Estimated Time:** 1-2 hours  
**Assigned To:** TBD

**Remaining Components:**
- [ ] DashboardPage.tsx
  - Add `useEffect` for mount/unmount
  - No user actions to log (read-only page)
  - **Challenge:** Large file (210 lines), use manual editing
  
- [ ] CategoriesPage.tsx (if exists)
  - Add lifecycle logging
  - Log create/edit/delete actions
  
- [ ] AssetCreatePage.tsx
  - Add lifecycle logging
  - Log form submission
  - Log validation errors
  
- [ ] AssetDetailPage.tsx
  - Add lifecycle logging
  - Log tab changes
  - Log edit actions
  
- [ ] LoanCreatePage.tsx
  - Add lifecycle logging
  - Log form submission
  
- [ ] InventoryListPage.tsx
  - Add lifecycle logging
  - Log scan actions
  - Log photo upload

**Approach Options:**
1. **Manual Editing** (RECOMMENDED)
   - Open each file in editor
   - Add imports: `useEffect` and `logger`
   - Copy-paste lifecycle template
   - Test build after each file
   
2. **Script-Based**
   - Create Node.js script to inject code
   - Safer for batch operations
   - Requires testing
   
3. **Template-Based**
   - Create snippet in VS Code
   - Type trigger → auto-insert template

**Template:**
```typescript
// Add to imports
import { useEffect } from 'react'
import { logger } from '@/libs/utils/logger'

// Add after hooks, before return
useEffect(() => {
  logger.lifecycle('ComponentName', 'mount', {
    // Add relevant context
  })
  return () => {
    logger.lifecycle('ComponentName', 'unmount')
  }
}, [])

// For user actions
const handleAction = () => {
  logger.info('ComponentName', 'User action description', {
    // Add relevant data
  })
  // ... existing code
}
```

---

### 2. Update Documentation 🟡
**Estimated Time:** 30 minutes

- [ ] Add guards pattern to `Best_Practices.txt`
  ```
  ## Defensive Programming
  - Use guards for all API function inputs
  - Validate responses before returning
  - Example: assertNonEmptyString(id, 'functionName', 'paramName')
  ```

- [ ] Create lifecycle logging template in docs
  - When to use
  - How to implement
  - What to log

- [ ] Update onboarding documentation
  - New patterns introduced
  - How to use guards
  - How to add lifecycle logging

---

### 3. Test & Verify 🔴
**Estimated Time:** 30 minutes

- [ ] Run full build: `npm run build`
  - Ensure no new errors introduced
  - Document any new issues
  
- [ ] Test in browser
  - Open DevTools console
  - Navigate through pages
  - Verify lifecycle logs appear
  - Verify user action logs appear
  
- [ ] Test guards in action
  - Try calling API with invalid data
  - Verify error logs appear
  - Verify error messages are clear

---

## 📅 Short Term (This Week)

### 4. Fix Pre-existing TypeScript Errors 🔴
**Files:** KIBGeneratePage.tsx, DepreciationListPage.tsx  
**Errors:** 19 total  
**Estimated Time:** 2-3 hours

**KIBGeneratePage.tsx (10 errors):**
- [ ] Fix missing `DialogTrigger` export
  - Check `@/components/ui/dialog` exports
  - Add export or remove usage
  
- [ ] Remove unused `useEffect` import
  - Line 1: `import { useState, useEffect }`
  - Remove `useEffect` if not used
  
- [ ] Remove unused `presets` variable
  - Line 56: `const { presets, addPreset, ... }`
  - Remove if not used or use it
  
- [ ] Fix `KIBFilters` type mismatch
  - Add index signature: `[key: string]: unknown`
  - Or change store type
  
- [ ] Fix `SelectItem` className prop
  - Remove `className` from SelectItem
  - Or update SelectItem component to accept it

**DepreciationListPage.tsx (9 errors):**
- [ ] Same issues as KIBGeneratePage
  - DialogTrigger
  - presets unused
  - DepreciationFilters type
  - SelectItem className

**Approach:**
1. Create separate branch: `fix/typescript-errors`
2. Fix one file at a time
3. Test build after each fix
4. Commit with descriptive messages
5. Merge to master when all fixed

---

### 5. Code Review Session 🟡
**Estimated Time:** 1 hour  
**Participants:** Team

**Agenda:**
- [ ] Review guards.ts implementation
  - Discuss utility functions
  - When to use each guard
  - Examples from API files
  
- [ ] Review lifecycle logging pattern
  - Show console output
  - Discuss what to log
  - When to add logging
  
- [ ] Review global error handler
  - How it works
  - Benefits
  - Limitations
  
- [ ] Discuss challenges faced
  - File editing complexity
  - Solutions for future
  
- [ ] Get feedback
  - What works well?
  - What needs improvement?
  - Any concerns?

---

### 6. Create Code Snippets 🟢
**Estimated Time:** 30 minutes

**VS Code Snippets:**
- [ ] Lifecycle logging snippet
  ```json
  "Lifecycle Logging": {
    "prefix": "lifecycle",
    "body": [
      "useEffect(() => {",
      "  logger.lifecycle('${1:ComponentName}', 'mount', {",
      "    ${2:// context}",
      "  })",
      "  return () => {",
      "    logger.lifecycle('${1:ComponentName}', 'unmount')",
      "  }",
      "}, [])"
    ]
  }
  ```

- [ ] User action logging snippet
  ```json
  "User Action Log": {
    "prefix": "logaction",
    "body": [
      "logger.info('${1:ComponentName}', '${2:Action description}', {",
      "  ${3:// data}",
      "})"
    ]
  }
  ```

- [ ] Guards assertion snippet
  ```json
  "Assert Non Empty String": {
    "prefix": "assertstring",
    "body": [
      "assertNonEmptyString(${1:value}, '${2:functionName}', '${3:paramName}')"
    ]
  }
  ```

---

## 🎯 Medium Term (This Month)

### 7. Phase 3: Feature-based Error Boundaries 🟡
**Estimated Time:** 4-6 hours

- [ ] Create `FeatureErrorBoundary` component
  - Extends React.ErrorBoundary
  - Accepts feature name prop
  - Shows feature-specific error UI
  
- [ ] Wrap each route in App.tsx
  ```tsx
  <FeatureErrorBoundary feature="Assets">
    <Route path="/assets" element={<AssetsListPage />} />
  </FeatureErrorBoundary>
  ```
  
- [ ] Create error fallback UI
  - User-friendly error message
  - Retry button
  - Report error button
  
- [ ] Test error boundaries
  - Throw error in component
  - Verify boundary catches it
  - Verify other features still work

---

### 8. Phase 4: Zod API Response Validation 🟡
**Estimated Time:** 6-8 hours

- [ ] Install Zod: `npm install zod`

- [ ] Create Zod schemas for API responses
  - `src/libs/validation/apiSchemas.ts`
  - Schema for each API endpoint
  
- [ ] Update API functions to validate responses
  ```typescript
  const response = await api.get('/assets')
  const validated = AssetListSchema.parse(response.data)
  return validated
  ```
  
- [ ] Handle validation errors
  - Log validation failures
  - Throw descriptive errors
  - Show user-friendly messages
  
- [ ] Test with invalid data
  - Mock API responses
  - Verify validation catches issues

---

### 9. Phase 5: Custom Hooks for Reusable Logic 🟡
**Estimated Time:** 8-10 hours

**Hooks to Create:**
- [ ] `useApiQuery` - Wrapper around useQuery with logging
- [ ] `useFormSubmit` - Form submission with validation
- [ ] `usePermissionCheck` - Permission checking logic
- [ ] `useTableFilters` - Table filtering logic
- [ ] `usePagination` - Pagination logic

**Benefits:**
- DRY (Don't Repeat Yourself)
- Consistent patterns
- Easier testing
- Better maintainability

---

### 10. Phase 6: Performance Monitoring 🟢
**Estimated Time:** 4-6 hours

- [ ] Add Axios interceptor for API timing
  ```typescript
  axios.interceptors.request.use(config => {
    config.metadata = { startTime: Date.now() }
    return config
  })
  
  axios.interceptors.response.use(response => {
    const duration = Date.now() - response.config.metadata.startTime
    logger.performance('API', response.config.url, duration)
    return response
  })
  ```
  
- [ ] Add performance marks for critical operations
- [ ] Create performance dashboard (optional)
- [ ] Set up alerts for slow operations

---

## 🔧 Technical Debt

### 11. Refactor File Editing Approach 🟢
**Priority:** Low (for future sessions)

**Problem:**
- Current file editing tools unreliable for complex files
- Multiple attempts needed
- Risk of file corruption

**Solutions to Explore:**
- [ ] Research better file editing libraries
- [ ] Create custom AST-based editor
- [ ] Use template-based generation
- [ ] Improve target content matching algorithm

---

### 12. Add Unit Tests for Guards 🟢
**Estimated Time:** 2-3 hours

- [ ] Test `isDefined()`
- [ ] Test `isValidId()`
- [ ] Test `isNonEmptyString()`
- [ ] Test `assertDefined()` - should throw
- [ ] Test `assertValidId()` - should throw
- [ ] Test `safeArrayAccess()`
- [ ] Test `safeGet()`

**Framework:** Vitest (already in project)

---

### 13. Add Integration Tests 🟢
**Estimated Time:** 4-6 hours

- [ ] Test API functions with guards
  - Valid input → success
  - Invalid input → error with log
  
- [ ] Test error boundaries
  - Component throws → boundary catches
  - Other components still work
  
- [ ] Test lifecycle logging
  - Component mounts → log appears
  - Component unmounts → log appears

---

## 📚 Documentation

### 14. Create Developer Guide 🟡
**Estimated Time:** 2-3 hours

**Sections:**
- [ ] Introduction to code quality patterns
- [ ] How to use guards utility
- [ ] When to add lifecycle logging
- [ ] Error handling best practices
- [ ] Testing guidelines
- [ ] Code review checklist

---

### 15. Update README 🟢
**Estimated Time:** 30 minutes

- [ ] Add section on code quality
- [ ] Link to Best Practices
- [ ] Link to Developer Guide
- [ ] Update setup instructions if needed

---

## 🎓 Training & Onboarding

### 16. Team Training Session 🟡
**Estimated Time:** 2 hours

**Topics:**
- [ ] Overview of refactoring work
- [ ] Defensive programming patterns
- [ ] Lifecycle logging
- [ ] Error boundaries
- [ ] Q&A session

---

### 17. Create Video Tutorials 🟢
**Estimated Time:** 3-4 hours

- [ ] How to use guards utility (5 min)
- [ ] How to add lifecycle logging (5 min)
- [ ] How to debug with logs (10 min)
- [ ] Code review checklist walkthrough (10 min)

---

## 📊 Metrics & Monitoring

### 18. Set Up Error Tracking Dashboard 🟢
**Estimated Time:** 2-3 hours

**Tools:** Consider Sentry, LogRocket, or custom solution

- [ ] Integrate error tracking service
- [ ] Configure error grouping
- [ ] Set up alerts
- [ ] Create dashboard for team

---

### 19. Track Code Quality Metrics 🟢
**Estimated Time:** 1-2 hours

**Metrics to Track:**
- [ ] TypeScript error count (target: 0)
- [ ] Test coverage (target: >80%)
- [ ] Build time
- [ ] Bundle size
- [ ] API response times

---

## ✅ Completed

### Code Quality & Defensive Programming
- [x] Global Query Error Handler
- [x] Guards utility (guards.ts)
- [x] Defensive programming (4 API files Phase 1, 7 functions)
- [x] Defensive programming (4 API files Phase 2: inventory, depreciation, reports, audit)
- [x] Lifecycle logging (AssetsListPage)
- [x] Lifecycle logging (LoansListPage)
- [x] Lifecycle logging (CategoriesPage)
- [x] Lifecycle logging (DashboardPage)
- [x] Lifecycle logging (InventoryListPage)
- [x] Bug fixes (4 import/type errors)
- [x] Cleanup unused files
- [x] Organize documentation
- [x] Create CHANGELOG.md
- [x] Create PROJECT-STATUS.md
- [x] Create TODO.md

### Phase 3 Implementation (COMPLETE)
- [x] Refactor Tabel & Filter (DataTable, FilterBar, filterStore)
- [x] Bulk Actions di Daftar Aset (AssetBulkActions)
- [x] Notifikasi In-App (Toast utilities)
- [x] Favorite / Pin Aset (favoriteStore, UI integration)
- [x] Riwayat Aktivitas per Aset & User (AssetActivityTimeline)
- [x] Preset Filter untuk KIB & Penyusutan (reportPresetStore)
- [x] Penguatan RBAC di UI (permissions.ts, usePermission hook)
- [x] Performance & DRY Refactor (useDebouncedValue, component reuse)
- [x] Testing Manual & Verifikasi Phase 3

---

## 🗓️ Timeline Estimate

| Phase | Tasks | Estimated Time | Priority |
|-------|-------|----------------|----------|
| **Immediate** | Complete Phase 2, Docs, Testing | 2-3 hours | 🔴 High |
| **Short Term** | Fix TS errors, Code review, Snippets | 4-5 hours | 🔴 High |
| **Medium Term** | Phases 3-6 | 22-30 hours | 🟡 Medium |
| **Long Term** | Tests, Docs, Training | 14-20 hours | 🟢 Low |
| **TOTAL** | | **42-58 hours** | |

**Recommended Schedule:**
- Week 1: Complete immediate + short term tasks
- Week 2-3: Phase 3 & 4
- Week 4: Phase 5 & 6
- Week 5: Testing & documentation
- Week 6: Training & polish

---

## 📝 Notes

### Dependencies
- All tasks depend on completing Phase 2 first
- Phases 3-6 can be done in parallel if multiple developers
- Testing should be done incrementally, not at the end

### Resources Needed
- Developer time (1-2 developers)
- Code review time (team)
- Testing environment
- Documentation platform

### Success Criteria
- ✅ All 8 components have lifecycle logging
- ✅ 0 TypeScript errors
- ✅ All tests passing
- ✅ Documentation complete
- ✅ Team trained on new patterns
- ✅ Code quality metrics improved
