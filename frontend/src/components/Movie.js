import React, {useState} from 'react';
import { Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons'

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Button
  } from 'reactstrap';



function Movie(props){
    // State to rate movie
    const [myRatingMovie, setMyRatingMovie] = useState(0);
    // State click or not movie rate
    const [isRatingMovie, setIsRatingMovie] = useState(false);
    // State for global rating
    const [rating, setRating] = useState(props.globalRating);
    // State for the number of vote
    const [countRating, setCountRating] = useState(props.globalCountRating);


    // Send to parent movieName and Img to add or delete them in whishList
    var handleClickChangeLiked = (name, img) => {
        // if movie already added delete it, else add it to wishlist
        if(props.movieSee === true){
            props.handleClickDeleteMovieParent(name);
        } else{
            props.handleClickAddMovieParent(name, img);
        }
    };

    // change like heart color if it is liked or not
    var likeColor="";
    if(props.movieSee){
        likeColor = {color:'red', cursor:'pointer'}
    }else{
        likeColor = {cursor:'pointer'}
    }

    // Display only liked movies card when the link "wishlist" is clicked
    var display = null;
    if(props.linkWishList && !props.movieSee) {
        display = 'none'
    }

    // MyRating Count
    var setMyRating = (rating) => {
        setMyRatingMovie(rating);
        setIsRatingMovie(true);
    }

    // Display star for my rating
    let myRatingTab = [];

    for (var i = 0; i < 5; i++){
        var myRatingColor = {};
        if (i < myRatingMovie){
            myRatingColor = {color: '#f1c40f'};
        }
        let count = i+1
        myRatingTab.push(<FontAwesomeIcon onClick={() => setMyRating(count)} icon={faStar} style={myRatingColor} key={i} />)
    }

    //Display star for Global rating
    var nbTotalNote = rating*countRating;
    var nbTotalVote = countRating;

    if(isRatingMovie){
        nbTotalVote += 1;
        nbTotalNote += myRatingMovie;
    }

    var avgTotal = Math.round(nbTotalNote / nbTotalVote);

    var tabGlobalRating = []
    for(var j = 0; j < 5; j++){
        var color = {};
        if(j < avgTotal){
            color = {color: '#f1c40f'};
        }
        tabGlobalRating.push(<FontAwesomeIcon icon={faStar} style={color} key={j} />);
    }

    // Set to visible or not the trailer button if a trailer exist
    var btnTraierVisibility = "visible";
    if(props.movieTrailer == null){
        btnTraierVisibility = "hidden";
    }



    return (
                <Col xs="12" lg="6" xl="4" style={{marginTop: '3%', display}}>
                    <Card>
                        <CardImg top width="100%" style={{height:'50vh'}} src={props.movieImg} alt={props.movieName} />
                        <CardBody style={{height:"40vh"}}>
                            <CardTitle>{props.movieName}</CardTitle>
                            <div className="d-flex justify-content-between mb-n3">
                                <p>
                                    Avis Global &nbsp;
                                    {tabGlobalRating}
                                    <span> ({nbTotalVote})</span>
                                </p>
                                <p className="text-right">Like <FontAwesomeIcon style={likeColor} icon={faHeart} onClick={ ()=> handleClickChangeLiked(props.movieName, props.movieImg) }/>
                                </p>
                            </div>
                            <p className="text-left">
                                    Mon avis &nbsp;
                                    {myRatingTab}
                            </p>
                            <CardText style={{height:"20vh", overflow:"overlay"}}>{props.movieDescription}</CardText>
                        </CardBody>
                        <p>Release date: {props.movieReleaseDate}</p>
                        <Button style={{visibility:btnTraierVisibility}}><a className="btnTrailer" href={props.movieTrailer} target="_blank">Watch Trailer</a></Button>
                    </Card>
                </Col>
    )
}



export default Movie;