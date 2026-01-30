import express from 'express';
import { getAllAlbums,getAllSongs,getAllSongsOfAlbum,getSingleSong } from '../controllers/song.controller.js';

const router = express.Router();

/**
 * @openapi
 * /api/v1/album/all:
 *   get:
 *     summary: Get all albums
 *     tags:
 *       - Albums
 *     responses:
 *       200:
 *         description: List of all albums
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Album'
 */


router.route('/album/all').get(getAllAlbums);

/**
 * @openapi
 * /api/v1/song/all:
 *   get:
 *     summary: Get all songs
 *     tags:
 *       - Songs
 *     responses:
 *       200:
 *         description: List of all songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */

router.route('/song/all').get(getAllSongs);

/**
 * @openapi
 * /api/v1/album/{id}:
 *   get:
 *     summary: Get all songs of an album
 *     tags:
 *       - Albums
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Album ID
 *     responses:
 *       200:
 *         description: Album and its songs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 album:
 *                   $ref: '#/components/schemas/Album'
 *                 songs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Song'
 *       404:
 *         description: Album not found
 */

router.route('/album/:id').get(getAllSongsOfAlbum);

/**
 * @openapi
 * /api/v1/song/{id}:
 *   get:
 *     summary: Get a single song by ID
 *     tags:
 *       - Songs
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Song details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       404:
 *         description: Song not found
 */
router.route('/song/:id').get(getSingleSong);
export default router;