import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    login_strategy: process.env.LOGIN_STRATEGY,

    mongoUrl: process.env.MONGO_URL,

    gitHub_AppId: process.env.GITHUB_APP_ID,
    gitHub_ClientId: process.env.GITHUB_CLIENT_ID,
    gitHub_ClientSecret: process.env.GITHUB_CLIENT_SECRET,
    gitHub_CallbackURL: process.env.GITHUB_CALLBACK_URL,

    jwt_private_key: process.env.JWT_PRIVATE_KEY
}