"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuth } from "@/components/AuthProvider";
import { getApiErrorMessage } from "@/lib/error";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const next = searchParams.get("next") || "/dashboard";

  const validate = () => {
    const nextErrors: { email?: string; password?: string } = {};
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (!form.password) {
      nextErrors.password = "Password is required";
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!validate()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await login(form);
      router.replace(next);
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "#f8fafc",
        py: { xs: 6, md: 10 },
        px: 2,
        backgroundImage:
          "radial-gradient(circle at 12% 15%, rgba(20, 184, 166, 0.22), transparent 35%), radial-gradient(circle at 85% 10%, rgba(249, 115, 22, 0.18), transparent 35%), linear-gradient(135deg, #fef3c7 0%, #f0fdfa 55%, #f8fafc 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "100%",
                borderRadius: 4,
                p: { xs: 3, sm: 4 },
                bgcolor: "#0f172a",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at top right, rgba(20, 184, 166, 0.5), transparent 60%)",
                  opacity: 0.9,
                }}
              />
              <Stack spacing={3} sx={{ position: "relative" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.12)",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                    }}
                  >
                    IO
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Inventory Ops
                  </Typography>
                </Stack>
                <Typography variant="h3">
                  Keep orders moving, even on peak days.
                </Typography>
                <Typography variant="body1" color="rgba(226,232,240,0.9)">
                  Log in to monitor inventory velocity, approve urgent orders,
                  and stay ahead of fulfillment risks.
                </Typography>
                <Stack spacing={2}>
                  {[
                    "Live order routing and alerts",
                    "Role-based views for every team",
                    "Audit-ready activity trail",
                  ].map((item) => (
                    <Stack key={item} direction="row" spacing={2}>
                      <Box
                        sx={{
                          width: 2,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: "#14b8a6",
                          mt: 0.9,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="rgba(226,232,240,0.85)"
                      >
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.3)" }} />
                <Stack direction="row" spacing={4}>
                  {[
                    { label: "Active alerts", value: "24" },
                    { label: "Pending orders", value: "18" },
                  ].map((item) => (
                    <Box key={item.label}>
                      <Typography variant="h4">{item.value}</Typography>
                      <Typography
                        variant="caption"
                        color="rgba(226,232,240,0.7)"
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid rgba(148, 163, 184, 0.4)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label="Secure sign in"
                      color="secondary"
                      size="small"
                    />
                    <Chip label="Ops ready" size="small" />
                  </Stack>
                  <Typography variant="h4" fontWeight={700}>
                    Welcome back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in to continue managing inventory and orders.
                  </Typography>
                </Stack>

                {error && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      fullWidth
                      required
                      error={Boolean(fieldErrors.email)}
                      helperText={fieldErrors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlineIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      fullWidth
                      required
                      error={Boolean(fieldErrors.password)}
                      helperText={fieldErrors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      disabled={isSubmitting}
                      sx={{
                        py: 1.4,
                        boxShadow: "0 16px 35px rgba(15, 118, 110, 0.25)",
                      }}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => router.push("/signup")}
                    >
                      Need an account? Sign Up
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
