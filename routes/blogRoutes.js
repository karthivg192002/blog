import express from "express";
import { getAllBlogs, getBlogDetails, createBlog, updateBlog, deleteBlog,  postComment, getBlogsByCategory } from "../controllers/blogController.js";
import upload from "../middlewares/upload.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management API
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog with optional image
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/blogs", upload.single("image"), createBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update an existing blog
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the blog
 *               content:
 *                 type: string
 *                 description: Updated content of the blog
 *               category:
 *                 type: string
 *                 description: Blog category
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional new image for the blog
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog updated successfully
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.put("/blogs/:id", upload.single("image"), updateBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog to delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog deleted successfully
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.delete("/blogs/:id", deleteBlog);

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Server error
 */
router.get("/blogs", getAllBlogs);

/**
 * @swagger
 * /api/blogs/{slug}:
 *   get:
 *     summary: Get a blog by slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog slug
 *     responses:
 *       200:
 *         description: Blog details with comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.get("/blogs/:slug", getBlogDetails);

/**
 * @swagger
 * /api/blogs/{slug}/comments:
 *   post:
 *     summary: Post a comment for a blog
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentCreate'
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.post("/blogs/:slug/comments", postComment);

/**
 * @swagger
 * /api/blogs/category/{category}:
 *   get:
 *     summary: Get blogs by category
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: List of blogs under the given category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       404:
 *         description: No blogs found for this category
 *       500:
 *         description: Server error
 */
router.get("/blogs/category/:category", getBlogsByCategory);

export default router;
