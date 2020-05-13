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

//TODO: use id instead of slug --to review
exports.read = async (req, res) => {
  try {
    const link = await Link.findOne({ slug: req.params.slug });
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = (req, res) => {
  res.send("Remove Link");
};

exports.clickCount = async (req, res) => {
  const { linkId } = req.body;

  try {
    const selectedLink = await Link.findById(linkId);
    if (!selectedLink) {
      return res.status(404).json({ error: "Link with gived id not found" });
    }

    selectedLink.clicks = selectedLink.clicks + 1;
    await selectedLink.save();

    res.json(selectedLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  //alternative way
  // await Link.findByIdAndUpdate(linkId, {$inc: {clicks: 1}}, {new: true})
};
