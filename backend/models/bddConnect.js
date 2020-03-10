var mongoose = require('mongoose');
const {mongoUrl} = require('../config/config');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  mongoose.connect(`${mongoUrl}`,
      options,
      function(err) {
        if(err){
          console.log(err);
        }else{
          console.log('MongoDb connection is OK');
        }
      }
  );

  module.exports = mongoose;