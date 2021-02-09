import applicationRouter from './applicationRoute.js'
import userRouter from './userRoute.js'
import controller from '../controller/controller.js'

function loadHandlers(app) {
    app.use(applicationRouter.route, applicationRouter.router)
    app.use(userRouter.route, userRouter.router)

    controller.establishDatabaseConnection().then(() => console.log('connected to db'))
}

export default loadHandlers