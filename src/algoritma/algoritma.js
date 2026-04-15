const express = require('express');

const router = express.Router();

const reverseAlphabetKeepTrailingNumber = (text) => {
  const match = text.match(/^([A-Za-z]+)(\d+)$/);
  if (!match) {
    return text;
  }

  const [, letters, digits] = match;
  return `${letters.split('').reverse().join('')}${digits}`;
};

const longestWord = (sentence) => {
  const words = sentence.trim().split(/\s+/);
  let longest = '';

  words.forEach((word) => {
    if (word.length > longest.length) {
      longest = word;
    }
  });

  return {
    word: longest,
    length: longest.length,
  };
};

const queryOccurrences = (input, query) => {
  const counts = input.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  return query.map((item) => counts[item] || 0);
};

/**
 * @swagger
 * /api/algoritma/reverse:
 *   post:
 *     summary: Reverse huruf, angka tetap di belakang
 *     tags:
 *       - Algoritma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: NEGIE1
 *     responses:
 *       200:
 *         description: Hasil reverse string input
 *       400:
 *         description: text kosong atau bukan string
 */
router.post('/reverse', (req, res) => {
  const text = req.body?.text;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'text harus diisi dan bertipe string',
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      input: text,
      result: reverseAlphabetKeepTrailingNumber(text),
    },
  });
});

/**
 * @swagger
 * /api/algoritma/longest-word:
 *   post:
 *     summary: Mencari kata terpanjang pada kalimat
 *     tags:
 *       - Algoritma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sentence:
 *                 type: string
 *                 example: Saya sangat senang mengerjakan soal algoritma
 *     responses:
 *       200:
 *         description: Kata terpanjang dari kalimat input
 *       400:
 *         description: sentence kosong atau bukan string
 */
router.post('/longest-word', (req, res) => {
  const sentence = req.body?.sentence;

  if (!sentence || typeof sentence !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'sentence harus diisi dan bertipe string',
    });
  }

  const result = longestWord(sentence);

  return res.status(200).json({
    success: true,
    data: {
      sentence,
      word: result.word,
      length: result.length,
      description: `${result.word}: ${result.length} character`,
    },
  });
});

/**
 * @swagger
 * /api/algoritma/query-count:
 *   post:
 *     summary: Hitung jumlah kemunculan QUERY pada INPUT
 *     tags:
 *       - Algoritma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["xc", "dz", "bbb", "dz"]
 *     responses:
 *       200:
 *         description: Hasil hitung kemunculan query
 *       400:
 *         description: input bukan array
 */
router.post('/query-count', (req, res) => {
  const input = req.body?.input;
  const query = ['bbb', 'ac', 'dz'];

  if (!Array.isArray(input)) {
    return res.status(400).json({
      success: false,
      message: 'input harus berupa array string',
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      input,
      query,
      output: queryOccurrences(input, query),
    },
  });
});

module.exports = router;
