import express from 'express';
import axios from 'axios';
import parse from 'querystring'


const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  const validUrls = urls.filter((url) => isValidUrl(url));

  try {
    const responses = await Promise.all(validUrls.map((url) => fetchNumbersFromUrl(url)));

    const mergedNumbers = mergeNumbers(responses);
    const uniqueNumbers = Array.from(new Set(mergedNumbers)).sort((a, b) => a - b);

    res.json({ numbers: uniqueNumbers });
  } catch (error) {
    console.error('Error processing URLs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function isValidUrl(url) {
  return true;
}

async function fetchNumbersFromUrl(url) {
  try {
    const response = await axios.get(url);
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching numbers from URL:', url, error);
    return [];
  }
}

function mergeNumbers(responses) {
  const mergedNumbers = [];
  responses.forEach((numbers) => {
    mergedNumbers.push(...numbers);
  });
  return mergedNumbers;
}

app.listen(port, () => {
  console.log(`number-management-service is running at http://localhost:${port}`);
});
