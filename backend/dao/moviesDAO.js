import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId

let movies;

export default class MoviesDAO {
    static async injectDB(conn){
        if(movies){
            return;
        }
        try{
            // movies is a database
            movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection('movies');
        }
        catch(e){
            console.error(`Unable to connect in MoviesDAO: ${e}`);
        }
    }

    static async getMovies({
        filters,
        page = 0,
        moviesPerPage = 20,
    } = {}) { // empty object is default parameter in case arg is undefined
        let query;

        if(filters){
            if("title" in filters){
                query = {$text: { $search: filters['title']}}; // for all the text, search 
            } else if("rated" in filters){
                query = {"rated": {$eq: filters['rated']}}; // "rated" filed must be equal to the value followed
            }
        }

        let cursor;
        try{
            //.find returns cursor that matches the query criteria
            // limit: how many items you want to have
            // skip: the number of items you want to skip: will start search from moviesPerPage * page + 1
            cursor = await movies.find(query).limit(moviesPerPage).skip(moviesPerPage * page);

            // cursor converted to a JS array
            const moviesList = await cursor.toArray();
            const totalNumMovies = await movies.countDocuments(query);
            return {moviesList, totalNumMovies};
        } catch(e){
            console.error(`Unable to issue find command, ${e}`);
            return {moviesList: [], totalNumMovies: 0};
        }
    }

    static async getRatings(){
        let ratings = [];
        try{
            ratings = await movies.distinct("rated");
            return ratings;
        } catch(e){
            console.error(`Unable to get ratings, ${e}`);
            return ratings;
        }
    }

    static async getMovieById(id){
        try{
            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }
            ]).next();
        } catch(e){
            console.error(`Something went wrong in getMovieById: ${e}`);
            throw e;
        }
    }
}
