import { ManagementClient } from 'auth0';

const options = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.M2M_CLIENT_ID,
  clientSecret: process.env.M2M_CLIENT_SECRET,
  // withCustomDomainHeader: "auth.example.com", // Optional: Auto-applies to whitelisted endpoints
}
const management = new ManagementClient(options)
module.exports = management
