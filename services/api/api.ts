// a library to wrap and simplify api calls
import apisauce, { DEFAULT_HEADERS } from "apisauce"
import { RAVR_BASE_URL } from "@env"
import * as Types from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

const api = apisauce.create({
  // base URL is read from the "constructor"
  baseURL: RAVR_BASE_URL,
  // here are some default headers
  headers: {
    "Cache-Control": "no-cache",
    Accept: 'application/json',
    ContentType: 'application/json',
    // Authorization: `Bearer ${token}`
  },
  // 10 second timeout...
  timeout: 100000
})

/**
 * Process the api response
 */
const processResponse = async (response: any): Promise<any> => {
  // the typical ways to die when calling an api
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) {
      console.tron.error({ ...response, message: response.config.url })
      return problem
    }
  }

  // we're good
  // replace with `data` once api change is made.
  return { kind: "ok", data: response.data }
}

const signInUser = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/users/auth`, payload)
  return processResponse(response)
}

const fetchCoupons = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/coupon/fetch`, payload)
  return processResponse(response)
}

const cancelCoupons = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/coupon/cancel`, payload)
  return processResponse(response)
}

const redeemCoupons = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/coupon/redeem`, payload)
  return processResponse(response)
}

const createCoupons = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/coupon/create`, payload)
  return processResponse(response)
}

const editEmail = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/users/edit`, payload)
  return processResponse(response)
}

const createWallet = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/wallet/create`, payload)
  return processResponse(response)
}

const fetchWalletTransactions = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/wallet/fetch/transactions`, payload)
  return processResponse(response)
}

const fetchWalletBalance = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/wallet/fetch/balance`, payload)
  return processResponse(response)
}

const withdrawFromWallet = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/wallet/withdraw`, payload)
  return processResponse(response)
}

const createWalletPin = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/wallet/create/pin`, payload)
  return processResponse(response)
}

const createCompany = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/company/create`, payload)
  return processResponse(response)
}

const fetchUser = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/users/fetch`, payload)
  return processResponse(response)
}

const createTrip = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/trips/create`, payload)
  return processResponse(response)
}

const fetchPopularTrips = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/trips/fetch/popular`, payload)
  return processResponse(response)
}

const fetchTrendingTrips = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/trips/fetch/trending`, payload)
  return processResponse(response)
}

const fetchLocalTrips = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/trips/fetch/local`, payload)
  return processResponse(response)
}

const payForTrip = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/trips/pay`, payload)
  return processResponse(response)
}

const searchForTrip = async (payload): Promise<
  Types.getResponse
> => {
  const response = await api.post(`/trips/search`, payload)
  return processResponse(response)
}

export {
  signInUser,
  fetchCoupons,
  cancelCoupons,
  redeemCoupons,
  createCoupons,
  editEmail,
  createWallet,
  fetchWalletTransactions,
  fetchWalletBalance,
  withdrawFromWallet,
  createWalletPin,
  createCompany,
  fetchUser,
  createTrip,
  fetchPopularTrips,
  fetchTrendingTrips,
  fetchLocalTrips,
  payForTrip,
  searchForTrip
}