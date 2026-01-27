const asyncHandle =(requestFunction)=>{
    (req, res, next)=>{
        Promise.resolve(requestFunction(req, res, next))
        .catch((error)=>{
            next.error
        })
    }
}

export {asyncHandle}