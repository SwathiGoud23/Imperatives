import express, { Request, Response } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';

const cors = require('cors');

const app = express()
app.use(express.json())

app.use(
  cors({
    methods: ['GET', 'PUT', 'DELETE', 'POST']
}))

interface SupplierDocument extends mongoose.Document {
  name: string;
  value: string;
}

const supplier2Schema = new mongoose.Schema({
    name: String,
    value: String
})

const Supplier2 = mongoose.model<SupplierDocument>('supplier2', supplier2Schema);

const mongoURI = 'mongodb+srv://sgouduk2023:fhnRgACtxnHJDfJK@cluster0.elplbae.mongodb.net/FibreCafe2?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
  } as ConnectOptions)
  .then((db) => {
    console.log("Database Connected Successfuly.")
  })
  .catch((err) => {
    console.log("Error Connecting to the Database");
  });

  app.post('/supplier2', async (req: Request, res: Response) => {
    try {
        const { name, value } = req.body

        const newSupplier2 = new Supplier2({
          name,
          value
        })

        const savedSupplier2 = await newSupplier2.save();
        res.json(savedSupplier2);
    } catch (error) {
        console.error('Error saving Supplier2', error.message)
        res.status(500).json({ error: 'Internal server error'})
    }
  })

  app.get('/supplier2', async (req: Request, res: Response) => {
    try {
      const supplier2 = await Supplier2.find({}).select('-__v');
      const modifiedData = supplier2.map((item) => {
        return {
          name: item.name,
          value: item.value
        };
      });
      res.json(modifiedData);
    } catch(error) {
      console.error('Error retrieving supplier', error.message);
      res.status(500).json({ error: 'Internal server error'});
    }
  })

  // Start the API server
const parsedPort: number | undefined = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const PORT: number = parsedPort || 3001;
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});