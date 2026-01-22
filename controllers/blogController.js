import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import slugify from "slugify";

const BASE_URL = "http://localhost:5000";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({ 
        include: [{ model: Comment, as: "comments", order: [["created_at", "DESC"]] }]
     });

     const blogsWithFullImagePath = blogs.map(blog => ({
      ...blog.toJSON(),
      image: blog.image ? `${BASE_URL}${blog.image}` : null
    }));

    res.json(blogsWithFullImagePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get blog details by slug
export const getBlogDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({
      where: { slug },
      include: [{ model: Comment, as: "comments", order: [["created_at", "DESC"]] }]
    });

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const blogWithFullImagePath = {
      ...blog.toJSON(),
      image: blog.image ? `${BASE_URL}${blog.image}` : null
    };

    res.json(blogWithFullImagePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, author, category, image } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ error: "Title, content, and author are required" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    let imagePath = "";
    if (req.file) {
      imagePath = `/images/blogs/${req.file.filename}`;
    }

    const newBlog = await Blog.create({
      title,
      slug,
      content,
      author,
      category: category || "",
      image: imagePath
    });

    res.status(201).json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    let imagePath = blog.image;
    if (req.file) {
      imagePath = `/images/blogs/${req.file.filename}`;
    }

    const slug = slugify(title || blog.title, { lower: true, strict: true });

    await blog.update({
      title: title || blog.title,
      content: content || blog.content,
      category: category || blog.category,
      slug,
      image: imagePath
    });

    res.json({ message: "Blog updated successfully", blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    await blog.destroy();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// Post a comment
export const postComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, email, message } = req.body;

    const blog = await Blog.findOne({ where: { slug } });
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const comment = await Comment.create({
      blogId: blog.id,
      name,
      email,
      message
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Find all blogs matching the category (case-insensitive)
    const blogs = await Blog.findAll({
      where: { category },
      include: [{ model: Comment, as: "comments", order: [["created_at", "DESC"]] }],
      order: [["created_at", "DESC"]]
    });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found for this category" });
    }

    const blogsWithFullImagePath = blogs.map(blog => ({
      ...blog.toJSON(),
      image: blog.image ? `${BASE_URL}${blog.image}` : null
    }));

    res.status(200).json(blogsWithFullImagePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};