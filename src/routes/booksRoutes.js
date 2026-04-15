const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalItems:
 *           type: integer
 *           example: 6
 *         totalPages:
 *           type: integer
 *           example: 1
 *         hasPrevPage:
 *           type: boolean
 *           example: false
 *         hasNextPage:
 *           type: boolean
 *           example: false
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: JK-45
 *         title:
 *           type: string
 *           example: Harry Potter
 *         author:
 *           type: string
 *           example: J.K Rowling
 *         stock:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BooksResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Books fetched successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *         meta:
 *           $ref: '#/components/schemas/PaginationMeta'
 *     BookPayload:
 *       type: object
 *       required:
 *         - code
 *         - title
 *         - author
 *         - stock
 *       properties:
 *         code:
 *           type: string
 *           example: NEW-01
 *         title:
 *           type: string
 *           example: Clean Code
 *         author:
 *           type: string
 *           example: Robert C. Martin
 *         stock:
 *           type: integer
 *           example: 3
 *     SingleBookResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Book created successfully
 *         data:
 *           $ref: '#/components/schemas/Book'
 *     DeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Book deleted successfully
 *         data:
 *           type: object
 *           properties:
 *             deleted:
 *               type: boolean
 *               example: true
 * /api/books:
 *   get:
 *     summary: Get paginated books
 *     tags: [Library]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by code, title, or author
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *         description: |
 *           Dynamic filter expression. Examples:
 *           - stock!=0
 *           - stock>3
 *           - title like harry
 *           - author~Rowling
 *           - stock!=0,author~Rowling
 *     responses:
 *       200:
 *         description: Books fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BooksResponse'
 *   post:
 *     summary: Create a new book
 *     tags: [Library]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookPayload'
 *     responses:
 *       200:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleBookResponse'
 *
 * /api/books/{id}:
 *   put:
 *     summary: Update book by id
 *     tags: [Library]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookPayload'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleBookResponse'
 *   delete:
 *     summary: Delete book by id
 *     tags: [Library]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       400:
 *         description: Book cannot be deleted because it has borrowing history
 *       404:
 *         description: Book not found
 *
 */
router.get('', booksController.getBooks);
router.post('', booksController.createBook);
router.put('/:id', booksController.updateBook);
router.delete('/:id', booksController.deleteBook);

module.exports = router;
