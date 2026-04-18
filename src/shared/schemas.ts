export const deviceInfoSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 128 },
    platform: { type: "string", enum: ["ios", "android", "web"] },
    appVersion: { type: "string", maxLength: 32 },
    osVersion: { type: "string", maxLength: 32 },
    model: { type: "string", maxLength: 64 },
    vpn: { type: "boolean" },
    jailbroken: { type: "boolean" },
    newDevice: { type: "boolean" },
    deviceChange: { type: "boolean" },
  },
};

export const riskMetaSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    velocityFlag: { type: "boolean" },
    vpn: { type: "boolean" },
    deviceChange: { type: "boolean" },
    newDevice: { type: "boolean" },
    ipReputation: { type: "string", enum: ["clean", "suspect", "blocked"] },
    sessionAge: { type: "number", minimum: 0 },
  },
};
