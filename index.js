const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')

dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:8080'],
    methods: "GET,PUT,POST,DELETE",
}
app.use(cors(corsOptions))

//Rutas 
app.use('/api/categorias', require('./routes/categorias.routes'))
app.use('/api/peliculas', require('./routes/peliculas.routes'))
app.use('/api/usuarios', require('./routes/usuarios.routes'))
app.use('/api/roles', require('./routes/roles.routes'))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.get('*', (req, res) => { res.status(404).send()})

const errorlogger = require('./middlewares/errorlogger.middleware')
const errorhandler = require('./middlewares/errorhandler.middleware')
app.use(errorlogger, errorhandler);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`)
    console.log(`http://localhost:${process.env.SERVER_PORT}`)
})
