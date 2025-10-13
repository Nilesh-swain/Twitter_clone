# TODO: Remove OTP Verification and Direct Signup to Home

## Backend Changes
- [x] Modify `Backend/controller/auth.controller.js` - SignUp function: Set `isVerified: true`, remove OTP generation and email sending.

## Frontend Changes
- [x] Modify `Frontend/src/pages/auth/signup/SignUpPage.jsx` - After signup, directly login and navigate to "/".
- [x] Modify `Frontend/src/App.jsx` - Remove the `/verify-otp` route.
- [ ] Delete `Frontend/src/pages/auth/VerifyOTPPage.jsx` (optional, but since not used).

## Testing
- [ ] Test signup flow: Signup should create verified user, login automatically, redirect to home.
- [ ] Test login: Should still require verification (but all signups are verified).
- [ ] Ensure no broken links or references to verify-otp.
