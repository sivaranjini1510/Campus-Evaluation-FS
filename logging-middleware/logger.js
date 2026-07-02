const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMzE1MDQ4QG5lYy5lZHUuaW4iLCJleHAiOjE3ODI5NzcxODgsImlhdCI6MTc4Mjk3NjI4OCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjdjYmVjMmIxLTQ5MWYtNGU5MS1iYmRjLTVjNGE4ZjMwYTVmMyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNpdmEgcmFuamluaSByIiwic3ViIjoiMTJkZTFjNzAtYjQ0Yy00ZTlhLWFjY2ItMjUxNjBhODM0MjlhIn0sImVtYWlsIjoiMjMxNTA0OEBuZWMuZWR1LmluIiwibmFtZSI6InNpdmEgcmFuamluaSByIiwicm9sbE5vIjoiMjMxNTA0OCIsImFjY2Vzc0NvZGUiOiJFUnpVeXgiLCJjbGllbnRJRCI6IjEyZGUxYzcwLWI0NGMtNGU5YS1hY2NiLTI1MTYwYTgzNDI5YSIsImNsaWVudFNlY3JldCI6ImJ5dUpKYnZIdkN1TWFXUkYifQ.bWjBHE874BKcPz2na76EM_LndDhNNPz1uxtMuOmeyV8";
export async function Log(stack,level,packageName,message){
    try{
        await fetch("http://4.224.186.213/evaluation-service/logs",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`,
            },
            body:JSON.stringify({
            stack:String(stack).toLowerCase(),
            level:String(level).toLowerCase(),
            package:String(packageName).toLowercase(),
            message:String(message),
            })
        }  
    );
    }catch(err){
       process.stdout.write("[Logger Warning] Log Failed\n");
    }
}
export const loggerMiddleware=async(req,res,next)=>{
    const startTime=process.hrtime();
    res.on('finish',()=>{
        const diff=process.hrtime(startTime);
        const duration=diff[0]*1e3+diff[1]/1e6;
        const level=res.statusCode>=500?'error':res.statusCode>=400?'warn':'info';
        const msg=`${req.method} ${req.originalUrl} ${res.statusCode} ${duration.toFixed(3)}ms`;
        Log('backend',level,'middleware',msg);
    });
    next();
};