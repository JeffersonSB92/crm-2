import app from "./app";

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
