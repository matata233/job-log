import app, {endpoint} from "./App";

const port = 54321;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}${endpoint}`);
});
