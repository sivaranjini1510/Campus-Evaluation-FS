import express from 'express';
import { loggerMiddleware } from '../logging-middleware/logger.js';
const app=express();
const PORT=3000;
app.use(express.json());
app.use(loggerMiddleware);
const notificationsDb=[];
app.get('/api/notifications',(req,res)=>{
    res.status(200).json({notifications:notificationsDb});
});

app.post('/api/notifications',(req,res)=>{
    const { type,message,studentId }=req.body;
    const newNotification={
        id:crypto.randomUUID(),
        type: String(type).toLowerCase(),
        message: String(message),
        studentId: String(studentId),
        isRead: false,
        timestamp:new Date().toISOString()
    };
    notificationsDb.push(newNotification);
    res.status(201).json({success:true,data:newNotification});
});
app.listen(PORT,()=>{
    process.stdout.write(`Server is running on port ${PORT}\n`);

});