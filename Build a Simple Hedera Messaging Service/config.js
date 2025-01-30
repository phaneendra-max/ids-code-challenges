const { Client } = require('@hashgraph/sdk');
const client = Client.forTestnet();  
client.setOperator('YOUR_ACCOUNT_ID', 'YOUR_PRIVATE_KEY');
module.exports = client;