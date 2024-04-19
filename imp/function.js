function respose(sts, msg, aftrows,data=null){
    return{
        status:sts,
        message:msg,
        affected_rows:aftrows,
        timestamp:new Date().getTime()
    }
}
module.exports={
    respose
}