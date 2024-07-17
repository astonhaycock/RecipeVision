// This is the main entry point for the application. It imports the preconfigured Express server
// and starts it on the specified port.

import { app } from "./express/server";
import { PORT } from "./env";

app.listen(PORT, () => {
  console.log(`Server started: http://127.0.0.1:${PORT}/`);
});
