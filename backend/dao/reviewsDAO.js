import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {

    static async injectDB(conn){
        if(reviews){
            return;
        }
        try{
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection('reviews');
        } catch(e){
            console.error(`Unable to establish connection handle in reviewsDAO: ${e}`);
        }
    }

    static async addReview(movieId, user, review, date){
        try{
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                movie_id: ObjectId(movieId)
            }
            // insertOne is MongoDB API call
            // if the _id is not specified, it will create an unique ObjectId() for the document before inserinting
            return await reviews.insertOne(reviewDoc);
        }
        catch(e){
            console.error(`Unable to post review: ${e}`)
            return {error: e};
        }
    }

    static async updateReview(reviewId, userId, review, date){
        try{
            // updateOne is MongoDB API call
            // db.collection.updateOne(filter, update, options)
            const updateResponse = await reviews.updateOne(
                { _id: ObjectId(reviewId), user_id: userId }, // filter
                { $set: { review: review, date: date } }, // update
            )

            return updateResponse
        }
        catch(e){
            console.error(`Unable to update review: ${e}`)
            return {error: e};
        }
    }

    static async deleteReview(reviewId, userId){
        try{
            const deleteResponse = await reviews.deleteOne({
                _id : ObjectId(reviewId),
                user_id: userId
            })

        } catch(e){
            console.error(`Unable to delete review: ${e}`)
            return {error: e};
        }
    }
}
