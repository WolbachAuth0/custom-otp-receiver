const management = require('./Auth0')

module.exports = {
  create,
  addClientToUser
}

  // CRUD the M2M Clients
  async function create ({ user_id, name }) {
    const params = {
      name: `${name}`,
      description: `OTP Message Client for user ${user_id}`,
      logo_uri: 'https://raw.githubusercontent.com/WolbachAuth0/auth0-m2m-demo/main/public/api-icon.png',
      allowed_clients: [],
      grant_types: [ 'client_credentials' ],
      token_endpoint_auth_method: 'client_secret_post',
      app_type: 'non_interactive',
      is_first_party: true,
      oidc_conformant: true,
      client_metadata: {
        user_id,
        name,
      }
    }
    // create the client and grant it permissions
    const client = await management.clients.create(params)
    const grants = await createGrant({ client_id: client.client_id,  })
    
    // return the data
    const payload = {
      message: `Created new OTP message client for user ${user_id}`,
      data: {
        tenant: client.tenant,
        name: client.name,
        description: client.description,
        logo_uri: client.logo_uri,
        metadata: client.client_metadata,
        credentials: {
          grant_types: client.grant_types,
          audience: grants.audience,
          scope: grants.scope,
          client_id: client.client_id,
          client_secret: client.client_secret
        }
      }
    }
    return payload

  }

  async function createGrant ({ client_id }) {
    const params = {
      client_id,
      audience: process.env.AUDIENCE,
      scope: [ 'create:message' ],
    }
    const grants = await management.clientGrants.create(params)
    return grants
  }

  async function addClientToUser ({ user_id, }, { client_id, name }) {
    // get the user's app_metadata
    const user = await management.users.get(user_id);
    const app_metadata = user.app_metadata;

    // get the list of the user's m2m clients. if none found, a new empty array
    const userClients = app_metadata?.otp_clients && Array.isArray(app_metadata.otp_clients) ? app_metadata.otp_clients : [];
    // make a list of the client_ids found in the user's clients
    const userClientIDs = userClients.map(x => x.client_id);
    
    // push the new client into the user.app_metadata.otp_clients array ...
    if (!userClientIDs.includes(client_id)) {
      // but only if it's not a duplicate ...
      userClients.push({ client_id, name });
      app_metadata.otp_clients = userClients;
    }
    // update the user's app_metadata
    const response = await management.users.update(user_id, { app_metadata: app_metadata });
    return response
  }


  // async function listAll ({ per_page, page }, user_id) {
  //   const startIdx = page * per_page
  //   const stopIdx = startIdx + per_page - 1
  //   try {
  //     let pageCount = 0
  //     let stillMoreClients = true
  //     let clients = []
  //     while (stillMoreClients && pageCount < 100) {
  //       const response = await this.api.getClients({ per_page: 100, page: pageCount, include_totals: true })
  //       clients.push(...response.clients)
  //       pageCount++
  //       stillMoreClients = clients.length < response.total
  //     }
      
  //     const data = clients
  //       .filter(x => {
  //         const isM2M = x.app_type == 'non_interactive'
  //         const clientUser = x?.client_metadata?.user_id
  //         return isM2M && clientUser
  //       })
  //       .filter(x => {
  //         if (user_id) {
  //           return x.client_metadata.user_id == user_id
  //         } else {
  //           return true
  //         }
  //       })
  //       .map(x => {
  //         return { 
  //           tenant: x.tenant,
  //           name: x.name,
  //           client_id: x.client_id,
  //           client_secret: x.client_secret,
  //           jwt_configuration: x.jwt_configuration,
  //           token_endpoint_auth_method: x.token_endpoint_auth_method,
  //           app_type: x.app_type,
  //           grant_types: x.grant_types,
  //           client_metadata: x.client_metadata
  //         }
  //       })
  //       .slice(startIdx, stopIdx)
      
  //     const payload = {
  //       status: 200,
  //       message: `Found ${data.length} M2M clients matching query.`,
  //       data 
  //     }
  //     return payload
  //   } catch (error) {
  //     return errorHandler(error)
  //   }
  // }

  // async function read ({ client_id }) {
  //   try {
  //     const client = await this.api.getClient({ client_id  })
  //     const grants = await this.api.getClientGrants({ client_id })
  //     const scopes = grants
  //       .filter(x => {
  //         const aud = x.audience == 'https://cic-external-api.herokuapp.com/api'
  //         return aud
  //       })
  //       .map(x => {
  //         return {
  //           grant_id: x.id,  
  //           scope: x.scope
  //         }
  //       })

  //     const data = Object.assign(client, { grants: scopes })
  //     const payload = {
  //       status: 200,
  //       message: `Found M2M Client ${client_id}`,
  //       data 
  //     }
  //     return payload
  //   } catch (error) {
  //     return errorHandler(error)
  //   }
  // }

  // async function remove ({ client_id, user_id }) {
  //   try {
  //     const data = await this.api.deleteClient({ client_id })
  //     const updateUser = await this.removeClientFromUser({ client_id, user_id  })
  //     const payload = {
  //       status: 200,
  //       message: `Deleted M2M client ${client_id}`,
  //       data 
  //     }
  //     return payload
  //   } catch (error) {
  //     return errorHandler(error)
  //   }
  // }

  // // private methods

  // // CRUD the Grants
  

  // // Users
  // async function getUserAppMetadata ({ user_id }) {
  //   // read the users app_metadata
  //   let user = await this.api.users.get({ id: user_id })

  //   // let app_metadata = user.app_metadata
  //   // const otp_clients = app_metadata?.otp_clients && Array.isArray(app_metadata.otp_clients) ? app_metadata.otp_clients : []
  //   // app_metadata.otp_clients = otp_clients
  //   return user.app_metadata
  // }

  // async function removeClientFromUser ({ client_id, user_id }) {
  //   // get the user's app_metadata
  //   const app_metadata = await this.getUserAppMetadata({ user_id })
  //   // filter out the client to be removed
  //   app_metadata.otp_clients = app_metadata.otp_clients.filter(x => x.client_id !== client_id)
  //   // update the user app_metadata
  //   return await this.api.updateAppMetadata({ id: user_id }, app_metadata)
  // }

