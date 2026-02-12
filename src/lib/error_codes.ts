export const errorCodes = {
  errors: {
    AUTH_001: {
      message: "Missing Verification Token",
      description:
        "The 'clientId' or 'apiKey' query parameter or header is missing.",
      httpStatus: 400,
    },
    AUTH_002: {
      message: "Invalid Client",
      description:
        "The provided client ID or API Key does not exist in our records.",
      httpStatus: 401,
    },
    AUTH_003: {
      message: "Access Denied: Unpaid Bills",
      description:
        "The client has outstanding bills and access is temporarily restricted.",
      httpStatus: 403,
    },
    AUTH_004: {
      message: "Maintenance Mode",
      description: "The system is currently undergoing maintenance.",
      httpStatus: 503,
    },
    SYS_001: {
      message: "Internal Server Error",
      description: "An unexpected error occurred on the server.",
      httpStatus: 500,
    },
    VAL_001: {
      message: "Invalid Request Format",
      description:
        "The request body or parameters do not match the expected schema.",
      httpStatus: 400,
    },
  },
  success: {
    OK_001: {
      message: "Authorized",
      description: "Client is authorized and in good standing.",
      httpStatus: 200,
    },
  },
} as const;

export type ErrorCodeKey = keyof typeof errorCodes.errors;
export type SuccessCodeKey = keyof typeof errorCodes.success;
