const axios = require('axios');

axios.get('https://jkt48.com', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
  })
  .then(response => {
    const cookies = response.headers['set-cookie'];
    console.log(cookies);
  })
  .catch(error => {
    console.error(error);
  });