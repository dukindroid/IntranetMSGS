// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '298442187156100', // your App ID
        'clientSecret'  : '0a321f3894969eff63f93fe5a59ad96b', // your App Secret
        'callbackURL'   : 'http://jabon.noip.me/auth/facebook/callback'
    },

    'googleAuth' : {
        'clientID'      : '840441665089-5vtlsu4dulbgs20ttletru1fbflf7rhc.apps.googleusercontent.com',
        'clientSecret'  : 'J3PyIx3xEGQ-b7A-dkO8kWCd',
        'callbackURL'   : 'http://jabon.noip.me/auth/google/callback'
    }

};