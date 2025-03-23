const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Proxy API requests to Flask backend
app.use('/chart', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
}));

app.use('/chartdata', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/chartdata$': '/chartdata',       // keep default endpoint
    '^/chartdata/(.*)': '/chartdata/$1' // rewrite for symbol endpoints
  },
}));

app.use('/streamlit', createProxyMiddleware({
  target: 'http://localhost:8502',
  changeOrigin: true,
  pathRewrite: {
    '^/streamlit': '/'
  },
}));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Make sure Flask backend is running at http://localhost:5000`);
  console.log(`Make sure Streamlit app is running at http://localhost:8502`);
});