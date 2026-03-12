// ─────────────────────────────────────────────────────────────────────────────
// form.types.ts
// Central type definitions for the JSON-driven dynamic form system.
//
// Design decision: all field-level validation metadata lives in FieldConfig so
// components never need to hard-code rules — they derive rules from the config.
// ─────────────────────────────────────────────────────────────────────────────

// ── Supported field types ────────────────────────────────────────────────────
// To add a new type:
//   1. Add it to this enum  →  e.g.  TEXTAREA = 'TEXTAREA'
//   2. Add a FieldConfig variant below (if it needs unique fields)
//   3. Create src/components/form/fields/TextareaField.tsx
//   4. Register it in DynamicField.tsx's FIELD_REGISTRY
export enum FieldType {
  TEXT  = 'TEXT',
  LIST  = 'LIST',
  RADIO = 'RADIO',
}

// ── Base fields shared by every field type ───────────────────────────────────
interface BaseFieldConfig {
  id:           number;
  name:         string;
  fieldType:    FieldType | string;   // string allows unknown types for graceful fallback
  required?:    boolean;
  defaultValue?: string;
}

// ── TEXT field ───────────────────────────────────────────────────────────────
export interface TextFieldConfig extends BaseFieldConfig {
  fieldType:  FieldType.TEXT;
  minLength?: number;
  maxLength?: number;
}

// ── LIST field (Select / Dropdown) ───────────────────────────────────────────
export interface ListFieldConfig extends BaseFieldConfig {
  fieldType:     FieldType.LIST;
  listOfValues1: string[];
}

// ── RADIO field ──────────────────────────────────────────────────────────────
export interface RadioFieldConfig extends BaseFieldConfig {
  fieldType:     FieldType.RADIO;
  listOfValues1: string[];
}

// ── Unknown field (graceful fallback) ────────────────────────────────────────
export interface UnknownFieldConfig extends BaseFieldConfig {
  fieldType: string;
}

// ── Discriminated union — exhaustive switch on fieldType is type-safe ────────
export type FieldConfig =
  | TextFieldConfig
  | ListFieldConfig
  | RadioFieldConfig
  | UnknownFieldConfig;

// ── Top-level JSON schema shape ──────────────────────────────────────────────
export interface FormSchema {
  data: FieldConfig[];
}

// ── The shape of the form's value object (keyed by field id as string) ───────
// Using Record instead of `any` keeps things strict while staying flexible
// for dynamic keys we can't enumerate at compile time.
export type FormValues = Record<string, string>;

// ── Props shared by every leaf field component ───────────────────────────────
// Each leaf receives the RHF control + its specific config slice.
export interface BaseFieldProps<T extends BaseFieldConfig> {
  config:  T;
  control: import('react-hook-form').Control<FormValues>;
  errors:  import('react-hook-form').FieldErrors<FormValues>;
}
