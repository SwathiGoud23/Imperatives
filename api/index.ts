import express, { Request, Response } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(
  cors({
    methods: ['GET', 'PUT', 'DELETE', 'POST'],
  })
);

interface SupplierDocument extends mongoose.Document {
  name: string;
  value: string;
}

const supplier1Schema = new mongoose.Schema({
  name: String,
  value: String,
});

const Supplier = mongoose.model<SupplierDocument>('supplier1', supplier1Schema);

const mongoURI: string =
  'mongodb+srv://sgouduk2023:fhnRgACtxnHJDfJK@cluster0.elplbae.mongodb.net/FibreCafe?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  } as ConnectOptions)
  .then((db) => {
    console.log('Database Connected Successfully.');
  })
  .catch((err) => {
    console.log('Error Connecting to the Database');
  });

  app.get('/supplier1', async (req: Request, res: Response) => {
    try {
      const supplier1 = await Supplier.find({}).select('-__v'); // Exclude __v field
      const modifiedData = supplier1.map((item) => {
        return {
          name: item.name,
          value: item.value
        };
      });
      res.json(modifiedData);
    } catch (error) {
      console.error('Error retrieving supplier', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.post('/supplier1', async (req: Request, res: Response) => {
  try {
    const { name, value } = req.body;

    const newSupplier = new Supplier({
      name,
      value,
    });

    const savedSupplier = await newSupplier.save();
    res.json(savedSupplier);
  } catch (error) {
    console.error('Error saving Supplier1', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the API server
const parsedPort: number | undefined = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const PORT: number = parsedPort || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
