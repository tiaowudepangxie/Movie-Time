import axios from "axios";


//Axios is a promise-based HTTP Client for node.js and the browser. 
// It is isomorphic (= it can run in the browser and nodejs with the same codebase). 
// On the server-side it uses the native node.js http module, while on the client (browser) it uses XMLHttpRequests.
class MovieDataService {

    // those two will go invoke MoviesController.apiGetMovies(req, res, next)
    // req.query = {page: page, by(title or rated): query}

    getAll(page = 0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?page=${page}`);
    }

    find(query, by="title", page=0) {
        return axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?${by}=${query}&page=${page}`
        );
    }

    getRatings() {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/ratings`);
    }

    get(id) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/id/${id}`);
    }

    createReview(data) {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, data);
    }
    
    updateReview(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, data);
    }

    deleteReview(data) {
        return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, { data });
    }

}

export default new MovieDataService();