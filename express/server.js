const express = require('express');
const app = express();
const userRoutes = require('./src/routes/user.routes');

app.use(express.json());

// 注册用户路由
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
