// ─────────────────────────────────────────────────────────────────────────────
// DynamicField.tsx
// Routes a FieldConfig to the correct leaf component via a registry pattern.
//
// HOW TO ADD A NEW FIELD TYPE — 3 steps:
//   1. Add the type to FieldType enum in form.types.ts
//   2. Create src/components/form/fields/YourField.tsx
//   3. Add an entry to FIELD_REGISTRY below — nothing else needs to change.
//
// Design decision: a registry object (FIELD_REGISTRY) is used instead of a
// switch statement so the routing logic is data-driven and easy to extend
// without touching control flow.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import React                        from 'react';
import Alert                        from '@mui/material/Alert';
import {
  FieldType,
  type FieldConfig,
  type TextFieldConfig,
  type ListFieldConfig,
  type RadioFieldConfig,
  type FormValues,
} from '@/types/form.types';
import type { Control, FieldErrors } from 'react-hook-form';

import TextField   from './fields/TextField';
import SelectField from './fields/SelectField';
import RadioField  from './fields/RadioField';

// ── Field registry ────────────────────────────────────────────────────────────
// Maps each FieldType to its render function.
// Each entry is typed with the narrowest config interface for full type-safety.
const FIELD_REGISTRY: {
  [K in FieldType]: (
    config: Extract<FieldConfig, { fieldType: K }>,
    control: Control<FormValues>,
    errors:  FieldErrors<FormValues>,
  ) => React.ReactElement;
} = {
  [FieldType.TEXT]: (config, control, errors) => (
    <TextField
      config={config as TextFieldConfig}
      control={control}
      errors={errors}
    />
  ),
  [FieldType.LIST]: (config, control, errors) => (
    <SelectField
      config={config as ListFieldConfig}
      control={control}
      errors={errors}
    />
  ),
  [FieldType.RADIO]: (config, control, errors) => (
    <RadioField
      config={config as RadioFieldConfig}
      control={control}
      errors={errors}
    />
  ),
};

// ── Component props ───────────────────────────────────────────────────────────
interface DynamicFieldProps {
  config:  FieldConfig;
  control: Control<FormValues>;
  errors:  FieldErrors<FormValues>;
}

// ── DynamicField ──────────────────────────────────────────────────────────────
export default function DynamicField({ config, control, errors }: DynamicFieldProps) {
  const renderer = FIELD_REGISTRY[config.fieldType as FieldType];

  // Graceful fallback: unknown fieldType renders an informative warning
  // instead of throwing, so a new config entry never crashes the app.
  if (!renderer) {
    return (
      <Alert severity="warning" sx={{ width: '100%' }}>
        Unknown field type: <strong>&quot;{config.fieldType}&quot;</strong> (field id: {config.id}).
        Add a renderer to <code>FIELD_REGISTRY</code> in DynamicField.tsx to support it.
      </Alert>
    );
  }

  return renderer(
    config as Extract<FieldConfig, { fieldType: typeof config.fieldType }>,
    control,
    errors,
  );
}
