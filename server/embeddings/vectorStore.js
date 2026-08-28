const fs = require('fs');
const path = require('path');

function cosineSimilarity(vectorA, vectorB) {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB) || vectorA.length !== vectorB.length || vectorA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i += 1) {
    const a = Number(vectorA[i]) || 0;
    const b = Number(vectorB[i]) || 0;
    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

function search(queryVector, corpus, topN = 5) {
  if (!Array.isArray(corpus)) {
    return [];
  }

  return corpus
    .map((entry) => ({
      ...entry,
      score: cosineSimilarity(queryVector, entry.embedding || []),
    }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

function createVectorStore(filePath) {
  const resolvedPath = path.resolve(filePath);

  function readCorpus() {
    try {
      const text = fs.readFileSync(resolvedPath, 'utf8');
      if (!text.trim()) {
        return [];
      }
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeCorpus(entries) {
    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
    fs.writeFileSync(resolvedPath, JSON.stringify(entries, null, 2));
    return entries;
  }

  return {
    readCorpus,
    writeCorpus,
    addEntry(entry) {
      const corpus = readCorpus();
      const next = [...corpus, entry];
      writeCorpus(next);
      return next;
    },
    addEntries(entries) {
      const corpus = readCorpus();
      const next = [...corpus, ...entries];
      writeCorpus(next);
      return next;
    },
    search(queryVector, topN = 5) {
      return search(queryVector, readCorpus(), topN);
    },
  };
}

module.exports = {
  cosineSimilarity,
  createVectorStore,
  search,
};
