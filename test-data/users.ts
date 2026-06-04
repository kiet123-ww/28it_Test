export const users = {
  candidate: {
    email: process.env.CANDIDATE_EMAIL || 'candidate_test@gmail.com',
    password: process.env.CANDIDATE_PASSWORD || '123456',
  },

  recruiter: {
    email: process.env.RECRUITER_EMAIL || 'recruiter_test@gmail.com',
    password: process.env.RECRUITER_PASSWORD || '123456',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin_test@gmail.com',
    password: process.env.ADMIN_PASSWORD || '123456',
  },
};