const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  cloud: {
    id: process.env['CloudID']
  },
  auth: {
    username: 'elastic',
    password: process.env['CloudPwd']
  }
});

client
  .ping()
  .then(response => console.log('Elasticsearch is connected.'))
  .catch(error => console.error('Elasticsearch is not connected.'));

module.exports = client;
