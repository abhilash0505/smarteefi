const HTTP = require('./http');
const CONFIG = require("../config");

module.exports = {
    login: async ({username, password}) => {
        const url = `${CONFIG.baseUrl}/${CONFIG.paths.login}`;
        const dataObj = {
            "LoginForm": {
                "email": username,
                "password": password,
                "app": "smarteefi"
            }
        };

        const data = await HTTP.MAKE_POST_CALL(url, dataObj, "Failed to login");
        return data?.access_token;
    }
};