const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('spot','I am fucking weird','the dog','26th Oct 2017');
BlogPosts.create('puss','I am a sneaky cunt','the cat','26th Oct 2017');
BlogPosts.create('jaws','I am a fishy - kill me','the fish','26th Oct 2017');

router.get('/', (req,res) =>{
	res.json(BlogPosts.get());

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

router.delete('/:id', (req,res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog item \`${req.params.ID}\``);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req,res) => {
	const requiredFields = ['title', 'content','author','publishDate'];
	for(let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}

	if (req.params.id !== req.body.id){
		const message = (
			`Request path id (${req.params.id}) and request body id` `($({req.body.id}\``);
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog item \${req.params.id}\``);
	const updatedBlog = BlogPosts.update({
		title:req.params.title,
		content:req.params.content,
		ingredients:req.body.ingredients
 });
  res.status(204).end();
}});

module.exports = router;