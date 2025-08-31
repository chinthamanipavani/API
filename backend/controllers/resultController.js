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

    // Filter results to only include English language repositories
    const filteredItems = data.items.filter(item => {
      // Skip if description contains Chinese characters
      if (item.description && /[\u4e00-\u9fff]/.test(item.description)) return false;
      // Skip if name contains Chinese characters
      if (item.name && /[\u4e00-\u9fff]/.test(item.name)) return false;
      return true;
    });

    // Save top 5 filtered results to DB
    const results = filteredItems.slice(0, 5).map(item => ({
      keyword,
      name: item.name,
      description: item.description,
      url: item.html_url,
      language: item.language,
      stars: item.stargazers_count,
    }));

    console.log(`Filtered results count: ${results.length}`);
    if (results.length > 0) {
      await Result.insertMany(results);
      console.log('Results saved to database');
    } else {
      console.log('No results to save');
    }

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
