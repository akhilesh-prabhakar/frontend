// ─────────────────────────────────────────────────────────────────────────────
// SubmitButton.tsx
// Submit button with loading state and optional reset action.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import Box            from '@mui/material/Box';
import Button         from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface SubmitButtonProps {
  isSubmitting: boolean;
  onReset:      () => void;
}

export default function SubmitButton({ isSubmitting, onReset }: SubmitButtonProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
      {/* Reset clears the form and localStorage */}
      <Button
        type="button"
        variant="outlined"
        color="secondary"
        onClick={onReset}
        disabled={isSubmitting}
        fullWidth
        sx={{ py: 1.5 }}
      >
        Reset
      </Button>

      {/* Submit is disabled during submission to prevent double-fire */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        fullWidth
        sx={{ py: 1.5, position: 'relative' }}
      >
        {isSubmitting ? (
          <>
            Submitting…
            <CircularProgress
              size={18}
              sx={{
                position: 'absolute',
                right:    14,
                top:      '50%',
                mt:       '-9px',
                color:    'inherit',
              }}
            />
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </Box>
  );
}
