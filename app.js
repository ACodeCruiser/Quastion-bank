const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); // For method override
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://khannusrat8220:N9310487906@cluster0.iecmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error'));

// Models
const categorySchema = new mongoose.Schema({
    name: String
});

const questionSchema = new mongoose.Schema({
    category: String,
    question: String
});

const Category = mongoose.model('Category', categorySchema);
const Question = mongoose.model('Question', questionSchema);

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(express.static('public'));

// Route to show all categories and questions
app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        const questions = await Question.find();
        res.render('category-list', { categories, questions });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to add a new category
app.get('/categories/new', (req, res) => {
    res.render('new-category', { errors: null });
});

// Route to create a new category
app.post('/categories', async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.redirect('/categories');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to edit a category
app.get('/categories/:id/edit', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.render('edit-category', { category, errors: null });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to update a category
app.put('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.redirect('/categories');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to delete a category
app.delete('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.redirect('/categories');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to add a new question
app.get('/questions/new', async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('new-question', {
            categories,
            selectedCategoryId: null, // Explicitly set to null for new questions
            errors: null
        });
    } catch (err) {
        res.status(500).send(err);
    }
});


// Route to create a new question
app.post('/questions', async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        await newQuestion.save();
        res.redirect('/categories');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to display question list
app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.render('question-list', { questions });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to edit a question
app.get('/questions/:id/edit', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        const categories = await Category.find();
        if (!question) {
            return res.status(404).send('Question not found');
        }
        res.render('edit-question', { question, categories, selectedCategoryId: question.category, errors: null });
    } catch (err) {
        res.status(500).send(err);
    }
});



// Route to delete a question
app.delete('/questions/:id', async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).send('Question not found');
        }
        res.redirect('/questions');
    } catch (err) {
        res.status(500).send(err);
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log('Server is running at port ' + PORT);
});
