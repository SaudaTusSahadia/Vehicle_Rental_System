import app from "./app";
import config from "./config";
const port = config.port;

// initialize DB
// initDB();

// starting server
app.listen(port, () => {
  console.log(`Vehicle Rental System server started on port ${port}`)
})