import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv";
import MoviesDAO from './dao/moviesDAO.js';
import ReviewsDAO from './dao/reviewsDAO.js';
import FavoritesDAO from './dao/favoritesDAO.js';

async function main(){
    dotenv.config();

    const client = new mongodb.MongoClient(
        process.env.MOVIEREVIEWS_DB_URI
    )
    const port = process.env.PORT || 8000;

    try{
        // Connect to MongoDB server. client is a promise
        await client.connect();
        // pass the client object to the DAO
        await MoviesDAO.injectDB(client);
        await ReviewsDAO.injectDB(client);
        await FavoritesDAO.injectDB(client);

        // app is our server
        app.listen(port, () =>{
            console.log('Server is running on port: ' + port);
        })
    } catch(e){
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);