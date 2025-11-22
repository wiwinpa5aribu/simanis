# Testing Guide - SIMANIS Frontend

Panduan lengkap untuk testing aplikasi SIMANIS menggunakan Vitest dan React Testing Library.

## 📋 Table of Contents

- [Setup](#setup)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Utilities](#test-utilities)
- [Best Practices](#best-practices)
- [Examples](#examples)

---

## 🚀 Setup

Testing infrastructure sudah dikonfigurasi dengan:

- **Vitest**: Fast unit test framework
- **React Testing Library**: Testing React components
- **@testing-library/jest-dom**: Custom matchers
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment untuk testing

### Configuration Files

- `vitest.config.ts` - Vitest configuration
- `src/test/setup.ts` - Global test setup
- `src/test/utils.tsx` - Test utilities & helpers

---

## 🏃 Running Tests

### Commands

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Watch Mode

Test akan otomatis re-run saat file berubah:

```bash
npm test
```

### Coverage Report

Generate coverage report:

```bash
npm run test:coverage
```

Coverage report akan tersedia di `coverage/index.html`

---

## ✍️ Writing Tests

### File Structure

```
src/
├── components/
│   └── ui/
│       ├── button.tsx
│       └── __tests__/
│           └── Button.test.tsx
├── libs/
│   └── utils/
│       ├── env.ts
│       └── __tests__/
│           └── env.test.ts
└── routes/
    └── dashboard/
        └── components/
            ├── StatCard.tsx
            └── __tests__/
                └── StatCard.test.tsx
```

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Testing Components

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button Component', () => {
  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Testing Utilities

```typescript
import { describe, it, expect } from 'vitest'
import { myUtilityFunction } from '../utils'

describe('myUtilityFunction', () => {
  it('should return correct value', () => {
    const result = myUtilityFunction('input')
    expect(result).toBe('expected output')
  })

  it('should handle edge cases', () => {
    expect(myUtilityFunction('')).toBe('')
    expect(myUtilityFunction(null)).toBe(null)
  })
})
```

### Testing API Clients

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mockApiResponse, mockApiError } from '@/test/utils'
import { getAssets } from '../assets'

describe('Assets API', () => {
  it('should fetch assets successfully', async () => {
    const mockData = { data: [], total: 0 }
    vi.spyOn(api, 'get').mockResolvedValue({ data: mockData })

    const result = await getAssets()
    expect(result).toEqual(mockData)
  })

  it('should handle errors', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Network error'))

    await expect(getAssets()).rejects.toThrow('Network error')
  })
})
```

---

## 🛠️ Test Utilities

### Custom Render

`src/test/utils.tsx` provides a custom render function with all providers:

```typescript
import { render, screen } from '@/test/utils'

// Automatically wraps with QueryClientProvider and BrowserRouter
render(<MyComponent />)
```

### Mock API Helpers

```typescript
import { mockApiResponse, mockApiError } from '@/test/utils'

// Mock successful response
const data = await mockApiResponse({ id: 1, name: 'Test' }, 100)

// Mock error response
await mockApiError('Not found', 404, 100)
```

### Wait Helper

```typescript
import { waitFor } from '@/test/utils'

// Wait for 1 second
await waitFor(1000)
```

---

## ✅ Best Practices

### 1. Test User Behavior, Not Implementation

❌ **Bad:**
```typescript
expect(component.state.isOpen).toBe(true)
```

✅ **Good:**
```typescript
expect(screen.getByRole('dialog')).toBeVisible()
```

### 2. Use Accessible Queries

Priority order:
1. `getByRole` - Best for accessibility
2. `getByLabelText` - For form elements
3. `getByPlaceholderText` - For inputs
4. `getByText` - For non-interactive elements
5. `getByTestId` - Last resort

```typescript
// ✅ Good
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)

// ❌ Avoid
screen.getByTestId('submit-button')
```

### 3. Test Async Operations

```typescript
import { waitFor } from '@testing-library/react'

it('should load data', async () => {
  render(<MyComponent />)

  // Wait for element to appear
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

### 4. Mock External Dependencies

```typescript
import { vi } from 'vitest'

// Mock module
vi.mock('../api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

// Mock function
const mockFn = vi.fn()
mockFn.mockReturnValue('mocked value')
```

### 5. Clean Up After Tests

```typescript
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup() // Already done in setup.ts
  vi.clearAllMocks()
})
```

### 6. Group Related Tests

```typescript
describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with text', () => {})
    it('should render with icon', () => {})
  })

  describe('Interactions', () => {
    it('should handle click', () => {})
    it('should handle hover', () => {})
  })

  describe('States', () => {
    it('should be disabled', () => {})
    it('should show loading', () => {})
  })
})
```

---

## 📚 Examples

### Example 1: Testing Form Component

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'

describe('LoginForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    })
  })

  it('should show validation errors', async () => {
    const user = userEvent.setup()

    render(<LoginForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })
})
```

### Example 2: Testing with React Query

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import { AssetsList } from '../AssetsList'

describe('AssetsList', () => {
  it('should display loading state', () => {
    render(<AssetsList />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should display assets after loading', async () => {
    render(<AssetsList />)

    await waitFor(() => {
      expect(screen.getByText('Laptop Dell')).toBeInTheDocument()
    })
  })

  it('should display error message on failure', async () => {
    // Mock API to return error
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Failed'))

    render(<AssetsList />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

### Example 3: Testing Custom Hooks

```typescript
import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAssets } from '../useAssets'

describe('useAssets', () => {
  it('should fetch assets', async () => {
    const { result } = renderHook(() => useAssets())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBeDefined()
  })
})
```

---

## 🎯 Coverage Goals

Target coverage:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Priority testing:
1. Business logic (utilities, helpers)
2. Critical user flows (auth, CRUD)
3. Complex components (forms, tables)
4. API clients
5. Validation schemas

---

## 📝 Tips

1. **Write tests first** (TDD) when possible
2. **Keep tests simple** and focused
3. **Test one thing** per test
4. **Use descriptive names** for tests
5. **Mock external dependencies**
6. **Don't test implementation details**
7. **Test accessibility** (ARIA, keyboard nav)
8. **Run tests before commit**

---

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: 2025-11-19
**Version**: 1.0.0
