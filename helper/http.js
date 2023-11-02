const axios = require("axios");
module.exports = {
    POST: (url, data) => {
        return axios.post(url, data);
    },

    MAKE_POST_CALL: async (url, postData, errorMessage, offlineMessage) => {
        const result = await module.exports.POST(url, postData);

        const {status, data} = result;

        if (status !== 200)
            throw new Error(errorMessage);

        if (data.result !== "success") {
            if(data?.major_ecode === 6){
                throw new Error(offlineMessage);
            }
            throw new Error(errorMessage);
        }

        return data;
    }
}