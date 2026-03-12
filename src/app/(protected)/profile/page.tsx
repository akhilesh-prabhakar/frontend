"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { authApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/error";
import { useAuth } from "@/components/AuthProvider";
import type { UserProfile } from "@/types/api.types";

type ProfileForm = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await authApi.profile();
        setProfile(data);
        setForm((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
        }));
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load profile"));
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email");
      return;
    }

    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password && form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    const payload: { name?: string; email?: string; password?: string } = {
      name: form.name.trim(),
      email: form.email.trim(),
    };
    if (form.password) {
      payload.password = form.password;
    }

    try {
      setSaving(true);
      const response = await authApi.updateProfile(payload);
      updateUser(
        { userId: response.userId, name: response.name, email: response.email },
        response.token,
      );
      setSuccess("Profile updated");
      setForm((prev) => ({ ...prev, password: "", confirm: "" }));
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account details and update your password.
        </Typography>
      </Stack>

      <Card sx={{ borderRadius: 3, border: "1px solid rgba(148, 163, 184, 0.35)" }}>
        <CardContent>
          {loading ? (
            <Typography color="text.secondary">Loading profile...</Typography>
          ) : (
            <Stack spacing={3}>
              {error && <Typography color="error">{error}</Typography>}
              {success && <Typography color="success.main">{success}</Typography>}
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  fullWidth
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  fullWidth
                  required
                />
              </Stack>

              <Divider />

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="New Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  fullWidth
                  placeholder="Leave blank to keep current password"
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm((prev) => ({ ...prev, confirm: e.target.value }))}
                  fullWidth
                />
              </Stack>

              {profile && (
                <Typography variant="caption" color="text.secondary">
                  Created {profile.createdAt ?? "N/A"} · Updated {profile.updatedAt ?? "N/A"}
                </Typography>
              )}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
