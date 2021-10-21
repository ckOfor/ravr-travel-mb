export type getResponse = {
  kind: "ok";
  data: {
    data: {
      details: any
    },
    message: string
    success: boolean
    errors: object
    links: object
    status: boolean
  },
}