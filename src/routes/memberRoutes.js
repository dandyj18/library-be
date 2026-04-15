const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

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
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: M001
 *         name:
 *           type: string
 *           example: Angga
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     MembersResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Members fetched successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Member'
 *         meta:
 *           $ref: '#/components/schemas/PaginationMeta'
 *     MemberPayload:
 *       type: object
 *       required:
 *         - code
 *         - name
 *       properties:
 *         code:
 *           type: string
 *           example: M010
 *         name:
 *           type: string
 *           example: Budi
 *     SingleMemberResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Member created successfully
 *         data:
 *           $ref: '#/components/schemas/Member'
 *     DeleteMemberResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Member deleted successfully
 *         data:
 *           type: object
 *           properties:
 *             deleted:
 *               type: boolean
 *               example: true
 *
 * /api/members:
 *   get:
 *     summary: Get paginated members
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
 *         description: Search by code or name
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *         description: |
 *           Dynamic filter expression. Examples:
 *           - name like angga
 *           - code!=M001
 *           - name~bud
 *     responses:
 *       200:
 *         description: Members fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembersResponse'
 *   post:
 *     summary: Create a new member
 *     tags: [Library]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberPayload'
 *     responses:
 *       200:
 *         description: Member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleMemberResponse'
 *
 * /api/members/{id}:
 *   put:
 *     summary: Update member by id
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
 *             $ref: '#/components/schemas/MemberPayload'
 *     responses:
 *       200:
 *         description: Member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleMemberResponse'
 *   delete:
 *     summary: Delete member by id
 *     tags: [Library]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteMemberResponse'
 *       400:
 *         description: Member cannot be deleted because it has borrowing history
 *       404:
 *         description: Member not found
 */
router.get('', memberController.getMembers);
router.post('', memberController.createMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

module.exports = router;
