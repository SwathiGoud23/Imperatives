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
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    methods: ['GET', 'PUT', 'DELETE', 'POST'],
}));
const supplier1Schema = new mongoose_1.default.Schema({
    name: String,
    value: String,
});
const Supplier = mongoose_1.default.model('supplier1', supplier1Schema);
const mongoURI = 'mongodb+srv://sgouduk2023:fhnRgACtxnHJDfJK@cluster0.elplbae.mongodb.net/FibreCafe?retryWrites=true&w=majority';
mongoose_1.default
    .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
})
    .then((db) => {
    console.log('Database Connected Successfully.');
})
    .catch((err) => {
    console.log('Error Connecting to the Database');
});
app.get('/supplier1', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier1 = yield Supplier.find({}).select('-__v'); // Exclude __v field
        const modifiedData = supplier1.map((item) => {
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
app.post('/supplier1', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, value } = req.body;
        const newSupplier = new Supplier({
            name,
            value,
        });
        const savedSupplier = yield newSupplier.save();
        res.json(savedSupplier);
    }
    catch (error) {
        console.error('Error saving Supplier1', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Start the API server
const parsedPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const PORT = parsedPort || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
