// ─────────────────────────────────────────────────────────────────────────────
// fields/TextField.tsx
// Renders a single TEXT field using MUI TextField + RHF Controller.
//
// Design decision: validation rules are derived entirely from FieldConfig so
// the JSON schema is the single source of truth for constraints.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { Controller, type RegisterOptions } from 'react-hook-form';
import MuiTextField from '@mui/material/TextField';
import { type BaseFieldProps, type TextFieldConfig, type FormValues } from '@/types/form.types';

type Props = BaseFieldProps<TextFieldConfig>;

export default function TextField({ config, control, errors }: Props) {
  const fieldKey = String(config.id);

  // Build RHF validation rules from the JSON config — no hard-coded rules
  const rules: RegisterOptions<FormValues, string> = {
    ...(config.required && {
      required: `${config.name} is required`,
    }),
    ...(config.minLength !== undefined && {
      minLength: {
        value:   config.minLength,
        message: `${config.name} must be at least ${config.minLength} character(s)`,
      },
    }),
    ...(config.maxLength !== undefined && {
      maxLength: {
        value:   config.maxLength,
        message: `${config.name} must be at most ${config.maxLength} character(s)`,
      },
    }),
  };

  const errorMessage = errors[fieldKey]?.message as string | undefined;

  return (
    <Controller
      name={fieldKey}
      control={control}
      rules={rules}
      render={({ field }) => (
        <MuiTextField
          {...field}
          label={config.name}
          required={config.required}
          error={!!errors[fieldKey]}
          helperText={errorMessage ?? ' '}   // ' ' preserves layout height
          fullWidth
          variant="outlined"
          size="medium"
          inputProps={{
            maxLength: config.maxLength,    // native HTML guard as second layer
          }}
        />
      )}
    />
  );
}
