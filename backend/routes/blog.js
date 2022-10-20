const express = require("express");
const axios = require("axios");
const { body, validationResult } = require("express-validator");
const redis = require("redis");
const { getBlogsCollection } = require("../db/conn");
const { ObjectId } = require("bson");

const router = new express.Router();

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

async function fetchBlogData(blog) {
  const apiResponse = await axios.get(
    `https://www.fishwatch.gov/api/species/${blog}`
  );
  return apiResponse.data;
}

async function getBlogData(req, res) {
  const blog = "red-snapper";
  let results;
  let isCached = false;

  try {
    const cacheResults = await redisClient.get(blog);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchBlogData(blog);
      if (results.length === 0) {
        throw "API returned an empty array";
      }
      await redisClient.set(blog, JSON.stringify(results));
    }

    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

router.get("/redis", getBlogData);

router.get("/", async (req, res) => {
  const blogsCollection = getBlogsCollection();
  let blogs = await blogsCollection.find().toArray();
  res.render("home", { pageTitle: "Feed", blogs: blogs });
});

router.get("/post", (req, res) => {
  res.render("blog-post", { pageTitle: "Post Blog" });
});

router.post(
  "/post",
  body("title").isLength({ min: 10 }),
  body("content").isLength({ min: 100 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { title, content } = req.body;
      const errorArr = errors.array();
      let titleError, contentError;
      errorArr.forEach((item) => {
        if (item.param === "title") titleError = item.msg;
        else if (item.param === "content") contentError = item.msg;
      });
      return res.render("blog-post", {
        pageTitle: "Post Blog",
        title,
        content,
        titleError,
        contentError,
      });
    }
    res.redirect("/blogs");
  }
);

router.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const blogsCollection = getBlogsCollection();
  let blog = await blogsCollection.findOne({ "_id": new ObjectId(blogId) });
  res.render("blog-detail", { pageTitle: blog.title, blog: blog });
});

module.exports = router;
