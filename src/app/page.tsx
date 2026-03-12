import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const heroImage = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="720" height="520" viewBox="0 0 720 520">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <linearGradient id="a" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="#14b8a6"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>
    <rect width="720" height="520" rx="32" fill="url(#g)"/>
    <circle cx="120" cy="110" r="70" fill="#14b8a6" opacity="0.35"/>
    <circle cx="610" cy="80" r="90" fill="#f97316" opacity="0.3"/>
    <rect x="90" y="170" width="540" height="40" rx="16" fill="#0ea5e9" opacity="0.3"/>
    <rect x="90" y="235" width="420" height="16" rx="8" fill="#e2e8f0" opacity="0.5"/>
    <rect x="90" y="270" width="340" height="16" rx="8" fill="#e2e8f0" opacity="0.35"/>
    <rect x="90" y="330" width="540" height="120" rx="20" fill="#0b1324"/>
    <rect x="120" y="360" width="200" height="16" rx="8" fill="url(#a)"/>
    <rect x="120" y="392" width="300" height="12" rx="6" fill="#94a3b8" opacity="0.5"/>
    <rect x="120" y="414" width="260" height="12" rx="6" fill="#94a3b8" opacity="0.35"/>
    <rect x="420" y="360" width="170" height="58" rx="14" fill="#14b8a6" opacity="0.6"/>
  </svg>
`);

const heroImageSrc = `data:image/svg+xml;utf8,${heroImage}`;

const highlights = [
  {
    title: "Live inventory health",
    description: "Instantly see stock levels, reorder points, and SKU movement.",
  },
  {
    title: "Order flow clarity",
    description: "Track every order stage with clean audit trails and alerts.",
  },
  {
    title: "Secure operations",
    description: "Role-based access with consistent logging for every change.",
  },
];

export default function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        py: { xs: 8, md: 12 },
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(20, 184, 166, 0.18), transparent 35%), radial-gradient(circle at 85% 12%, rgba(56, 189, 248, 0.2), transparent 35%), linear-gradient(135deg, #fff 0%, #f8fafc 60%, #f1f5f9 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography variant="overline" color="text.secondary">
                Inventory + Orders, reimagined
              </Typography>
              <Typography variant="h2" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                Run operations with calm, real-time clarity.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                A modern microservices admin UI to manage products, orders, and
                stock movement without the noise.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/signup"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    boxShadow: "0 16px 35px rgba(15, 118, 110, 0.25)",
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="large"
                  sx={{ px: 4 }}
                >
                  Sign In
                </Button>
              </Stack>
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    2.9k
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active SKUs
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    99.2%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Stock accuracy
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    14 min
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg. order cycle
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid rgba(148, 163, 184, 0.35)",
                bgcolor: "#fff",
                boxShadow: "0 24px 60px rgba(15, 23, 42, 0.15)",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={heroImageSrc}
                alt="Inventory operations dashboard preview"
                sx={{ width: "100%", height: "auto", display: "block" }}
              />
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 6, md: 8 } }} />

        <Grid container spacing={3}>
          {highlights.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid rgba(148, 163, 184, 0.35)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
