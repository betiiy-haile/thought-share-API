
const ErrorMiddlware = (err, req, res, next) => {
    // Adjusting status code to handle error responses appropriately
    const statusCode = res.statusCode == 400 ? 500 : res.statusCode
    res.status(statusCode)
    console.log("error from middleware", err)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV == "production" ? 'null' : err.stack
     })
}