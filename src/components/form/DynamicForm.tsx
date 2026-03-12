// ─────────────────────────────────────────────────────────────────────────────
// DynamicForm.tsx
// Orchestrator component for the JSON-driven form system.
//
// Responsibilities:
//  - Reads the JSON config and builds RHF defaultValues dynamically
//  - Pre-fills from localStorage on first render (persisted submission)
//  - Owns the single useForm() call — control flows down, never up
//  - Handles submit: persists to localStorage, shows success + JSON preview
//  - Handles reset: clears RHF state and removes localStorage entry
//
// What it does NOT do:
//  - Know anything about individual field types (DynamicField handles routing)
//  - Contain any validation rules (each leaf field derives its own from config)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import formSchema from "@/config/signup-form.json";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { type FormValues } from "@/types/form.types";

import DynamicField from "./DynamicField";
import SubmitButton from "./SubmitButton";

// localStorage key — centralised so reset and read always target the same key
const STORAGE_KEY = "signup_form_data";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

export default function DynamicForm() {
  const {
    storedValue,
    setValue: persistValue,
    remove: clearStorage,
  } = useLocalStorage<FormValues>(STORAGE_KEY, {});

  // ── Build defaultValues from JSON config ─────────────────────────────────
  // Priority: localStorage (persisted previous submission) > JSON defaultValue > ''
  // This runs once; RHF ignores defaultValues changes after first render.
  const defaultValues: FormValues = formSchema.data.reduce<FormValues>(
    (acc, field) => {
      const key = String(field.id);
      acc[key] = storedValue[key] ?? field.defaultValue ?? "";
      return acc;
    },
    {},
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues, mode: "onTouched" });

  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Submit handler ────────────────────────────────────────────────────────
  const onSubmit = useCallback(
    async (values: FormValues) => {
      setSubmitError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/signups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: values }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `Request failed with ${response.status}`);
        }

        persistValue(values);
        setSubmittedData(values);
        setShowSuccess(true);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to submit form.";
        setSubmitError(message);
        setShowSuccess(false);
      }
    },
    [persistValue],
  );

  // ── Reset handler ─────────────────────────────────────────────────────────
  const onReset = useCallback(() => {
    // Rebuild clean defaultValues from JSON only (ignores localStorage)
    const cleanDefaults = formSchema.data.reduce<FormValues>((acc, field) => {
      acc[String(field.id)] = field.defaultValue ?? "";
      return acc;
    }, {});

    reset(cleanDefaults);
    clearStorage();
    setSubmittedData(null);
    setShowSuccess(false);
    setSubmitError(null);
  }, [reset, clearStorage]);

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      {/* ── Error alert ───────────────────────────────────────────────── */}
      <Collapse in={submitError !== null} unmountOnExit>
        <Alert
          severity="error"
          onClose={() => setSubmitError(null)}
          sx={{ borderRadius: 2 }}
        >
          {submitError}
        </Alert>
      </Collapse>

      {/* ── Success alert ───────────────────────────────────────────────── */}
      <Collapse in={showSuccess} unmountOnExit>
        <Alert
          severity="success"
          onClose={() => setShowSuccess(false)}
          sx={{ borderRadius: 2 }}
        >
          Form submitted successfully! Your data has been saved.
        </Alert>
      </Collapse>

      {/* ── Form card ──────────────────────────────────────────────────── */}
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Sign Up
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details below. Fields marked * are required.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* ── handleSubmit runs RHF validation before calling onSubmit ── */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2.5}>
              {/*
               * The form renders entirely from config.
               * Adding a new entry to signup-form.json automatically renders here.
               * DynamicField routes each config item to the correct leaf component.
               */}
              {formSchema.data.map((fieldConfig) => (
                <DynamicField
                  key={fieldConfig.id}
                  config={fieldConfig}
                  control={control}
                  errors={errors}
                />
              ))}

              <SubmitButton isSubmitting={isSubmitting} onReset={onReset} />
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* ── Submitted data JSON preview ─────────────────────────────────── */}
      <Collapse in={submittedData !== null} unmountOnExit>
        <Card elevation={1} sx={{ borderRadius: 3, bgcolor: "grey.50" }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Submission Preview
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 1.5 }}
            >
              This is the data that was persisted to localStorage.
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                bgcolor: "grey.900",
                color: "grey.100",
                borderRadius: 2,
                fontSize: "0.75rem",
                overflowX: "auto",
                lineHeight: 1.6,
              }}
            >
              {JSON.stringify(submittedData, null, 2)}
            </Box>
          </CardContent>
        </Card>
      </Collapse>
    </Stack>
  );
}
