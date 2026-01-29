
import express from 'express';
import { addAlbum,addSong } from '../controllers/admin.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { uploadSingle } from '../middleware/multer.js';

const router = express.Router();


/**
 * @openapi
 * /api/v1/album/new:
 *   post:
 *     summary: Add a new album
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My Album"
 *               description:
 *                 type: string
 *                 example: "A great album."
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Album created successfully
 *       400:
 *         description: Bad request (missing fields or file)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       500:
 *         description: Server error
 */
router.route('/album/new').post(isAuth, uploadSingle('thumbnail'), addAlbum);
/**
 * @openapi
 * /api/v1/song/new:
 *   post:
 *     summary: Add a new song
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My Song"
 *               description:
 *                 type: string
 *                 example: "A great song."
 *               album_id:
 *                 type: integer
 *                 example: 1
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Song created successfully
 *       400:
 *         description: Bad request (missing fields or file)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       500:
 *         description: Server error
 */
router.route('/song/new').post(isAuth, uploadSingle('audio'), addSong);
export default router;