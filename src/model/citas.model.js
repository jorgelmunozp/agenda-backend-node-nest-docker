import express from "express";
import mongoose from 'mongoose';
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const { Schema, model ,connect, connection } = mongoose;

// 📌 Esquema de cada cita
const citaSchema = new Schema({
  id: { type: String, required: true, trim: true },
  cita: {
    paciente: { type: String, required: true, trim: true },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    consultorio: { type: String, required: true, trim: true },
    doctor: { type: String, required: true, trim: true },
    tratamiento: { type: String, required: true, trim: true }
  }
});

// 📌 Esquema de documento completo
const citasSchema = new Schema({
  citas: {
    type: [citaSchema],
    required: true
  }
}, { collection: "citas" });

// 📌 Modelo para las citas
const Citas = model("Citas", citasSchema);

// 📌 Conectar a la base de datos
let dbUser = 'hargomo'; // Nombre de la base de datos
let dbPassword = 'H4rg0m0T1cS4$'; // Contraseña de la base de datos
let dbCluster = 'Cluster0'; // Nombre del cluster
let dbUrl = 'mongodb+srv://'+dbUser+':'+dbPassword+'@cluster0.7sqiuke.mongodb.net/?retryWrites=true&w=majority&appName='+dbCluster; // MongoDB Atlas URL
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true  });
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

// 📌 Función para agregar una nueva cita
const AgregarCita = async (nuevaCita) => {
  try {
    await CitasCollection.findOneAndUpdate(
      {}, // no filtramos, porque solo habrá 1 documento
      { $push: { citas: nuevaCita } },
      { upsert: true, new: true } // crea el doc si no existe
    );
    console.log("✅ Cita agregada correctamente");
  } catch (error) {
    console.error("❌ Error al agregar cita:", error);
  }
};






// 📌 Ruta para obtener todas las citas
app.get("/citas", async (req, res) => {
  try {
    const doc = await CitasCollection.findOne({});
    res.json(doc?.citas || []);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

// 📌 Ruta para agregar una cita
app.post("/citas", async (req, res) => {
  try {
    const nuevaCita = req.body;

    if (!nuevaCita.id || !nuevaCita.cita) {
      return res.status(400).json({ error: "Faltan datos de la cita" });
    }

    const result = await CitasCollection.findOneAndUpdate(
      {},
      { $push: { citas: nuevaCita } },
      { upsert: true, new: true }
    );

    res.json({ message: "Cita agregada correctamente", citas: result.citas });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar cita" });
  }
});

// 📌 Iniciar servidor
const PORT = 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
});







// 📌 Exportaciones
export { connectDB, Citas, AgregarCita };