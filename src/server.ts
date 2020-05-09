import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredImage/', async (req, res) =>{
    const { image_url } = req.query;
    
    //checks if the url is defined 
    if(!image_url){
      return res.status(400).send("Please enter a image URL!!!!!");
    }
    
    //checks if the file_type is supported
    if(image_url.endsWith('.png') || image_url.endsWith('.jpeg') || image_url.endsWith('.jpg')){
      let imageLink: string;
    try {
      imageLink = await filterImageFromURL(image_url);
    } catch (err) {
      res.status(204).send('ImageLink could Not be created');
    }
    res.status(200).sendFile(imageLink);
    res.on('finish', () => {
      deleteLocalFiles([imageLink]);
    });
    }
    else{
      return res.status(400).send("Image format not supported");
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();