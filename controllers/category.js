const slugify = require("slugify");

const Category = require("../models/category");
const Link = require("../models/link");
const { setS3Params, s3UploadImage } = require("../aws/s3");
const { getFormData } = require("../formidable/index");

//#region
/* */

/**
 * arn:aws:iam::108419398690:user/Yvonne
 * 
 * //   const { name, image, content } = req.body;

  //create a slug based on the name eg: slugify(node js, '-') => node-js
  //   const slug = slugify(name);

  //test image --using placeholder.com img-url
  //   const image_test = {
  //     url: `https://via.placeholder.com/200x150.png?text=${process.env.CLIENT_URL}`,
  //     key: "123",
  //   };

 */
//#endregion

//create example --get formData using formidable --then send image to AWS S3
//#region
/* 

exports.create = async (req, res) => {
  try {
    //get formData
    const formData = await getFormData(req);

    const { name, content } = formData.fields;
    const { image } = formData.files;

    //generate slug
    const slug = slugify(name);

    //validate image size -- ! > 2mb
    if (image.size > 2000000) {
      return res.status(400).json({
        error: "Image should be less than 2mb",
      });
    }

    //upload image to AWS S3
    const params = setS3Params(image,'jpg'); //S3 params
    const data = await s3UploadImage(params); //S3 upload params

    //create new Category
    const category = new Category({
      name,
      slug,
      content,
      image: { url: data.Location, key: data.Key },
      postedBy: req.user._id,
    });

    //save
    await category.save();

    //response
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

*/
//#endregion

//using json data --not form data --take-in image as base64 data
exports.create = async (req, res) => {
  const { name, content, image } = req.body;

  //image data --base64
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const imageType = image.split(";")[0].split("/")[1];

  //generate slug
  const slug = slugify(name);

  try {
    //upload image to AWS S3
    const params = setS3Params(base64Data, imageType); //S3 params
    const data = await s3UploadImage(params); //S3 upload params

    //create new Category
    const category = new Category({
      name,
      slug,
      content,
      image: { url: data.Location, key: data.Key },
      postedBy: req.user._id,
    });

    //save
    await category.save();

    //response
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.read = async (req, res) => {
  const limit = +(req.query && req.query.limit) || 10;
  const skip = +(req.query && req.query.skip) || 0;

  try {
    //find category
    const category = await Category.findOne({ slug: req.params.slug }).populate(
      "postedBy",
      "_id name username"
    );
    if (!category) {
      res.status(400).json({ error: "Category not found" });
    }

    //find all links associated with this category
    const links = await Link.find({ categories: category })
      .populate("postedBy", "_id name username")
      .populate("categories", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // res.json({ size: links.length });
    res.json({ category, links });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = (req, res) => {
  res.send("update");
};

exports.remove = (req, res) => {
  res.send("remove");
};
