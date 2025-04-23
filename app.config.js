import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      GHN_API_KEY: process.env.GHN_API_KEY,
      SE_PAY_API_KEY: process.env.SE_PAY_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      GEMINI_URL: process.env.GEMINI_URL,
      GOOGLE_CLIENT_KEY: process.env.GOOGLE_CLIENT_KEY,
      LAN_NETWORK: process.env.LAN_NETWORK
    },
  };
};
