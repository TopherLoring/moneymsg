export const kycDataSchema = {
  type: "object",
  additionalProperties: false,
  required: ["firstName", "lastName", "dateOfBirth", "ssn", "address"],
  properties: {
    firstName: { type: "string", minLength: 1, maxLength: 64 },
    lastName: { type: "string", minLength: 1, maxLength: 64 },
    dateOfBirth: {
      type: "string",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
      description: "ISO 8601 date YYYY-MM-DD",
    },
    ssn: {
      type: "string",
      pattern: "^\\d{9}$",
      description: "9-digit SSN without dashes",
    },
    address: {
      type: "object",
      additionalProperties: false,
      required: ["line1", "city", "state", "postalCode", "country"],
      properties: {
        line1: { type: "string", minLength: 1, maxLength: 128 },
        line2: { type: "string", maxLength: 128 },
        city: { type: "string", minLength: 1, maxLength: 64 },
        state: { type: "string", minLength: 2, maxLength: 2, description: "2-letter US state code" },
        postalCode: { type: "string", pattern: "^\\d{5}(-\\d{4})?$" },
        country: { type: "string", minLength: 2, maxLength: 2, default: "US" },
      },
    },
    phone: { type: "string", pattern: "^\\+1\\d{10}$", description: "E.164 US phone" },
    email: { type: "string", format: "email", maxLength: 254 },
  },
};
