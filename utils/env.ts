import * as dotenv from 'dotenv';

dotenv.config();

const value = (name: string, fallback: string) => process.env[name] || fallback;

const joinUrl = (baseUrl: string, path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export const env = {
  baseUrl: value('BASE_URL', 'http://localhost:3000'),
  candidateBaseUrl: value('CANDIDATE_BASE_URL', value('BASE_URL', 'http://localhost:3000')),
  recruiterBaseUrl: value('RECRUITER_BASE_URL', 'http://localhost:3001'),
  adminBaseUrl: value('ADMIN_BASE_URL', 'http://localhost:3003'),
  apiUrl: value('API_URL', 'http://localhost:5000'),
  candidateApiUrl: value('CANDIDATE_API_URL', 'http://localhost:4000'),
  recruiterApiUrl: value('RECRUITER_API_URL', value('API_URL', 'http://localhost:5000')),
  adminApiUrl: value('ADMIN_API_URL', 'http://localhost:4100'),

  routes: {
    home: value('HOME_PATH', '/'),
    candidateLogin: value('CANDIDATE_LOGIN_PATH', '/user/login'),
    candidateProfile: value('CANDIDATE_PROFILE_PATH', '/user-manage/profile'),
    candidateCvProfile: value('CANDIDATE_CV_PROFILE_PATH', '/user-manage/CV-profile'),
    candidateCvSetting: value('CANDIDATE_CV_SETTING_PATH', '/user-manage/CV-profile/CV-setting'),
    candidateAppliedJobs: value('CANDIDATE_APPLIED_JOBS_PATH', '/user-manage/cv/list'),
    candidateSavedJobs: value('CANDIDATE_SAVED_JOBS_PATH', '/user-manage/cv/save'),
    candidateViewedJobs: value('CANDIDATE_VIEWED_JOBS_PATH', '/user-manage/cv/watch'),
    candidateNotifications: value('CANDIDATE_NOTIFICATIONS_PATH', '/user-manage/Notification'),
    candidateInvitationWait: value('CANDIDATE_INVITATION_WAIT_PATH', '/user-manage/invitation-job/wait'),
    candidateInvitationAccept: value('CANDIDATE_INVITATION_ACCEPT_PATH', '/user-manage/invitation-job/accept'),
    candidateInvitationExpired: value('CANDIDATE_INVITATION_EXPIRED_PATH', '/user-manage/invitation-job/expried'),
    candidateSettings: value('CANDIDATE_SETTINGS_PATH', '/user-manage/setting'),
    candidateForgotPassword: value('CANDIDATE_FORGOT_PASSWORD_PATH', '/user/forgot'),
    login: value('RECRUITER_LOGIN_PATH', value('LOGIN_PATH', '/user/login')),
    forgotPassword: value('RECRUITER_FORGOT_PASSWORD_PATH', value('FORGOT_PASSWORD_PATH', '/user/forgot')),
    recruiterDashboard: value('RECRUITER_DASHBOARD_PATH', '/dashboard'),
    jobs: value('JOBS_PATH', '/search'),
    companyList: value('COMPANY_LIST_PATH', '/company/list'),
    companyProfile: value('COMPANY_PROFILE_PATH', '/company-profile'),
    jobManagement: value('JOB_MANAGEMENT_PATH', '/recruitment-news'),
    jobCreate: value('JOB_CREATE_PATH', '/recruitment-news/create'),
    jobTrash: value('JOB_TRASH_PATH', '/recruitment-news/trash'),
    applicationManagement: value('APPLICATION_MANAGEMENT_PATH', '/candidates'),
    recruiterMessages: value('RECRUITER_MESSAGES_PATH', '/messages'),
    recruiterSchedule: value('RECRUITER_SCHEDULE_PATH', '/schedule'),
    recruiterSettings: value('RECRUITER_SETTINGS_PATH', '/settings'),
    candidateDashboard: value('CANDIDATE_DASHBOARD_PATH', '/candidate/dashboard'),
    adminLogin: value('ADMIN_LOGIN_PATH', '/admin'),
    adminDashboard: value('ADMIN_DASHBOARD_PATH', '/admin/dashboard'),
    adminAccounts: value('ADMIN_ACCOUNTS_PATH', '/admin/dashboard/accounts'),
    adminModeration: value('ADMIN_MODERATION_PATH', '/admin/dashboard/moderation'),
    adminAudit: value('ADMIN_AUDIT_PATH', '/admin/dashboard/audit'),
    adminNotifications: value('ADMIN_NOTIFICATIONS_PATH', '/admin/dashboard/notifications'),
    adminTaxonomy: value('ADMIN_TAXONOMY_PATH', '/admin/dashboard/taxonomy'),
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
      email: value('ADMIN_EMAIL', 'kvu4488@gmail.com'),
      password: value('ADMIN_PASSWORD', '123'),
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

export const candidateUrl = (path: string) => joinUrl(env.candidateBaseUrl, path);
export const recruiterUrl = (path: string) => joinUrl(env.recruiterBaseUrl, path);
export const adminUrl = (path: string) => joinUrl(env.adminBaseUrl, path);
