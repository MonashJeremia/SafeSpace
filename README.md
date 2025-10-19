# SafeSpace

A comprehensive mental health and wellbeing platform designed for youth, advisors, and administrators. Built with Vue 3, Firebase, and Express.js.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Security](#security)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

### For Youth Users
- **Journal Log**: Track mood, thoughts, and daily reflections
- **Wellness Calendar**: Plan and monitor wellbeing activities
- **Interactive Tools**: AI-powered daily challenges using Gemini API
- **Daily Positivity**: Send kindness messages with streak tracking (per-user)
- **Mindful Resources**: Access curated mental health content
- **Help Now**: Quick access to crisis hotlines and resources

### For Advisors
- **Teaching Resources**: Curated materials for supporting students
- **Guidelines**: Best practices for mental health support

### For Administrators
- **Admin Dashboard**: 
  - User analytics (youth/advisor/admin breakdown)
  - Journal entry statistics and mood trends
  - Donation tracking and reports
- **User Management**: View and manage all registered users

### General Features
- **Secure Authentication**: Firebase Auth with Firestore user profiles
- **Donation System**: Support the platform with email receipts
- **Email Integration**: Resend API for transactional emails
- **File Attachments**: Upload images/PDFs in positivity messages
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Tech Stack

### Frontend
- **Vue 3** (Composition API with `<script setup>`)
- **Vue Router** (with role-based route guards)
- **Bootstrap 5** (responsive design)
- **PrimeVue** (UI components)
- **Axios** (HTTP client)

### Backend
- **Express.js 5.1.0** (REST API server)
- **Multer 2.0.2** (file upload handling)
- **Resend 6.1.2** (email service)

### Database & Auth
- **Firebase Authentication** (user auth)
- **Cloud Firestore** (user profiles, donations, streaks)
- **Firestore Security Rules** (role-based access control)

### AI Integration
- **Google Gemini 2.0-flash-001** (daily challenge generation)

### Development
- **Vite** (build tool)
- **ESLint** (code linting)
- **Firebase CLI** (deployment)

## Architecture

### Authentication Flow
1. User signs up → Firebase Auth creates credentials
2. User profile saved to Firestore `users/{uid}` collection
3. Login fetches profile from Firestore and updates local auth state
4. Auth state managed centrally via `authService.js`

### Data Storage Strategy
- **User Profiles**: Firestore (server-side, secure)
- **Daily Positivity Streaks**: Firestore per-user (authenticated) or localStorage (guests)
- **Journal Entries**: localStorage (client-side for privacy)
- **Donations**: Firestore (immutable records)

### Security Model
- Input sanitization (`src/utils/security.js`)
- XSS protection (no `v-html` with user input)
- Firestore rules enforce user-level access control
- Server-side file validation (5MB limit, type checking)

See [SECURITY.MD](./SECURITY.MD) for detailed security documentation.

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase account with project created
- Resend API key

### 1. Clone the Repository

```bash
git clone https://github.com/MonashJeremia/SafeSpace.git
cd SafeSpace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Resend Email API Key
RESEND_API_KEY=re_your_api_key_here

# Optional: API base URL (defaults to http://localhost:3000)
VITE_API_BASE_URL=http://localhost:3000
```

**Important**: Never commit `.env` to Git. It's already in `.gitignore`.

### 4. Firebase Configuration

Update `src/main.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 5. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 6. Run Development Servers

**Terminal 1 - Frontend (Vite dev server):**
```bash
npm run dev
```

**Terminal 2 - Backend (Express API):**
```bash
node server.js
```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (API).

### 7. Create Test Accounts

Sign up with different user types:
- **Youth**: Access journal, calendar, interactive tools
- **Advisor**: Access teaching resources and guidelines
- **Admin**: Full access including admin dashboard

## Security

SafeSpace implements multiple security layers:

### Input Validation & Sanitization
- All form inputs sanitized using `sanitizeInput()` function
- XSS protection via HTML entity escaping
- Email format validation with length limits
- Strong password requirements (8+ chars, mixed case, numbers, symbols)

### Firebase Security
- Firestore rules enforce user-level read/write permissions
- Users can only access their own data
- Admins have read-only access to all user profiles
- Donation records are immutable

### Content Security
- No `v-html` usage with user-generated content
- Vue's automatic output escaping in templates
- File upload validation (type and size)

### Best Practices
- No API keys in client-side code
- Environment variables for sensitive data
- HTTPS recommended for production
- Rate limiting considerations documented

See [SECURITY.MD](./SECURITY.MD) for complete security documentation.

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Initialize Firebase** (if not done):
```bash
firebase init
```
Select Hosting and Firestore when prompted.

4. **Deploy**:
```bash
# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

### Deploy Backend (Express Server)

Deploy `server.js` to your preferred hosting:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo
- **Digital Ocean App Platform**: Connect GitHub repo

Update `VITE_API_BASE_URL` environment variable to point to your deployed backend.

## Project Structure

```
SafeSpace/
├── src/
│   ├── assets/              # Static assets, CSS
│   │   └── accessibility.css
│   ├── components/          # Reusable Vue components
│   │   ├── MainHeader.vue   # Navigation header
│   │   └── RatingComponent.vue
│   ├── config/              # Configuration files
│   │   └── environment.js   # API config
│   ├── json/                # Static data (hotlines, books)
│   ├── router/              # Vue Router config
│   │   └── index.js         # Route definitions + guards
│   ├── services/            # Business logic services
│   │   ├── authService.js   # Firebase auth + Firestore
│   │   ├── emailService.js  # Resend email wrapper
│   │   └── donationEmailService.js
│   ├── utils/               # Utility functions
│   │   └── security.js      # Input sanitization, XSS protection
│   ├── views/               # Page components
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── SignUpView.vue
│   │   ├── AdminDashboardView.vue
│   │   ├── JournalLogView.vue
│   │   ├── CalendarView.vue
│   │   ├── InteractiveToolsView.vue
│   │   └── guides/          # Guide pages
│   │       ├── DailyPositivityView.vue
│   │       ├── WellbeingMapView.vue
│   │       └── ...
│   ├── App.vue              # Root component
│   └── main.js              # App entry point + Firebase init
├── server.js                # Express API server
├── firestore.rules          # Firestore security rules
├── firebase.json            # Firebase config
├── package.json             # Dependencies
├── vite.config.js           # Vite config
├── SECURITY.MD              # Security documentation
├── FIREBASE_MIGRATION.md    # Migration guide
└── README.md                # This file
```

## Contributing

### Development Workflow

1. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and test locally**:
```bash
npm run dev
node server.js
```

3. **Follow code style**:
   - Use Vue 3 Composition API with `<script setup>`
   - Add JSDoc comments for functions
   - Use semantic HTML and ARIA attributes
   - Sanitize all user inputs

4. **Commit with clear messages**:
```bash
git commit -m "feat: add user profile editing"
git commit -m "fix: resolve streak calculation bug"
git commit -m "docs: update API documentation"
```

5. **Push and create pull request**:
```bash
git push origin feature/your-feature-name
```

### Code Standards

- **Security First**: Always sanitize user inputs
- **Accessibility**: Include ARIA labels and keyboard navigation
- **Comments**: Explain logic, not obvious syntax
- **Error Handling**: Use try-catch and provide user feedback
- **Responsive Design**: Test on mobile and desktop

### Testing Checklist

- [ ] Test with all three user roles (youth/advisor/admin)
- [ ] Verify form validation and error messages
- [ ] Test file uploads (size/type limits)
- [ ] Check keyboard navigation
- [ ] Test on mobile viewport
- [ ] Verify Firebase rules are working
- [ ] Check for XSS vulnerabilities

## License

FIT5032 Assignment - Educational purposes

## Acknowledgments

- Firebase for authentication and database
- Resend for email delivery
- Google Gemini for AI-powered features
- Vue.js and Vite communities
- Mental health resources and hotlines

## Support

For issues, questions, or contributions:
- Create an issue in this repository
- Review [SECURITY.MD](./SECURITY.MD) for security concerns
- Check [FIREBASE_MIGRATION.md](./FIREBASE_MIGRATION.md) for migration details

---

**Built with care for mental health awareness and support**
