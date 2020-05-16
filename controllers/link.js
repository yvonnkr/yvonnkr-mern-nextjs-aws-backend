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
  const limit = +req.query.limit || 10;
  const skip = +req.query.skip || 0;

  try {
    const links = await Link.find()
      .populate("postedBy", "name")
      .populate("categories", "name slug")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.json(links);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  const slug = url;

  try {
    const selectedLink = await Link.findById(req.params.id);
    if (!selectedLink) {
      return res.status(404).json({ error: "Link with gived id not found" });
    }

    selectedLink.title = title;
    selectedLink.url = url;
    selectedLink.categories = categories;
    selectedLink.type = type;
    selectedLink.medium = medium;
    selectedLink.slug = slug;

    const data = await selectedLink.save();

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    await link.remove();

    res.json({ message: "Link deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
