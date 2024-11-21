const schema = {
  type: "object",
  properties: {
    port: { type: 'integer', required: true },
    host: { type: 'string', required: true },
    certName: { type: 'string', required: true }
  }
}

module.exports = schema;
