'use strict';

module.exports = {
  db: 'mongodb://localhost/clicker-dev',
  app: {
    title: 'Clicker - Development Environment'
  },
  facebook: {
    // https://developers.facebook.com/apps/553883508057093/dashboard/
    clientID: process.env.FACEBOOK_ID || '553883508057093',
    clientSecret: process.env.FACEBOOK_SECRET || '2e44fdf923d563173f37207d13c53d53',
    callbackURL: 'http://127.0.0.1:3000/auth/facebook/callback'
  },
  twitter: {
    // https://apps.twitter.com/app/6526109
    clientID: process.env.TWITTER_KEY || 'fpzSBdbJ98Hj74ZgJSmp1wzsr',
    clientSecret: process.env.TWITTER_SECRET || 'K4tvB9KsJGAr0CW48KhhW7OY9IMVyBA0UuIImYsQYOTOee9RYN',
    callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
  },
  google: {
    // https://console.developers.google.com/project/190133021467/apiui/credential
    clientID: process.env.GOOGLE_ID || '190133021467-fkode4bkuiovtpskkmieo9u4v5r5shho.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || '-yDugzVlRtVyJjxz8S-7cz-e',
    callbackURL: 'http://127.0.0.1:3000/auth/google/callback'
  }
};
