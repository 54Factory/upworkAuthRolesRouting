/**
 * Script to be run once and create an Admin user
 * with email admin@admin.co
 * and pasword 123456
 *
 * do this so createUser can trigger and custom claims are set
 */

const admin = require('firebase-admin');
const env = require('./.env.json');

//  projectId: env.projectId,
//  databaseURL: env.databaseURL,
//}, './key.json');
//

const adminConfig = env;
adminConfig.credential = admin.credential.cert(require('./key.json'));

try { admin.initializeApp(adminConfig) } catch (e) {}

return admin.auth().createUser({
  email: 'admin@admin.co',
  displayName: 'admin',
  password: '123456'
}).then(() => {
  console.log('done');
}).catch(err => {
  console.log(err);
});
