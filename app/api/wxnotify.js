class Wxnotify {
    createOrder = async (ctx, next) => {
        console.log(ctx.request.body)
        ctx.body = "ok";
    }
}

module.exports = new Wxnotify();