
const { TopicCreateTransaction, ConsensusMessageSubmitTransaction, ConsensusTopicQuery } = require('@hashgraph/sdk');
const { encryptMessage, decryptMessage } = require('./encryption');
const client = require('./config');

async function createTopic() {
  const transaction = await new TopicCreateTransaction()
    .setAdminKey('YOUR_PUBLIC_KEY')  
    .execute(client);
  
  const receipt = await transaction.getReceipt(client);
  const topicId = receipt.topicId;
  
  console.log(`Created topic: ${topicId}`);
  return topicId;
}

async function sendMessage(topicId, message, encryptionKey) {
  const encryptedMessage = encryptMessage(message, encryptionKey);

  const transaction = await new ConsensusMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(encryptedMessage)
    .execute(client);

  const receipt = await transaction.getReceipt(client);
  console.log(`Message sent: ${encryptedMessage}`);
}

async function receiveMessages(topicId, encryptionKey) {
  const query = new ConsensusTopicQuery()
    .setTopicId(topicId)
    .setStartTime(0) 
    .setMaxQueryPayment(100000000)
    .setMaxResults(10);  

  const messages = await query.execute(client);

  messages.forEach((msg) => {
    const decryptedMessage = decryptMessage(msg.message, encryptionKey);
    console.log(`Received message: ${decryptedMessage}`);
  });
}

async function receiveFilteredMessages(topicId, encryptionKey, keyword) {
  const query = new ConsensusTopicQuery()
    .setTopicId(topicId)
    .setStartTime(0)
    .setMaxQueryPayment(100000000)
    .setMaxResults(10);

  const messages = await query.execute(client);

  const filteredMessages = messages.filter((msg) => msg.message.includes(keyword));
  
  filteredMessages.forEach((msg) => {
    const decryptedMessage = decryptMessage(msg.message, encryptionKey);
    console.log(`Filtered and received message: ${decryptedMessage}`);
  });
}

module.exports = { createTopic, sendMessage, receiveMessages, receiveFilteredMessages };
