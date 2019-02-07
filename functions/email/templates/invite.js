const inviteHtml = ({ display_name, email, url }) => `
  <div>
    <h1>Welcome, ${display_name}</h1>

    <div>You've been invited to create an account.</div>

    <div>Follow this link to complete your account creation.</div>
    <a href="${url}">${url}</a>

    <div>email: ${email}</div>
  </div>
`;

const inviteText = ({ display_name, email, url }) => `
  Welcome, ${display_name}!
  You've been invited to create an account.

  follow the link to complete you account creation.
  ${url}

  email: ${email}
`;

exports = module.exports = ({ display_name, email, url }) => {
  const html = inviteHtml({display_name, email, url});
  const text = inviteText({display_name, email, url});
  return { html, text };
}
