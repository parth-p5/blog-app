const express = require('express');
const { body, validationResult } = require('express-validator');
const router = new express.Router();

const BLOGS = [
  {
    title: 'Blog 1',
    content: 'Something amazing',
  },
  {
    title: 'Blog 2',
    content: 'Something amazing',
  },
  {
    title: 'Blog 3',
    content: 'Something amazing',
  },
  {
    title: 'Blog 4',
    content: 'Something amazing',
  },
];

router.get('/', (req, res) => {
  res.render('home', { title: 'Feed', blogs: BLOGS });
});

router.get('/post', (req, res) => {
  res.render('blog-post', { title: 'Post Blog' });
});

router.post(
  '/post',
  body('title').isLength({ min: 10 }),
  body('content').isLength({ min: 100 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.redirect('/blogs');
  }
);

module.exports = router;
