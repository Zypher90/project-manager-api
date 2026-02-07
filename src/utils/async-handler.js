export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.then(requestHandler(req, res, next), (err) => next(err));
    }
}