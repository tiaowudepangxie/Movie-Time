import update from 'immutability-helper'
import React, { useState, useEffect, useCallback } from 'react';
import { FavCard } from './FavCard.js'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

import FavoriteDataService from "../services/favorites";
import "./Favorite.css";

const style = {
  width: 500,
  margin: '1em'
}
const Favorite = ({ user, favorites }) => {
  {
    // console.log("favorites", favorites)
    console.log("user", user)
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    const retrieveAllMovies = useCallback(() => {
      console.log("retrieveAllMovies")
      if (!user) {
        return;
      }
      FavoriteDataService.getFavoriteMovies(user.googleId)
        .then(response => {
          console.log("response", response.data)
          setFavoriteMovies(response.data.map((movie, index) => {
            return {
              id: index,
              text: movie
            }
          }))
        })
        .catch(e => {
          console.log(e);
        });
    }, [user]);

    useEffect(() => {
      retrieveAllMovies();
      //   const m = movies.filter((movie) => favorites.includes(movie._id));
      //   setFavoriteMovies(m);
    }, [retrieveAllMovies]);


    console.log("favoriteMovies", favoriteMovies)

    const moveCard = useCallback((user, dragIndex, hoverIndex) => {
      setFavoriteMovies((prevCards) => {
        let newFavMovies = update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
        
        console.log("newFavMovies", newFavMovies);
        let favIds = newFavMovies.map(movie => movie.text._id)
        
        console.log('user', user)
        if (user) {
          var data = {
            _id: user.googleId,
            favorites: favIds
          }
          
          console.log('new data !', data)
          FavoriteDataService.updataFavorites(data)
            .catch(e => {
              console.log(e);
            })
        }
        
        return newFavMovies;
    })
    }, [user])

    const renderCard = useCallback((card, index) => {
      return (
        <FavCard
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={(dragIndex, hoverIndex) => moveCard(user, dragIndex, hoverIndex)}
        />
      )
    }, [moveCard, user])

    return (
      <>
        <Container className='favoritesContainer'>
          <DndProvider backend={HTML5Backend}>
            <Row>
              <Col className='favoritesPanel'>
                Drag your favorites to rank them
              </Col>
              <Col>
                <div style={style}>{favoriteMovies.map((card, i) => renderCard(card, i))}</div>
              </Col>
            </Row>
          </DndProvider>
        </Container>
      </>
    )
  }
}

export default Favorite;