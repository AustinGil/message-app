import express from 'express';
import { VONAGE_API_KEY, VONAGE_API_SECRET, VONAGE_JWT } from '../config.js'
import { wrapAsync, toBase64, http } from './utils.js'

const router = express.Router()

router.get('/api/balance', wrapAsync(async () => {
  const results = await http.get('https://rest.nexmo.com/account/get-balance', {
    query: {
      api_key: VONAGE_API_KEY,
      api_secret: VONAGE_API_SECRET,
    }
  })
  return results
}))

router.post('/api/application', wrapAsync(async () => {
  const { name } = request.body
  const results = await http.post('https://api.nexmo.com/v2/applications', {
    headers: {
      Authorization: `Bearer MzYyOTkzMjM6NWs5WjA2SW9FS2dMR2ZLSA==`
      // Authorization: `Bearer ${VONAGE_JWT}`
      // Authorization: toBase64(`${VONAGE_API_KEY}:${VONAGE_API_SECRET}`)
    },
    json: {
      name: name,
      capabilities: {
        // messages: {
        //   webhooks: {
        //     inbound_url: {
        //       address: "https://example.com/webhooks/inbound",
        //       http_method: "POST"
        //     },
        //     status_url: {
        //       address: "https://example.com/webhooks/status",
        //       http_method: "POST"
        //     }
        //   }
        // },
      }
    }
  })
  return results
}))

router.get('/api/application', wrapAsync(async () => {
  const results = await http.post('https://api.nexmo.com/v2/applications', {
    headers: {
      Authorization: `Bearer MzYyOTkzMjM6NWs5WjA2SW9FS2dMR2ZLSA==`
      // Authorization: `Bearer ${VONAGE_JWT}`
      // Authorization: toBase64(`${VONAGE_API_KEY}:${VONAGE_API_SECRET}`)
    }
  })
  return results
}))

router.post('/api/application/:VONAGE_APPLICATION_ID/put', wrapAsync(async (request) => {
  const { VONAGE_APPLICATION_ID } = request.params
  const { name } = request.body
  const results = await http.put(`https://api.nexmo.com/v2/applications/${VONAGE_APPLICATION_ID}`, {
    headers: {
      Authorization: `Bearer MzYyOTkzMjM6NWs5WjA2SW9FS2dMR2ZLSA==`
      // Authorization: `Bearer ${VONAGE_JWT}`
      // Authorization: toBase64(`${VONAGE_API_KEY}:${VONAGE_API_SECRET}`)
    },
    json: {
      name: name,
      capabilities: {
        // messages: {
        //   webhooks: {
        //     inbound_url: {
        //       address: "https://example.com/webhooks/inbound",
        //       http_method: "POST"
        //     },
        //     status_url: {
        //       address: "https://example.com/webhooks/status",
        //       http_method: "POST"
        //     }
        //   }
        // },
      }
    }
  })
  return results
}))

router.post('/api/application/:VONAGE_APPLICATION_ID/delete', wrapAsync(async (request) => {
  const { VONAGE_APPLICATION_ID } = request.params
  const results = await http.delete(`https://api.nexmo.com/v2/applications/${VONAGE_APPLICATION_ID}`, {
    headers: {
      Authorization: `Bearer MzYyOTkzMjM6NWs5WjA2SW9FS2dMR2ZLSA==`
      // Authorization: `Bearer ${VONAGE_JWT}`
      // Authorization: toBase64(`${VONAGE_API_KEY}:${VONAGE_API_SECRET}`)
    },
  })
  return results
}))

router.post('/api/message', wrapAsync(async (request, response) => {
  const {to, from, message} = request.body

  const results = await http.post('https://messages-sandbox.nexmo.com/v0.1/messages', {
    headers: {
      Authorization: `Bearer MzYyOTkzMjM6NWs5WjA2SW9FS2dMR2ZLSA==`
      // Authorization: `Bearer ${VONAGE_JWT}`
    },
    json: {
      from: { type: "sms", number: from },
      to: { type: "sms", number: to },
      message: {
        content: {
          type: "text",
          text: message
        }
      }
    }
  })
  return results
}))

export default router
