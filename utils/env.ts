import * as dotenv from 'dotenv';

dotenv.config();

const value = (name: string, fallback: string) => process.env[name] || fallback;

export const env = {
  baseUrl: value('BASE_URL', 'http://localhost:3000'),
  apiUrl: value('API_URL', 'http://localhost:5000'),

  routes: {
    home: value('HOME_PATH', '/'),
    login: value('LOGIN_PATH', '/user/login'),
    forgotPassword: value('FORGOT_PASSWORD_PATH', '/user/forgot'),
    recruiterDashboard: value('RECRUITER_DASHBOARD_PATH', '/dashboard'),
    jobs: value('JOBS_PATH', '/'),
    companyProfile: value('COMPANY_PROFILE_PATH', '/company-profile'),
    jobManagement: value('JOB_MANAGEMENT_PATH', '/recruitment-news'),
    applicationManagement: value('APPLICATION_MANAGEMENT_PATH', '/candidates'),
    candidateDashboard: value('CANDIDATE_DASHBOARD_PATH', '/candidate/dashboard'),
    adminLogin: value('ADMIN_LOGIN_URL', 'http://localhost:5173/login'),
  },

  users: {
    recruiter: {
      email: value('RECRUITER_EMAIL', 'kvu4488@gmail.com'),
      password: value('RECRUITER_PASSWORD', '123'),
    },
    candidate: {
      email: value('CANDIDATE_EMAIL', 'candidate.test@example.com'),
      password: value('CANDIDATE_PASSWORD', 'Secret123!'),
    },
    admin: {
      email: value('ADMIN_EMAIL', 'admin.test@example.com'),
      password: value('ADMIN_PASSWORD', 'Secret123!'),
    },
    invalid: {
      email: value('INVALID_EMAIL', 'notfound@example.com'),
      password: value('INVALID_PASSWORD', 'wrong-password'),
    },
  },

  search: {
    keyword: value('SEARCH_KEYWORD', 'Developer'),
    location: value('SEARCH_LOCATION', 'Ha Noi'),
  },
};
