import axios from "axios";

class FavoriteDataService {

    getFavoriteMovies(userId) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favoritemovies/${userId}`);
    }

    updataFavorites(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorites`, data);
    }
    
    getAllFavorites(userId) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorites/${userId}`);
    }

}

export default new FavoriteDataService();