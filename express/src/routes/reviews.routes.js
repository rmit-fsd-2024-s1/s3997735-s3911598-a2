// const express = require('express');
// const router = express.Router();
// const reviewsController = require('../controllers/reviews.controller.js'); // 确保路径正确
//
//
// // 创建评论
// router.post('/reviews', async (req, res) => {
//     try {
//         const { content, rating, productId } = req.body;
//         const review = await Review.create({ content, rating, productId });
//         res.status(201).json(review);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// // 获取评论列表
// router.get('/reviews', async (req, res) => {
//     try {
//         const { productId } = req.query;
//         const reviews = await Review.findAll({ where: { productId, isDeleted: false } });
//         res.status(200).json(reviews);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// // 编辑评论
// router.put('/reviews/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { content, rating } = req.body;
//         const review = await Review.findByPk(id);
//         if (review) {
//             review.content = content;
//             review.rating = rating;
//             await review.save();
//             res.status(200).json(review);
//         } else {
//             res.status(404).json({ error: 'Review not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// // 删除评论
// router.delete('/reviews/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const review = await Review.findByPk(id);
//         if (review) {
//             review.isDeleted = true;
//             await review.save();
//             res.status(200).json({ message: 'Review deleted' });
//         } else {
//             res.status(404).json({ error: 'Review not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// module.exports = router;
