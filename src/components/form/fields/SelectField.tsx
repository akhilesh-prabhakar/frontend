// ─────────────────────────────────────────────────────────────────────────────
// fields/SelectField.tsx
// Renders a LIST field using MUI Select + RHF Controller.
//
// Design decision: MUI Select doesn't work with RHF's register() because it
// uses a synthetic onChange. Controller bridges this gap by providing a
// render prop that receives RHF's { field } with correct onChange/onBlur.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { Controller, type RegisterOptions } from 'react-hook-form';
import FormControl        from '@mui/material/FormControl';
import FormHelperText     from '@mui/material/FormHelperText';
import InputLabel         from '@mui/material/InputLabel';
import Select             from '@mui/material/Select';
import MenuItem           from '@mui/material/MenuItem';
import { type BaseFieldProps, type ListFieldConfig, type FormValues } from '@/types/form.types';

type Props = BaseFieldProps<ListFieldConfig>;

export default function SelectField({ config, control, errors }: Props) {
  const fieldKey    = String(config.id);
  const labelId     = `select-label-${fieldKey}`;
  const errorMessage = errors[fieldKey]?.message as string | undefined;

  const rules: RegisterOptions<FormValues, string> = {
    ...(config.required && {
      required: `${config.name} is required`,
    }),
  };

  return (
    <Controller
      name={fieldKey}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors[fieldKey]}>
          <InputLabel id={labelId} required={config.required}>
            {config.name}
          </InputLabel>

          <Select
            {...field}
            labelId={labelId}
            label={config.name}
          >
            {config.listOfValues1.map((option, index) => (
              // Using index as value mirrors the JSON defaultValue pattern ("1", "2" …)
              <MenuItem key={option} value={String(index)}>
                {option}
              </MenuItem>
            ))}
          </Select>

          {/* Always render helperText so layout height stays consistent */}
          <FormHelperText>{errorMessage ?? ' '}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
