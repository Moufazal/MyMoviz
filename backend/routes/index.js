var express = require('express');
var router = express.Router();

// import movieSchema
var movieModel = require('../models/movie');
// Sync Request Module
var syncRequest = require('sync-request');
// Import key
const {apiKey} = require('../config/config');
// Cors module
var cors = require('cors');


var date = new Date();
var dateToday = date.getFullYear() + "-" + String(date.getMonth()+1).padStart(2,0) + "-" + String(date.getDate()).padStart(2,0);


// Set up a whitelist and check it to avoid CORS error:
var whitelist = ['http://localhost:3001',]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

/* Middleware for CORS policy: Access-Control-Allow-Origin */
router.use(cors(corsOptions));


/* GET / List of all movies */
router.get('/allMovies', async function(req, res, next) {

  var data = await syncRequest('GET', `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr-FR&region=FR&page=1&sort_by=release_date.desc&include_adult=false&include_video=false&release_date.lte=${dateToday}&append_to_response=videos`);

  var movieData = await JSON.parse(data.body);
  var movies = await movieData.results;

  var moviesId = [];
  for (var i=0; i < movies.length; i++){
    moviesId.push(movies[i].id);
  }

  var movieDisplayInfos = [];
  moviesId.forEach(element => {
    var element = element;
    // Second request to find trailer for each movie
    var video = syncRequest('GET', `https://api.themoviedb.org/3/movie/${element}?api_key=${apiKey}&language=fr-FR&append_to_response=videos`);

    var videoData = JSON.parse(video.body);
    if(videoData.overview !== "" ){
      let moviePicture = "";
      let movieTrailer = "";

      if(videoData.videos.results[0] === undefined){
        movieTrailer = null;
      }else{
        movieTrailer = 'https://www.youtube.com/watch?v='+videoData.videos.results[0].key;
      }
      if(videoData.poster_path === null){
        moviePicture = './images/cinema.jpg';
      }else{
        moviePicture = 'https://image.tmdb.org/t/p/w500/'+videoData.poster_path;
      }

      movieDisplayInfos.push({
        movieId:videoData.id,
        movieName:videoData.original_title,
        movieDescription:videoData.overview,
        movieImg:moviePicture,
        movieTrailer: movieTrailer,
        movieVoteAvg:videoData.vote_average*5/10,
        movieVoteCount:videoData.vote_count,
        movieReleaseDate:videoData.release_date
      });
    }
  });
  res.json({result:true, movies: movieDisplayInfos});
});



/* GET / List of movies in whishlist */
router.get('/wishList', async function(req, res, next) {
  var movies = await movieModel.find();
  res.json({movies})
});


/* POST / Save liked movie in database */
router.post('/wishList', async function(req, res, next) {
  var newMovie = new movieModel({
    movieName:req.body.name,
    movieImg:req.body.img,
  });
  var savedMovie = await newMovie.save();
    var result = false
    if(savedMovie.movieName){
      result = true
    }
  res.json({result})
});


/* DELETE / Delete Movie in database */
router.delete('/wishList/:name', async function(req, res, next) {
  var deleteMovie = await movieModel.deleteOne({movieName: req.params.name});
  var result = false
  if(deleteMovie.deletedCount == 1){
    result = true
  }
  res.json({result})
});



module.exports = router;
