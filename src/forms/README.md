# Forms architecture

How this project connects forms to the ApiAstil backend, and how to add a new one.

## Layers

```
src/
├── api/
│   ├── client.ts     # apiRequest<T>() - the only thing allowed to call fetch against the backend
│   └── errors.ts     # ApiError - the one error shape every service/form deals with
├── services/
│   └── <resource>.service.ts   # one file per backend resource (e.g. facturacion.service.ts)
└── forms/
    ├── components/    # shared FormField / FormStatusBanner
    ├── hooks/
    │   └── useFormState.ts
    └── <form-name>/
        └── <FormName>.tsx
```

Rule of thumb: **forms never call `fetch` or `apiRequest` directly.** They call a
function exported from a `services/*.service.ts` file, which is the only place
that knows the backend's URL paths and request/response shapes.

## Adding a new form

1. **Service**: create `src/services/<resource>.service.ts` (copy
   `example.service.ts`). Export typed functions that call `apiRequest` and
   translate between the backend's shape and whatever the form needs.
2. **Form component**: create `src/forms/<form-name>/<FormName>.tsx` (copy
   `src/forms/example/ExampleForm.tsx`). Use `useFormState` for values/errors/
   status, `FormField` for each input row, and `FormStatusBanner` for
   submit feedback.
3. Wire the form's `onSubmit` to the service function you created in step 1.

## `useFormState` contract

```ts
const { values, errors, status, submitError, handleChange, setFieldValue, handleSubmit } =
  useFormState<MyValues>({
    initialValues: { ... },
    validate: (values) => ({ /* field: message, only for invalid fields */ }),
    onSubmit: async (values) => { await myService.create(values) },
  })
```

- `status` is `'idle' | 'submitting' | 'success' | 'error'`.
- `validate` is optional; when it returns any field errors, `onSubmit` is not called.
- `handleChange` is a generic `onChange` for `<input>`/`<select>`/`<textarea>` keyed by `name`.
- `submitError` holds the message from a thrown `ApiError` (or any thrown `Error`) when `status === 'error'`.

## Known backend constraints (ApiAstil)

- No CORS policy is configured yet - forms cannot successfully call the real
  API from the browser until that's added on the backend.
- No authentication is wired up yet.
- Response shapes are inconsistent between endpoints; `apiRequest` normalizes
  only the *error* path into `ApiError` - each service still needs to know
  its own endpoint's success shape.
