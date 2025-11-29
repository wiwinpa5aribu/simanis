# Coding Standards

## TypeScript & Zod Form Validation

### Pattern untuk React Hook Form + Zod
Selalu gunakan pattern ini untuk form dengan zodResolver:

```typescript
// 1. Schema dengan optional fields yang punya default
export const mySchema = z.object({
  requiredField: z.string().min(1, 'Wajib diisi'),
  optionalField: z.boolean().optional(), // Gunakan .optional() untuk checkbox
})

// 2. Buat 2 tipe: Input (untuk form) dan Output (untuk submit)
export type MyFormInput = z.input<typeof mySchema>

export type MyFormValues = {
  requiredField: string
  optionalField: boolean // Non-optional di output
}

// 3. Di component, gunakan Input type untuk useForm
const { register, handleSubmit } = useForm<MyFormInput>({
  resolver: zodResolver(mySchema),
  defaultValues: {
    requiredField: '',
    optionalField: false,
  },
})

// 4. Di onSubmit, convert dengan nullish coalescing
const onSubmit = (data: MyFormInput) => {
  const formData: MyFormValues = {
    requiredField: data.requiredField,
    optionalField: data.optionalField ?? false,
  }
  // submit formData
}
```

## ESLint & Unused Variables

### Unused Function Parameters
Gunakan underscore prefix untuk parameter yang intentionally unused:

```typescript
// ✅ Benar
constructor(_callback: SomeType, _options?: OptionsType) {
  // Parameter required by interface but not used
}

// ❌ Salah
constructor(callback: SomeType, options?: OptionsType) {
  // Will cause ESLint error
}
```

### Mock Classes
Untuk mock classes di test setup:

```typescript
class MockSomething implements SomeInterface {
  constructor(
    _requiredParam: ParamType,
    _optionalParam?: OptionalType
  ) {
    // Mock implementation
  }
}
```

## Pre-commit Checklist

Sebelum commit, pastikan:
1. `npm run lint` - No errors
2. `npx tsc --noEmit` - No TypeScript errors
3. `npm run test:run` - Tests pass

## Common Pitfalls

### 1. Zod v4 Type Inference
- `z.infer<typeof schema>` = input type (sebelum transform/default)
- `z.output<typeof schema>` = output type (setelah transform/default)
- Untuk form dengan optional fields, selalu definisikan tipe eksplisit

### 2. React Hook Form + zodResolver
- zodResolver menggunakan input type dari schema
- Form values bisa undefined untuk optional fields
- Selalu handle dengan `??` atau default values

### 3. ESLint argsIgnorePattern
- Pattern `^_` mengabaikan parameter dengan prefix underscore
- Sudah dikonfigurasi di `eslint.config.js`
