import express from 'express';
import { VONAGE_API_KEY, VONAGE_API_SECRET } from '../config.js'
import { wrapAsync, toBase64, http } from './utils.js'

const AUTH_TOKEN = toBase64(`${VONAGE_API_KEY}:${VONAGE_API_SECRET}`)

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

router.post('/api/application', wrapAsync(async (request) => {
  const { name } = request.body

  if (!name) throw new Error('name is required')

  const results = await http.post('https://api.nexmo.com/v2/applications', {
    headers: {
      Authorization: `Basic ${AUTH_TOKEN}`,
    },
    json: {
      name: name,
    }
  })
  return results
}))

router.get('/api/application', wrapAsync(async () => {
  const results = await http.get('https://api.nexmo.com/v2/applications', {
    headers: {
      Authorization: `Basic ${AUTH_TOKEN}`
    }
  })
  return results
}))

router.post('/api/application/:appId/put', wrapAsync(async (request) => {
  const { appId } = request.params
  const { name } = request.body

  if (!name) throw new Error('name is required')

  const results = await http.put(`https://api.nexmo.com/v2/applications/${appId}`, {
    headers: {
      Authorization: `Basic ${AUTH_TOKEN}`
    },
    json: {
      name: name,
    }
  })
  return results
}))

router.post('/api/application/:appId/delete', wrapAsync(async (request) => {
  const { appId } = request.params
  const results = await http.delete(`https://api.nexmo.com/v2/applications/${appId}`, {
    headers: {
      Authorization: `Basic ${AUTH_TOKEN}`
    },
  })
  return results
}))

router.post('/api/message', wrapAsync(async (request, response) => {
  const {to, from, message} = request.body

  if (!to) throw new Error('to is required')
  if (!from) throw new Error('from is required')
  if (!message) throw new Error('message is required')

  const results = await http.post('https://api.nexmo.com/v0.1/messages', {
    headers: {
      Authorization: `Basic ${AUTH_TOKEN}`
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
