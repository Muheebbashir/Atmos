
import express from 'express';
import { addAlbum,addSong ,addThumbnail,deleteAlbum,deleteSong} from '../controllers/admin.controller.js';
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
 *               thumnail:
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
router.route('/album/new').post(isAuth, uploadSingle('thumnail'), addAlbum);
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

/**
 * @openapi
 * /api/v1/song/{id}:
 *   post:
 *     summary: Add a thumbnail to a song
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The song ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thumbnail added successfully
 *       400:
 *         description: Bad request (missing file or song does not exist)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       500:
 *         description: Server error
 */
router.route('/song/:id').post(isAuth, uploadSingle('thumbnail'), addThumbnail);

/**
 * @openapi
 * /api/v1/album/{id}:
 *   delete:
 *     summary: Delete an album
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The album ID
 *     responses:
 *       200:
 *         description: Album deleted successfully
 *       400:
 *         description: Bad request (album does not exist)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       500:
 *         description: Server error
 */
router.route('/album/:id').delete(isAuth,deleteAlbum);

/**
 * @openapi
 * /api/v1/song/{id}:
 *   delete:
 *     summary: Delete a song
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The song ID
 *     responses:
 *       200:
 *         description: Song deleted successfully
 *       400:
 *         description: Bad request (song does not exist)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       500:
 *         description: Server error
 */
router.route('/song/:id').delete(isAuth,deleteSong);
export default router;