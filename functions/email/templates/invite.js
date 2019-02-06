const inviteHtml = ({ displayName, email, url }) => `
  <div>
    <h1>Welcome, ${displayName}</h1>

    <div>You've been invited to create an account.</div>

    <div>Follow this link to complete your account creation.</div>
    <a href="${url}">${url}</a>

    <div>email: ${email}</div>
  </div>
`;

const inviteText = ({ displayName, email, url }) => `
  Welcome, ${displayName}!
  You've been invited to create an account.

  follow the link to complete you account creation.
  ${url}

  email: ${email}
`;

exports = module.exports = ({ displayName, email, url }) => {
  const html = inviteHtml({displayName, email, url});
  const text = inviteText({displayName, email, url});
  return { html, text };
}
