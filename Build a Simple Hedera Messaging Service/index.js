const { createTopic, sendMessage, receiveMessages, receiveFilteredMessages } = require('./messaging');

const encryptionKey = 'your-encryption-key';

(async function main() {
  const topicId = await createTopic();

  await sendMessage(topicId, 'Hello, Hedera!', encryptionKey);
  await sendMessage(topicId, 'Learning HCS', encryptionKey);
  await sendMessage(topicId, 'Message 3', encryptionKey);

  await receiveMessages(topicId, encryptionKey);

  await receiveFilteredMessages(topicId, encryptionKey, 'Hedera');
})();
