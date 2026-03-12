// ─────────────────────────────────────────────────────────────────────────────
// fields/RadioField.tsx
// Renders a RADIO field using MUI RadioGroup + RHF Controller.
//
// Design decision: RadioGroup is an uncontrolled MUI component by default.
// Passing `value` and `onChange` from RHF's { field } makes it fully
// controlled and keeps it in sync with the RHF form state.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { Controller, type RegisterOptions } from 'react-hook-form';
import FormControl        from '@mui/material/FormControl';
import FormControlLabel   from '@mui/material/FormControlLabel';
import FormHelperText     from '@mui/material/FormHelperText';
import FormLabel          from '@mui/material/FormLabel';
import Radio              from '@mui/material/Radio';
import RadioGroup         from '@mui/material/RadioGroup';
import { type BaseFieldProps, type RadioFieldConfig, type FormValues } from '@/types/form.types';

type Props = BaseFieldProps<RadioFieldConfig>;

export default function RadioField({ config, control, errors }: Props) {
  const fieldKey     = String(config.id);
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
        <FormControl error={!!errors[fieldKey]} component="fieldset" fullWidth>
          <FormLabel component="legend" required={config.required}>
            {config.name}
          </FormLabel>

          <RadioGroup
            {...field}
            row   // horizontal layout; remove for vertical
          >
            {config.listOfValues1.map((option, index) => (
              <FormControlLabel
                key={option}
                value={String(index)}
                label={option}
                control={<Radio />}
              />
            ))}
          </RadioGroup>

          <FormHelperText>{errorMessage ?? ' '}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
