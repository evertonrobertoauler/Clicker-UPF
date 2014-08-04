'use strict';

module.exports = {
  db: 'mongodb://localhost/clicker-dev',
  app: {
    title: 'Clicker-UPF - Development Environment'
  },
  facebook: {
    // https://developers.facebook.com/apps/553883508057093/dashboard/
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: 'http://127.0.0.1:3000/auth/facebook/callback'
  },
  twitter: {
    // https://apps.twitter.com/app/6526109
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
  },
  google: {
    // https://console.developers.google.com/project/190133021467/apiui/credential
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: 'http://127.0.0.1:3000/auth/google/callback'
  }
};
