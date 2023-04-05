import dotenv from 'dotenv';
import options from '../process.js';

dotenv.config({
    path: options.mode.toUpperCase()==="DEVELOPMENT" ? './.env.development':'./.env.production'
});

export default {
    host: process.env.HOST,
    port: process.env.PORT,
    login_strategy: process.env.LOGIN_STRATEGY,
    persistance_engine: process.env.PERSISTANCE_ENGINE,

    mongoUrl: process.env.MONGO_URL,

    gitHub_AppId: process.env.GITHUB_APP_ID,
    gitHub_ClientId: process.env.GITHUB_CLIENT_ID,
    gitHub_ClientSecret: process.env.GITHUB_CLIENT_SECRET,
    gitHub_CallbackURL: process.env.GITHUB_CALLBACK_URL,

    jwt_private_key: process.env.JWT_PRIVATE_KEY
}