import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";
import HelpNowView from "../views/HelpNowView.vue";
import InteractiveToolsView from "../views/InteractiveToolsView.vue";
import TeachingResourcesView from "../views/TeachingResourcesView.vue";
import GuidelinesView from "../views/GuidelinesView.vue";
import WellbeingMapView from "../views/guides/WellbeingMapView.vue";
import HealthySleepHabitsView from "../views/guides/HealthySleepHabitsView.vue";
import ManagingStressView from "../views/guides/ManagingStressView.vue";
import DailyPositivityView from "../views/guides/DailyPositivityView.vue";
import MindfulReadingView from "../views/guides/MindfulReadingView.vue";
import JournalLogView from "../views/JournalLogView.vue";
import AdminDashboardView from "../views/AdminDashboardView.vue";
import AboutUsView from "../views/AboutUsView.vue";
import DonationStatisticsView from "../views/DonationStatisticsView.vue";
import { auth } from "../main.js";
import { authState } from "../services/authService.js";
import DonateNowView from "@/views/DonateNowView.vue";
import CalendarView from "@/views/CalendarView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      requiresGuest: true, // Only accessible when not logged in
    },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUpView,
    meta: {
      requiresGuest: true, // Only accessible when not logged in
    },
  },
  {
    path: "/help-now",
    name: "HelpNow",
    component: HelpNowView,
  },
  {
    path: "/interactive-tools",
    name: "InteractiveTools",
    component: InteractiveToolsView,
  },
  {
    path: "/teaching-resources",
    name: "TeachingResources",
    component: TeachingResourcesView,
  },
  {
    path: "/guidelines",
    name: "Guidelines",
    component: GuidelinesView,
  },
  {
    path: "/guides/wellbeing-map",
    name: "WellbeingMap",
    component: WellbeingMapView,
  },
  {
    path: "/guides/healthy-sleep-habits",
    name: "HealthySleepHabits",
    component: HealthySleepHabitsView,
  },
  {
    path: "/guides/managing-stress",
    name: "ManagingStress",
    component: ManagingStressView,
  },
  {
    path: "/guides/daily-positivity",
    name: "DailyPositivity",
    component: DailyPositivityView,
  },
  {
    path: "/guides/mindful-reading",
    name: "MindfulReading",
    component: MindfulReadingView,
  },
  {
    path: "/journal-log",
    name: "JournalLog",
    component: JournalLogView,
  },
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: AdminDashboardView,
    meta: {
      requiresAuth: true,
      requiresRole: 'admin'
    },
  },
  {
    path: "/DonateNow",
    name: "DonateNow",
    component: DonateNowView,
  },
  {
    path: "/about-us",
    name: "AboutUs",
    component: AboutUsView,
  },
  {
    path: "/donation-statistics",
    name: "DonationStatistics",
    component: DonationStatisticsView,
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: CalendarView,
    meta: {
      requiresAuth: true,
      requiresRole: 'youth'
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  // Try to use local auth first, fall back to Firebase
  const localAuth = authState.isAuthenticated;
  const firebaseAuth = auth.currentUser !== null;
  const isAuthenticated = localAuth || firebaseAuth;
  
  // Get user from appropriate source
  let currentUser = null;
  if (localAuth) {
    currentUser = authState.currentUser;
  } else if (firebaseAuth) {
    // Try to get user profile from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('safespace_users') || '[]');
    const userProfile = storedUsers.find(u => u.email.toLowerCase() === auth.currentUser.email.toLowerCase());
    currentUser = userProfile;
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login page with return path
    next({
      path: "/login",
      query: {
        redirect: to.fullPath,
        message: "Please log in to access this page.",
      },
    });
    return;
  }

  // Check if route requires specific role
  if (to.meta.requiresRole && isAuthenticated) {
    const requiredRole = to.meta.requiresRole;
    if (!currentUser || currentUser.userType !== requiredRole) {
      // Redirect to home with error message
      next({
        path: "/",
        query: {
          message: `Access denied. This page is only available to ${requiredRole} users.`,
        },
      });
      return;
    }
  }

  // Check if route requires guest (not logged in)
  if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect authenticated users away from login/signup pages
    next({ path: "/" });
    return;
  }

  // Allow navigation
  next();
});

export default router;
