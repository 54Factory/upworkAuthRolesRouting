export default {
  apiUrl: 'http://yoursite.com/api/',
};

const siteConfig = {
  siteName: 'ISOMORPHIC',
  siteIcon: 'ion-flash',
  footerText: 'Isomorphic ©2018 Created by RedQ, Inc',
};
const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};
const language = 'english';

const jwtConfig = {
  fetchUrl: '/api/',
  secretKey: 'secretKey',
};

const firebaseConfig = {
  projectId: 'test-74eb3',
  authDomain: 'test-74eb3.firebaseapp.com',
  databaseURL: 'https://test-74eb3.firebaseio.com/',
  apiKey: 'AIzaSyBY3GoyXaef8VHNiZ4i-r251bjQNEDmEzY'
};

export {
  siteConfig, language,
  themeConfig, jwtConfig,
  firebaseConfig
};
