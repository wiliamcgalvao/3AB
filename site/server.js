const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "3bb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

// Configuração do Multer para fazer o upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/form.html');
});

app.post('/submit', upload.single('image'), (req, res) => {
  const { name, password, phone } = req.body;
  const image = req.file.filename;
  
  const sql = "INSERT INTO 3bb_usuario (nome, senha, telefone, imagem) VALUES (?, ?, ?, ?)";
  con.query(sql, [name, password, phone, image], function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.send("Cadastro realizado com sucesso!");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
