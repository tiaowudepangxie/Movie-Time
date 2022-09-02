import ReviewsDAO from "../dao/reviewsDAO.js";

// DAO working with MongoDB
// Controller receive input from Insomnia and use DAO to update data in mongoDB

export default class ReviewsController{

    static async apiPostReview(req, res, next){
        try{
            // getting from Insomnia 
            const movieId = req.body.movie_id;
            const review = req.body.review;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }

            const date = new Date();

            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                userInfo,
                review,
                date
            );

            var {error} = reviewResponse;
            console.log(error);
            if(error){
                // 500 is server error code
                res.status(500).json({error: "Unable to post review."});
            } else{
                res.json({status: "success"});
            }
        } catch(e){
            res.status(500).json({error: e.message});
        }
    }

    static async apiUpdateReview(req, res, next){
        try {
            // getting from Insomnia 
            const reviewId = req.body.review_id;
            const userId = req.body.user_id;
            const review = req.body.review;
            const date = new Date()

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                userId,
                review,
                date
            )

            var { error } = reviewResponse
            if(error) {
                // 400 is caused by user
                res.status(400).json({ error })
            }

            if(reviewResponse.modifiedCount === 0) { // if not updated
                throw new Error(
                    "Error - there is no update"
                )
            }

            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteReview(req, res, next){
        try{
            // getting from Insomnia 
            const reviewId = req.body.review_id;
            const userId = req.body.user_id;
            console.log(reviewId);
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId
            )

            // var {error} = reviewResponse;
            // console.log(error);
            // if(error){
            //     // 500 is server error code
            //     res.status(500).json({error: "Unable to post review."});
            // } else{
            //     res.json({status: "success"});
            // }

            res.json({ status: "success" })

        } catch(e){
            res.status(500).json({ error: e.message })
        }
    }
}