export const env = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:4000',

  routes: {
    login: process.env.LOGIN_PATH || '/login',
    register: process.env.REGISTER_PATH || '/register',
    jobs: process.env.JOBS_PATH || '/jobs',
    candidateDashboard:
      process.env.CANDIDATE_DASHBOARD_PATH || '/candidate/dashboard',
  },

  users: {
    candidate: {
      email: process.env.CANDIDATE_EMAIL || 'candidate.test@example.com',
      password: process.env.CANDIDATE_PASSWORD || 'Secret123!',
    },
    recruiter: {
      email: process.env.RECRUITER_EMAIL || 'recruiter.test@example.com',
      password: process.env.RECRUITER_PASSWORD || 'Secret123!',
    },
    admin: {
      email: process.env.ADMIN_EMAIL || 'admin.test@example.com',
      password: process.env.ADMIN_PASSWORD || 'Secret123!',
    },
    invalid: {
      email: process.env.INVALID_EMAIL || 'wrong-email',
      password: process.env.INVALID_PASSWORD || 'wrong-password',
    },
  },

  search: {
    keyword: process.env.SEARCH_KEYWORD || 'developer',
    location: process.env.SEARCH_LOCATION || 'Ha Noi',
  },
};