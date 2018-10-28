var mongoose = require('mongoose');
require("..//dbSetup.js")();
var db = mongoose.connection;
var users = require('../models/User.js');
var User = mongoose.model('User', users.UserSchema);
var positions = require('../models/Position.js');
var Position = mongoose.model('Position', positions.PositionSchema);
var posfacade= require('./positionFacade');


/* In this method implement the following steps:
Check whether the user exist, and if, that passwords matches. If not throw an error.
Update the position for the User. Use Position.findOneAndUpdate(....)  (provide it with the upsert option, so it will create the Document if it does not exist). Remember to update created also.
Now create a utility method which will find all nearby friends given a point and dist (use this example as a template, but replace db.places with Position, since we are using mongoose, and rename location to loc  ).
The method implemented above will find all the nearby Position objects, but it will not populate it with User details. Se the section related to populate in the tutorial for how to do that:
Finally use map on the list of friends to reformat it as requested for the endpoint
IMPORTANT: Add this line below your PostionSchema, in order to create the required 2dsphere index: PositionSchema.index({ loc: "2dsphere" },{ "background": true }); */


async function login(username,password,longitude,latitude,distance){
let user = await User.findOne({ userName: username },
    function(err, res) {
      if (err) throw err;
      console.log('login answer ' + res)

    });
if(user.password===password){
   posfacade.addPosition(longitude,latitude,user._id, false);
   return friendFinderUtility(longitude,latitude,1,distance);
}else{
   return 'wrong username or password'
    }
}



async function friendFinderUtility(longitude,latitude, minDist, maxDist){

  return  Position.find(
        {
          loc:
            { $near :
               {
                 $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
                 $minDistance: minDist,
                 $maxDistance: maxDist
               }
            }
        }
     )
}

module.exports={login}