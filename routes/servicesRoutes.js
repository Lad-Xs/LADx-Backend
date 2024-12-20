const express = require('express');
const csrf = require('csurf');
const { Login, SignUp, verifyOTP, Logout } = require('../controllers/auth');
const { UpdateProfilePhoto, upload } = require('../controllers/profilePhoto');
const { UpdateProfile, GetUserProfile } = require('../controllers/profile');
const { verifyTokenFromCookie } = require('../utils/jwt');
const {
  ForgotPassword,
  ResetPassword
} = require('../controllers/forgotPassword');
const { GetProfilePhoto } = require('../controllers/getProfilePhoto');
const {
  UploadKYC,
  identityUpload,
  validateKYC
} = require('../controllers/kyc');
const {
  TravelDetails,
  UpdateTravelDetails
} = require('../controllers/traveller');
const {
  RequestDetails,
  requestItemsImageUpload,
  UpdateRequestDetails
} = require('../controllers/sender');
const { uploadErrorHandler } = require('../utils/multerError');
const { validateUserSignup } = require('../validators/userValidtor');

const router = express.Router();

// Middleware for CSRF protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV == 'production' ? true : false,
    sameSite: 'Strict' // Prevent CSRF attacks
  }
});

router.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.post('/signup', validateUserSignup, SignUp);
router.post('/verify-otp', verifyOTP);

//Use multer to handle multipart/form-data requests.
router.post('/login', upload.none(), Login);

router.post('/logout', Logout);
router.post('/forgot-password', ForgotPassword);
router.put('/reset-password', ResetPassword);

// Handling Image Upload in Request
router.put(
  '/users/profilePhoto',
  verifyTokenFromCookie,
  upload.single('profilePic'),
  uploadErrorHandler,
  UpdateProfilePhoto
);

// Get User profile
router.get('/users/profile', verifyTokenFromCookie, GetUserProfile);

// Get Profile Photo
router.get('/users/profilePhoto', verifyTokenFromCookie, GetProfilePhoto);

// Use multer to handle multipart/form-data requests.
router.put(
  '/users/profile',
  verifyTokenFromCookie,
  upload.none(),
  csrfProtection,
  UpdateProfile
);

// KYC upload route
router.post(
  '/kyc',
  verifyTokenFromCookie,
  identityUpload.single('identity'),
  uploadErrorHandler,
  validateKYC,
  UploadKYC
);

// Create traveller's details route
router.post('/users/travel-details', verifyTokenFromCookie, TravelDetails);

// Update traveller's request details route
router.put('/users/travel-details', verifyTokenFromCookie, UpdateTravelDetails);

// Create senders request details route
router.post(
  '/users/request-details',
  verifyTokenFromCookie,
  requestItemsImageUpload, // Handles multiple images
  uploadErrorHandler,
  RequestDetails
);

// Update sender's request details route
router.put(
  '/users/request-details',
  verifyTokenFromCookie,
  requestItemsImageUpload,
  UpdateRequestDetails
);

module.exports = router;
