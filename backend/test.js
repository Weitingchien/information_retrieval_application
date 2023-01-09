'use strict';
require('dotenv').config();
const client = require('./elasticsearch/connection');

async function run() {
  await client.index({
    index: 'game-of-thrones',
    id: '1',
    document: {
      character: 'Ned Stark',
      quote: 'Winter is coming.',
      isAlive: true
    }
  });

  await client.update({
    index: 'game-of-thrones',
    id: '1',
    doc: {
      isAlive: false
    }
  });

  const document = await client.get({
    index: 'game-of-thrones',
    id: '1'
  });

  console.log(document);
}

run().catch(console.log);
