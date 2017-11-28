const express = require('express');
const router = express.Router();


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Blogs} = require('./models');

// BlogPosts.create('spot','I am fucking weird','the dog','26th Oct 2017');
// BlogPosts.create('puss','I am a sneaky cunt','the cat','26th Oct 2017');
// BlogPosts.create('jaws','I am a fishy - kill me','the fish','26th Oct 2017');

router.get('/', (req,res)=>{
    Blogs
      .find()
      .then(blogPosts =>{
      	console.log(blogPosts)
        res.json(
        (blogPosts.map(blogPost=>blogPost.apiRepr())));
        })
      .catch(err=> {
          console.error(err);
          res.status(500).json({message: 'Internal server error'})
        });
  	});


router.get('/:id', (req,res)=>{
	Blogs
	.findById(req.params.id)
    .then(blogPosts=>res.json(blogPosts))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'internal server error'})
    });
  });

router.post('/:id',(req,res) =>{
    const requiredFields = ['title','content','author','publishDate'];
    for(let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if(!(field in req.body)){
        const message= 'Missing \`${field}\` in request body'
        console.error(message);
      }
    }

        Blogs
      .create({
        title: req.body.name,
        content: req.body.title,
        author: req.body.author,
        publishDate: req.body.publishDate})
      .then(
        blogpost => res.sttus(201).json(blogpost.apiRepr()))
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal serer error'});
      });
      });

router.put('/:id',jsonParser,(req,res) => {
 if(!(req.body.id && req.params.id === req.body.id)){
 	const message = (
 		`Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`);
 	console.err(message);
 	return res.ststus(400).json({message: message});
 }	

 const toUpdate ={};
 const updateableFields = ['title','content','author'];

 updateableFields.forEach(field=> {
 	if(field in req.body){
 		toUpdate[field]= req.body[field];
 	}
 });

Blogs
.findByIdAndUpdate(req.params.id, {$set: toUpdate})
.then(blog=> res.status(204).end())
.catch(err=>res.status(500).json({message: 'internal server error'}));

});

router.delete('/:id', (req,res)=>{
	Blogs.findByIdAndRemove(req.params.id);
	console.log(`Deleted blog item \`${req.params.ID}\``)
	.then(()=> res.status(204).end())
		.catch(err=>res.status(500).json({message:'internal server error'}));
});
router.post('/',jsonParser, (req,res) => {
	const requiredFields =['title','content','author','publishDate'];
	for(let i=0; i<requiredFields.length;i++) {
		const field=requiredFields[i];
		if(!(field in req.body)){
			const message= `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		
		}
	};

	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
});


module.exports = router
