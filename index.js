import express from 'express'
import dotenv from 'dotenv'
import checkToken from './Middlewares/auth.middleware.js';
import authRoutes from './Routes/auth.route.js'
import userRoutes from './Routes/users.route.js'
import filmRoutes from './Routes/films.route.js'
import roomRoutes from './Routes/rooms.route.js'
import screeningRoutes from './Routes/screenings.route.js'
import reservationRoutes from './Routes/reservations.route.js'
 
dotenv.config();
const app = express();
 
app.use(express.json());
 
app.use("/auth", authRoutes);
app.use("/users", checkToken, userRoutes);
app.use("/films", checkToken, filmRoutes);
app.use("/rooms", checkToken, roomRoutes);
app.use("/screenings", checkToken, screeningRoutes);
app.use("/reservations", checkToken, reservationRoutes);
 
app.get('/', (req, res) => {
    res.json({ status: "OK" });
});
 
app.listen(process.env.SERVER_PORT, () => {
    console.log("http://127.0.0.1:" + process.env.SERVER_PORT);
});
