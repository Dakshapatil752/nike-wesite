// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import product data
const products = require('./data/products.json');

// Routes
app.get('/', (req, res) => {
    res.render('home', { 
        title: 'Nike - Just Do It',
        featuredProducts: products.slice(0, 3)
    });
});

app.get('/products', (req, res) => {
    const category = req.query.category;
    let filteredProducts = products;
    
    if (category && category !== 'all') {
        filteredProducts = products.filter(p => 
            p.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    res.render('products', { 
        title: 'Products - Nike',
        products: filteredProducts,
        currentCategory: category || 'all'
    });
});

app.get('/product/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).render('404', { title: 'Product Not Found' });
    }
    res.render('product', { 
        title: `${product.name} - Nike`,
        product: product 
    });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Nike' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Nike' });
});

// API Routes
app.post('/subscribe', (req, res) => {
    const { email } = req.body;
    console.log(`Newsletter subscription: ${email}`);
    
    // Simulate database save
    setTimeout(() => {
        res.json({ 
            success: true, 
            message: 'Successfully subscribed to newsletter!' 
        });
    }, 1000);
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log('Contact form submitted:', { name, email, message });
    
    // Simulate processing
    setTimeout(() => {
        res.json({ 
            success: true, 
            message: 'Thank you for your message! We\'ll get back to you soon.' 
        });
    }, 1000);
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Server Error',
        error: err.message 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
});