const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());

app.get('/' , (req , res)=> {
    res.send('server is working')
})


app.listen(port , ()=> {
    console.log('server running on port ' , port);
})