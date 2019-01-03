const welcomeHtml = (email, displayName) => `
  <div>
    <h1>Welcome ${displayName}!</h1>
  </div>
`;

const welcomeText = (email, displayName) =>   `
  Welcome ${displayName}!
`;

module.exports = {
  html: welcomeHtml,
  text: welcomeText
};
