import React, { useState } from 'react';
import MovieDataService from "../services/movies";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Containter from 'react-bootstrap/Container';
//import { response } from 'express';

const AddReview = ({ user }) => {
    const navigate = useNavigate(); //will enable us to send our user back to the movie page when the review has been submitted.
    let params = useParams();
    let location = useLocation();

    let editing = false;
    let initialReviewState = "";
    // it should a differnet value if we are editing instead of creating

    if (location.state && location.state.currentReview) {
        editing = true;
        initialReviewState = location.state.currentReview.review;
    }

    const [review, setReview] = useState(initialReviewState);

    const onChangeReview = e => {
        const review = e.target.value;
        setReview(review);
    }

    const saveReview = () => {
        var data = {
            review: review,
            name: user.name,
            user_id: user.googleId,
            movie_id: params.id
        }

        if (editing) {
            data.review_id = location.state.currentReview._id;
            MovieDataService.updateReview(data)
                .then(response => {
                    navigate("/movies/"+params.id)
                })
                .catch(e => {
                    console.log(e);
                })
        } else {
            MovieDataService.createReview(data)
                .then(response => {
                    navigate("/movies/"+params.id)
                })
                .catch(e => {
                    console.log(e);
                })
        }
    }

    return (
        <Containter className='main-container'>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
                    <Form.Control
                        as="textarea"
                        type='text'
                        required
                        review={review}
                        onChange={onChangeReview}
                        defaultValue={editing ? location.state.currentReview.review : ""}
                    />
                </Form.Group>
                <Button variant="primary" onClick={saveReview}>
                    Submit
                </Button>
            </Form>
        </Containter>
    )
}

export default AddReview