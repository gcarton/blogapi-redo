const express = require('express');
const app = express();
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const blogRouter = require('./blogRouter');

app.use(morgan('common'));
app.use(express.static('common'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/index.html');
// });

app.use('/posts',blogRouter);

  // app.get('/posts', (req,res)=>{
  //   Blogs
  //     .find()
  //     .then(blogPosts =>{
  //       res.json({
  //         posts:blogPosts.map(
  //           (blogPost)=>blogPost.apiRepr())
  //       });
  //     })
  //     .catch(
  //       err=> {
  //         console.error(err);
  //         res.status(500).json({message: 'Internal server error'})
  //       });
  // });

  // app.get('/posts/:id', (req,res)=>{
  //   Blogs
  //   .findById(req.params.id)
  //   .then(post=>res.json(blogpost.apiRepr()))
  //   .catch(err => {
  //     console.error(err);
  //     res.status(500).json({message: 'internal server error'})
  //   });
  // });

  // app.post('/posts',(req,res) =>{
  //   const requiredFields = ['title','content','author','publishDate'];
  //   for(let i=0; i<requiredFields.length; i++) {
  //     const field = requiredFields[i];
  //     if(!(field in req.body)){
  //       const message= 'Missing \`${field}\` in request body'
  //       console.error(message);
  //     }
  //   }

  //   Blogs
  //     .create({
  //       title: req.body.name,
  //       content: req.body.title,
  //       author: req.body.author,
  //       publishDate: req.body.publishDate})
  //     .then(
  //       blogpost => res.sttus(201).json(blogpost.apiRepr()))
  //     .catch(err => {
  //       console.error(err);
  //       res.status(500).json({message: 'Internal serer error'});
  //     });
  //     });

let server

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl,err => {
      if (err) {
        return reject(err);
      }
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve();
    })
    .on('error', err => {
      mongoose.disconnect();
      reject(err)
    });
  });
  });
}


// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return mongoose.disconnect().then(() => {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
})};


if (require.main === module) {
  runServer().catch(err => console.error(err));
};
// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.

module.exports = {app, runServer, closeServer};



// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`)