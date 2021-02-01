import applicationRouter from './applicationRoute'
import userRouter from './userRoute'
import controller from '../controller/controller'

function loadHandlers(app) {
    app.use(applicationRouter.route, applicationRouter.router)
    app.use(userRouter.route, userRouter.router)

    controller.establishDatabaseConnection().then(() => console.log('connected to db'))
}

export default loadHandlers