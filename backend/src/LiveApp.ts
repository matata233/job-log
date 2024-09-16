import app from "./App";

const port = process.env.PORT || 54321;

app.listen(port, () => {
  console.log(`Backend is Live!`);
});
