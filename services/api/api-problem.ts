import { ApiResponse } from "apisauce"

export type GeneralApiProblem = {
  kind:
    | "timeout"
    | "timeout"
    | "cannot-connect"
    | "server"
    | "unauthorized"
    | "forbidden"
    | "not-found"
    | "rejected"
    | "unknown"
    | "bad-data"
  temporary?: true
  data?: any
}

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(
  response: ApiResponse<any>
): GeneralApiProblem | void {
  switch (response.problem) {
    case "CONNECTION_ERROR":
      return { kind: "cannot-connect", temporary: true }
    case "NETWORK_ERROR":
      return { kind: "cannot-connect", temporary: true }
    case "TIMEOUT_ERROR":
      return { kind: "timeout", temporary: true }
    case "SERVER_ERROR":
      return { kind: "server" }
    case "UNKNOWN_ERROR":
      return { kind: "unknown", temporary: true }
    case "CLIENT_ERROR":
      const { status, data } = response
      switch (status) {
        case 401:
          return { kind: "unauthorized", data: data }
        case 403:
          return { kind: "forbidden", data: data }
        case 404:
          return { kind: "not-found", data: data }
        default:
          return { kind: "rejected", data: data }
      }
    case "CANCEL_ERROR":
      return null
  }

  return null
}
