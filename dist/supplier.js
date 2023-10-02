"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors = require('cors');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors({
    methods: ['GET', 'PUT', 'DELETE', 'POST']
}));
const supplier2Schema = new mongoose_1.default.Schema({
    name: String,
    value: String
});
const Supplier2 = mongoose_1.default.model('supplier2', supplier2Schema);
const mongoURI = 'mongodb+srv://sgouduk2023:fhnRgACtxnHJDfJK@cluster0.elplbae.mongodb.net/FibreCafe2?retryWrites=true&w=majority';
mongoose_1.default
    .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
})
    .then((db) => {
    console.log("Database Connected Successfuly.");
})
    .catch((err) => {
    console.log("Error Connecting to the Database");
});
app.post('/supplier2', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, value } = req.body;
        const newSupplier2 = new Supplier2({
            name,
            value
        });
        const savedSupplier2 = yield newSupplier2.save();
        res.json(savedSupplier2);
    }
    catch (error) {
        console.error('Error saving Supplier2', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.get('/supplier2', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier2 = yield Supplier2.find({}).select('-__v');
        const modifiedData = supplier2.map((item) => {
            return {
                name: item.name,
                value: item.value
            };
        });
        res.json(modifiedData);
    }
    catch (error) {
        console.error('Error retrieving supplier', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Start the API server
const parsedPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const PORT = parsedPort || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
