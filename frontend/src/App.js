import React, {useState, useEffect} from 'react';

import {
  Row,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  ListGroupItem,
  ListGroupItemText,
  Popover,
  PopoverHeader,
  PopoverBody,
  Button,
  ListGroup
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm} from '@fortawesome/free-solid-svg-icons'

import './App.css';

// import movie component
import Movie from './components/Movie';

function App() {
  // state: Toggle
  const [popoverOpen, setPopoverOpen] = useState(false);
  // state: Number of movies in whishList (count)
  const [moviesCount,setMoviesCount] = useState(0);
  // state: movies added into wishlist
  const [moviesWishList, setMoviesWishList] = useState([])
  // State boolean if the link favorite is clicked or not
  const [wishListLink, setWishListLink] = useState(false);
  // all movies list
  const [allMovieList, setAllMovieList] = useState([])


  const toggle = () => setPopoverOpen(!popoverOpen);

  // Request movies data on component init
  useEffect( () => {
    // Get all movies from webservice
    fetch('http://localhost:3000/allMovies')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        setAllMovieList(data.movies);
      })
      .catch(function(error) {
        console.log('Request failed', error)
      });

    // Get movies liked from database
    fetch('http://localhost:3000/wishList')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // add recovered movies to state
        var wishListData = data.movies.map((movie, i) => {
          return {name: movie.movieName, img: movie.movieImg};
        });
        setMoviesWishList(wishListData);
        setMoviesCount(data.movies.length);
      })
      .catch(function(error) {
        console.log('Request failed', error)
      });
  }, [])


  // Add movie to favorite + save it to the database
  var handleClickAddMovie = async(name, img) => {
    setMoviesCount(moviesCount+1);
    setMoviesWishList([...moviesWishList, {name:name, img:img}]);

    const response = await fetch('http://localhost:3000/wishList',{
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `name=${name}&img=${img}`
    })
  }

  // Remove movie from favorite and from database
  var handleClickDeleteMovie = async (name) => {
    console.log(name);
    setMoviesCount(moviesCount-1);
    setMoviesWishList(moviesWishList.filter(object => object.name !== name));

    const response = await fetch(`http://localhost:3000/wishList/${name}`,{
      method: 'DELETE',
    })
  }

  // This both methods used to set a state true or false if clicked or not in order to show all liked movies
  var handleClickWishListViewOn = () => {
    setWishListLink(true);
  }
  var handleClickWishListViewOff = () => {
    setWishListLink(false);
  }


  // send movies informations to the component movie
  var movieList = allMovieList.map((movie, i) => {
    var result = moviesWishList.find(element => element.name === movie.movieName)
    var isSee = false
    if(result !== undefined){
      isSee = true
    }

    return (<Movie key={i} movieId={movie.movieId} movieSee={isSee} movieName={movie.movieName} movieDescription={movie.movieDescription} movieImg={movie.movieImg} movieTrailer={movie.movieTrailer} globalRating={movie.movieVoteAvg} globalCountRating={movie.movieVoteCount} movieReleaseDate={movie.movieReleaseDate} handleClickAddMovieParent={handleClickAddMovie} handleClickDeleteMovieParent={handleClickDeleteMovie} linkWishList={wishListLink}  />)

  })


  // WishList count and movies informations to display on toggle
  var wishListPopOver = moviesWishList.map( (movie, i) => {
      return (
        <ListGroupItem>
          <ListGroupItemText onClick={() => {handleClickDeleteMovie(movie.name)}}>
          <img width="25%" src={movie.img} alt={movie.name} /> {movie.name}
          </ListGroupItemText>
        </ListGroupItem>
      )
  });


  return (
    <div className="App" >
      <Container-fluid>
            <Navbar color="dark" dark expand="md">
                <NavbarBrand><FontAwesomeIcon style={{fontSize: "2em"}} icon={faFilm}/></NavbarBrand>
                <NavbarToggler onClick={toggle} />
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                          <NavLink href="#" style={{cursor: "pointer"}} onClick={handleClickWishListViewOff}> MyMoviz </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink style={{cursor: "pointer", marginright:"5px"}} onClick={handleClickWishListViewOn} >WishList
                          </NavLink>
                        </NavItem>
                        <Button id="Popover1"  type="button" >{moviesCount} films</Button>
                          <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                            <PopoverHeader>WishList</PopoverHeader>
                            <PopoverBody>
                              <ListGroup>
                              {wishListPopOver}
                              </ListGroup>
                            </PopoverBody>
                          </Popover>
                    </Nav>
            </Navbar>
      </Container-fluid>

      <Container>
        <Row>
          {movieList}
        </Row>
      </Container>

    </div>
  );
}



export default App;
