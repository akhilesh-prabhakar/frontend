import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        py: 10,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h3" fontWeight={800}>
            Inventory + Orders, Simplified
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A clean microservices backend with a focused admin UI for products and
            orders.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              size="large"
            >
              Sign In
            </Button>
            <Button
              component={Link}
              href="/signup"
              variant="outlined"
              size="large"
            >
              Sign Up
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
