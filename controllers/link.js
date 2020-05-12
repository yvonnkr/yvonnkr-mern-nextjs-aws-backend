const Link = require("../models/link");

exports.create = async (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  const slug = url;

  const newLink = new Link({
    title,
    url,
    categories,
    type,
    medium,
    slug,
    postedBy: req.user._id,
  });

  try {
    const data = await newLink.save();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const links = await Link.find();
    res.json(links);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.read = (req, res) => {
  res.send("Read Link");
};
exports.remove = (req, res) => {
  res.send("Remove Link");
};
