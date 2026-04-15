const express = require('express');
const router = express.Router();
const borrowingsController = require('../controllers/borrowingsControlle');

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
 *     Borrowing:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         member_id:
 *           type: integer
 *           example: 1
 *         book_id:
 *           type: integer
 *           example: 2
 *         borrow_date:
 *           type: string
 *           format: date
 *           example: 2026-04-10
 *         return_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2026-04-14
 *         due_date:
 *           type: string
 *           format: date
 *           example: 2026-04-17
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-04-10T08:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-04-10T08:00:00.000Z
 *         member:
 *           $ref: '#/components/schemas/Member'
 *         book:
 *           $ref: '#/components/schemas/Book'
 *     BorrowingsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Borrowings fetched successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Borrowing'
 *         meta:
 *           $ref: '#/components/schemas/PaginationMeta'
 *     BorrowingPayload:
 *       type: object
 *       required:
 *         - member_id
 *         - book_id
 *         - borrow_date
 *         - due_date
 *       properties:
 *         member_id:
 *           type: integer
 *           example: 1
 *         book_id:
 *           type: integer
 *           example: 2
 *         borrow_date:
 *           type: string
 *           format: date
 *           example: 2026-04-12
 *         return_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: null
 *         due_date:
 *           type: string
 *           format: date
 *           example: 2026-04-19
 *     SingleBorrowingResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Borrowing created successfully
 *         data:
 *           $ref: '#/components/schemas/Borrowing'
 *     DeleteBorrowingResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Borrowing deleted successfully
 *         data:
 *           type: object
 *           properties:
 *             deleted:
 *               type: boolean
 *               example: true
 *
 *
 * /api/borrowings:
 *   get:
 *     summary: Get paginated borrowings
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
 *         description: Search by member or book (code/title/name)
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *         description: |
 *           Dynamic filter expression. Examples:
 *           - member_name like angga
 *           - book_title~harry
 *           - due_date>=2026-04-20
 *           - member_id=1,book_id!=3
 *     responses:
 *       200:
 *         description: Borrowings fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BorrowingsResponse'
 *   post:
 *     summary: Create a new borrowing
 *     tags: [Library]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowingPayload'
 *     responses:
 *       200:
 *         description: Borrowing created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleBorrowingResponse'
 *
 * /api/borrowings/{id}:
 *   put:
 *     summary: Update borrowing by id
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
 *             $ref: '#/components/schemas/BorrowingPayload'
 *     responses:
 *       200:
 *         description: Borrowing updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleBorrowingResponse'
 *   delete:
 *     summary: Delete borrowing by id
 *     tags: [Library]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Borrowing deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteBorrowingResponse'
 *       404:
 *         description: Borrowing not found
 */

router.get('', borrowingsController.getBorrowings);
router.post('', borrowingsController.createBorrowing);
router.put('/:id', borrowingsController.updateBorrowing);
router.delete('/:id', borrowingsController.deleteBorrowing);

module.exports = router;
