import app from "./app";
import config from "./config";
import "./jobs/booking.job";
const port = config.port;


// starting server
app.listen(port, () => {
  console.log(`Vehicle Rental System server started on port ${port}`)
})