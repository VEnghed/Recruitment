import applicationRouter from './applicationRoute.js'
import userRouter from './userRoute.js'
import recruiterRouter from './recruiterRoute.js'
import controller from '../controller/controller.js'

function loadHandlers(app) {
    app.use(applicationRouter.route, applicationRouter.router)
    app.use(userRouter.route, userRouter.router)
    app.use(recruiterRouter.route, recruiterRouter.router)
    controller.establishDatabaseConnection().then(() => console.log('connected to db'))
}

export default loadHandlers