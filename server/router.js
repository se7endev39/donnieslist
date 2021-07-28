const stripe = require('stripe');
const multer = require('multer');
const express = require('express');
const passport = require('passport');
// const bcrypt = require('bcryptjs');

const MainSettings = require('./config/main');
// const passportService = require('./config/passport');

const { ROLE_ADMIN } = require('./constants');
// const ROLE_MEMBER = require('./constants').ROLE_MEMBER;
// const ROLE_CLIENT = require('./constants').ROLE_CLIENT;
// const ROLE_OWNER = require('./constants').ROLE_OWNER;

/* import controllers */
const AuthenticationController = require('./controllers/authentication');
const UserController = require('./controllers/user');
const CommentController = require('./controllers/comment');
const ExpertsController = require('./controllers/experts');
const VideoSessionController = require('./controllers/videosession');
const AudioSessionController = require('./controllers/audiosession');
const ArchiveSessionController = require('./controllers/archivesession');
const ChatController = require('./controllers/chat');
const ExpertChatController = require('./controllers/expertchat');
const CommunicationController = require('./controllers/communication');
const StripeController = require('./controllers/stripe');
const VideoSessionStripeController = require('./controllers/video-session-stripe');
const AdminController = require('./controllers/theAdminController');
// const AdminsUsersList = require('./controllers/getlist')

/** import model */

const User = require('./models/user');
// const VideoSession = require('./models/videosession');

// storage needed for saving images from forms
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './public/uploads');
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
});

// var upload = multer({ storage : storage}).array('ProfileImage',2);
const upload = multer({ storage }).fields([{ name: 'RelatedImages1', maxCount: 1 }]); // upload Midleware

// const saltRounds = 10;
// const salt = bcrypt.genSaltSync(saltRounds);

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  // Initializing route groups
  const apiRoutes = express.Router();
  const authRoutes = express.Router();
  const userRoutes = express.Router();
  const usersOwnRoutes = express.Router();
  const chatRoutes = express.Router();
  const expertChatRoutes = express.Router();
  const payRoutes = express.Router();
  const videoSessionStripeRoutes = express.Router();
  const communicationRoutes = express.Router();

  //= ========================
  // Experts Routes
  //= ========================

  //= ========================
  // Auth Routes
  //= ========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  //= ========================
  // Facebook Routes
  //= ========================
  apiRoutes.post('/auth/login-facebook-user', AuthenticationController.loginFacebookUser);

  apiRoutes.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  apiRoutes.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: '/' }),
    (req, res) => {
      res.redirect(
        `${MainSettings.website_url}/login-social/?facebook_token=${req.user.jwtLoginAccessToken}`
      );
    }
  );

  apiRoutes.post('/auth/facebook-send-jwt-token', AuthenticationController.facebookSendJWTtoken);

  //= ========================
  // Twitter Routes
  //= ========================

  apiRoutes.get('/auth/twitter', passport.authenticate('twitter'));

  apiRoutes.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', { session: false, failureRedirect: '/' }),
    (req, res) => {
      res.redirect(
        `http://localhost:5000/login-social/?twitter_token=${req.user.jwtLoginAccessToken}`
      );
    }
  );

  apiRoutes.get('/test-stripe-payment', (req, res) => {
    stripe('sk_test_08cuSozBbGN2QPnpieyjxomZ');
    res.redirect('');
  });

  apiRoutes.post('/auth/twitter-send-jwt-token', AuthenticationController.twitterSendJWTtoken);

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // Logout route
  authRoutes.post('/logout/:userId', AuthenticationController.logout);

  // Password reset request route (generate/send token)
  authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

  // Password reset route (change password using token)
  authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);
  authRoutes.post('/change-password', AuthenticationController.changePassword);
  // Signup link for expert
  authRoutes.post(
    '/signupExpertSendSignupLink',
    AuthenticationController.signupExpertSendSignupLink
  );

  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);
  apiRoutes.use('/myuserprofile', usersOwnRoutes);

  // View user profile route
  userRoutes.get('/:userId', requireAuth, UserController.viewProfile);
  userRoutes.get('/getUserReviews/:userEmail', UserController.getUserReviews);
  userRoutes.post('/add-account-info', UserController.addAccountInfo);
  userRoutes.post('/fetch-account-info', UserController.FetchAccountInfo);
  // userRoutes.post('/add-account-info', UserController.addAccountInfo);

  // Test protected route
  apiRoutes.get('/protected', requireAuth, (req, res) => {
    res.send({ content: 'The protected test route is functional!' });
  });

  apiRoutes.get(
    '/admins-only',
    requireAuth,
    AuthenticationController.roleAuthorization(ROLE_ADMIN),
    (req, res) => {
      res.send({ content: 'Admin dashboard is working.' });
    }
  );

  //= ========================
  // Experts Routes
  //= ========================
  apiRoutes.get('/getExpertsCategoryList', ExpertsController.getExpertsCategoryList);
  apiRoutes.get('/getExpertsSubCategoryList/:category', ExpertsController.getExpertsSubCategoryList);
  apiRoutes.get('/getExpertsListing/:category', ExpertsController.getExpertsListing);
  apiRoutes.get('/getExpertsListingByKeyword/:keyword', ExpertsController.getExpertsListingByKeyword);
  // apiRoutes.get('/getExpertsListingByKeyword', ExpertsController.getExpertsListingByKeyword);
  apiRoutes.get('/getExpertsListing/topRated/:category', ExpertsController.getTopExpertsListing);
  apiRoutes.get('/getExpertDetail/:slug', ExpertsController.getExpertDetail);
  apiRoutes.get('/getExpert/:slug', ExpertsController.getExpert);

  apiRoutes.post('/sendEmailMessageToExpert', ExpertsController.sendEmailMessageToExpert);
  apiRoutes.post('/sendTextMessageToExpert', ExpertsController.sendTextMessageToExpert);
  apiRoutes.post('/createExpert/', ExpertsController.createExpert);

  apiRoutes.post('/saveUserReview/', ExpertsController.saveUserReview);

  apiRoutes.get('/getExpertReviews/:expertSlug', ExpertsController.getExpertReviews);

  apiRoutes.get('/getExpertStories/:expertEmail', ExpertsController.getExpertStories);

  apiRoutes.post('/userExpert/', ExpertsController.userExpert);
  apiRoutes.post('/userExpertUpdate/', ExpertsController.userExpertUpdate);

  apiRoutes.post('/upload/', ExpertsController.upload);
  apiRoutes.get(
    '/getExpertStoriesBasedOnRole/:expertRole',
    ExpertsController.getExpertStoriesBasedOnRole
  );

  apiRoutes.get('/getExpertEmailFromToken:token', ExpertsController.getExpertEmailFromToken);

  apiRoutes.post('/addEndorsements', ExpertsController.addEndorsements);
  apiRoutes.post('/getEndorsements', ExpertsController.getEndorsements);
  apiRoutes.post('/getMyExpertsListing', ExpertsController.getMyExpertsListing);
  //= ========================
  // Session Routes
  //= ========================
  // to be created by expert
  apiRoutes.post('/createVideoSession/', VideoSessionController.createVideoSession);
  // to be joined by user
  apiRoutes.post('/joinVideoSession/', VideoSessionController.joinVideoSession);

  // Audio call session route
  apiRoutes.post('/createAudioSession/', AudioSessionController.createAudioSession);
  apiRoutes.post('/requestForToken', AudioSessionController.requestForToken);

  // recording audio call session route
  apiRoutes.post('/start_recording', ArchiveSessionController.start_recording);
  apiRoutes.get(
    '/stop_recording/:expertEmail/:userEmail/:archiveID',
    ArchiveSessionController.stop_recording
  );
  apiRoutes.post('/getArchiveSessionAndToken', ArchiveSessionController.getArchiveSessionAndToken);
  apiRoutes.post('/send_recording', ArchiveSessionController.send_recording);

  apiRoutes.post('/getExpertRecordings', ArchiveSessionController.getExpertRecordings);
  apiRoutes.post('/playRecordedAudio', ArchiveSessionController.playRecordedAudio);
  apiRoutes.post('/deleteRecordedAudio', ArchiveSessionController.deleteRecordedAudio);

  //= ========================
  // Chat Routes
  //= ========================

  // Set chat routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/chat', chatRoutes);

  // View messages to and from authenticated user
  chatRoutes.get('/', requireAuth, ChatController.getConversations);

  // Retrieve single conversation
  chatRoutes.get('/:conversationId', requireAuth, ChatController.getConversation);

  // Send reply in conversation
  chatRoutes.post('/:conversationId', requireAuth, ChatController.sendReply);

  // Start new conversation
  chatRoutes.post('/new/:recipient', requireAuth, ChatController.newConversation);

  //= ========================
  // Expert-Session Chat Routes
  //= ========================

  // Set chat routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/expertchat', expertChatRoutes);

  // View messages to and from authenticated user
  // expertChatRoutes.get('/', requireAuth, ExpertChatController.getConversations);

  // Retrieve single conversation
  expertChatRoutes.get(
    '/fetchSessionChat/:sessionOwnerUsername/:email',
    requireAuth,
    ExpertChatController.fetchSessionChat
  );

  // Send reply in conversation
  expertChatRoutes.post('/expertsessionchat', requireAuth, ExpertChatController.expertsessionchat);

  // Start new conversation
  // expertChatRoutes.post('/new/:recipient', requireAuth, ExpertChatController.newConversation);

  //= ========================
  // Video Session Stripe Payment Routes
  //= ========================
  apiRoutes.use('/videosession', videoSessionStripeRoutes);

  videoSessionStripeRoutes.post(
    '/recharge-video-session',
    VideoSessionStripeController.rechargeVideoSession
  );
  videoSessionStripeRoutes.post(
    '/add-money-to-wallet',
    VideoSessionStripeController.addMoneyToWallet
  );
  videoSessionStripeRoutes.post(
    '/payment-video-session',
    VideoSessionStripeController.paymentVideoSession
  );

  videoSessionStripeRoutes.post(
    '/check-before-session-start',
    VideoSessionStripeController.checkBeforeSessionStart
  );
  videoSessionStripeRoutes.post(
    '/save-video-session-info',
    VideoSessionStripeController.saveVideoSessionInfo
  );

  videoSessionStripeRoutes.get(
    '/send-expert-invoice',
    VideoSessionStripeController.sendExpertInvoice
  );

  //= ========================
  // Payment Routes
  //= ========================
  apiRoutes.use('/pay', payRoutes);

  // Webhook endpoint for Stripe
  payRoutes.post('/webhook-notify', StripeController.webhook);

  // Create customer and subscription
  payRoutes.post('/customer', requireAuth, StripeController.createSubscription);

  // Update customer object and billing information
  payRoutes.put('/customer', requireAuth, StripeController.updateCustomerBillingInfo);

  // Delete subscription from customer
  payRoutes.delete('/subscription', requireAuth, StripeController.deleteSubscription);

  // Upgrade or downgrade subscription
  payRoutes.put('/subscription', requireAuth, StripeController.changeSubscription);

  // Fetch customer information
  payRoutes.get('/customer', requireAuth, StripeController.getCustomer);

  //= ========================
  // Communication Routes
  //= ========================
  apiRoutes.use('/communication', communicationRoutes);

  // fetch list of all users for admin
  apiRoutes.get('/getUsersList', AdminController.theAdminsUserList);
  apiRoutes.post('/BanHim', AdminController.AdminToBanOrUnBanUser);

  apiRoutes.post('/deleteHim', AdminController.deleteHim);
  // /api/getuserInfo/
  apiRoutes.post('/getuserInfo/:id', AdminController.AdminGetUserInfo);

  // updating the users information
  apiRoutes.post('/UpdateUserInfo', AdminController.UpdateUserInfo);

  // /GetActiveSessions
  apiRoutes.post('/GetActiveSessions', (req, res) => {
    User.aggregate(
      [
        {
          $match: { role: 'Expert', videoSessionAvailability: true }
        },
        {
          $lookup: {
            from: 'videosessions',
            localField: 'email',
            foreignField: 'expertEmail',
            as: 'AggregatedDetails'
          }
        },
        {
          $match: {
            'AggregatedDetails.sessionCompletionStatus': 'UNCOMPLETED',
            'AggregatedDetails.sessionStatus': 'ACTIVE'
          }
        },
        { $sort: { sessionCreationDate: -1 } },
        { $limit: 1 }
      ],
      (err, allUsers) => {
        res.json({ AllUsers: allUsers });
      }
    );
  });
  // fetch my own profile (can be called by all the three)
  usersOwnRoutes.get('/:userId', requireAuth, UserController.viewMyProfile);
  usersOwnRoutes.get('/:userId/:code', requireAuth, UserController.editMyProfileStripeID);

  // relates to profile updation by user itself
  userRoutes.post('/update', UserController.UpdateMyOwnProfile);

  // relates to profilePictureUpdation
  userRoutes.post('/update/profile', upload, UserController.UpdateMyOwnProfilePicture);

  // Send email from contact form
  communicationRoutes.post('/contact', CommunicationController.sendContactForm);

  //= ========================
  // Comment Routes
  //= ========================
  apiRoutes.get('/getComments/:slug', CommentController.getComments);
  apiRoutes.post('/addComment', CommentController.addComment);
  apiRoutes.post('/updateComment', CommentController.updateComment);
  apiRoutes.post('/deleteComment', CommentController.deleteComment);
  apiRoutes.post('/likeComment', CommentController.likeComment);
  apiRoutes.post('/dislikeComment', CommentController.dislikeComment);
  // Set url for API group routes
  app.use('/', apiRoutes);
};
