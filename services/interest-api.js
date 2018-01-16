import { post } from '../lib/request'

const buildPayload = (listingId, data) => {
  return {
    interest: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      listing_id: listingId
    }
  }
}

export const createInterest = async (listingId, data) => {
  const payload = buildPayload(listingId, data)

  try {
    return await post('/interests', payload)
  } catch (error) {
    return error.response && error.response.status === 422
      ? error.response
      : 'Unknown error. Please try again.'
  }
}

