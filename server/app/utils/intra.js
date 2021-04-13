const axios = require('axios');




exports.getaccesstoken = async (code) => {
    const params = {
        grant_type : 'authorization_code',
        client_id : '791d92daa8ac1927d930283144619d3eda91398e7a7a65e19c5a767aa6356ce0',
        client_secret : 'b9446682809b587c8decaa0c533d7cce7a23ecc1fe143c9672a1adb430182674',
        code : code,
        redirect_uri : 'http://google.com'
    }

    
    try {
        const response = await axios.post('https://api.intra.42.fr/oauth/token', params);

        return response.data.access_token;
    } catch (error) {
        throw error;
    }
}


exports.getuser = async (access_token) => {
    try {
        const response = await axios.get('https://api.intra.42.fr/v2/me', {
           headers : {
               'Authorization' : `Bearer ${access_token}`
           } 
        });
        
        const user = {
            'firstname' : response.data.first_name,
            'lastname': response.data.last_name,
            'username': response.data.login,
            'email': response.data.email,
            'image': response.data.image_url
        };

        return user;
    } catch (error) {
        throw error;
    }
}
