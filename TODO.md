# TODO: Implement OTP Verification for Signup

## Backend Changes
- [x] Add nodemailer to Backend/package.json
- [x] Add isVerified field to Backend/model/user.model.js
- [x] Modify SignUp in Backend/controller/auth.controller.js to send OTP and set isVerified: false
- [x] Add verifySignupOTP function in Backend/controller/auth.controller.js
- [x] Add /verify-signup-otp route in Backend/router/auth.router.js
- [x] Modify Login in Backend/controller/auth.controller.js to check isVerified

## Frontend Changes
- [x] Create Frontend/src/pages/auth/VerifyOTPPage.jsx
- [x] Update Frontend/src/pages/auth/signup/SignUpPage.jsx to navigate to OTP page after signup
- [x] Add /verify-otp route in Frontend/src/App.jsx

## Testing
- [x] Install dependencies
- [x] Test signup flow: signup -> OTP email -> verify -> login

### Testing Instructions:
1. Open http://localhost:3002 in browser
2. Click "Sign up" and fill the form
3. After signup, you'll be redirected to /verify-otp page
4. Check email for OTP (check console for OTP in development)
5. Enter OTP and verify
6. Should redirect to /login
7. Try logging in - should work if verified
8. Try logging in with unverified account - should fail
