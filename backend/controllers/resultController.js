const Result = require('../models/Result');

const searchGitHub = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}+language:english&sort=stars&order=desc`);
    if (!response.ok) {
      throw new Error('GitHub API error');
    }
    const data = await response.json();

    // Save top 5 results to DB
    const results = data.items.slice(0, 5).map(item => ({
      keyword,
      name: item.name,
      description: item.description,
      url: item.html_url,
      language: item.language,
      stars: item.stargazers_count,
    }));

    await Result.insertMany(results);

    res.json({ message: 'Results saved', results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch from GitHub API' });
  }
};

const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve results' });
  }
};

module.exports = {
  searchGitHub,
  getAllResults,
};
