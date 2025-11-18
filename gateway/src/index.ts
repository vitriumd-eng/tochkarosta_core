import express from 'express';
const app = express();
app.use(express.json());
app.post('/gateway/auth/send-code', (req,res)=>{ res.json({status:'forwarded'}); });
app.listen(3000, ()=>console.log('Gateway listening 3000'));
