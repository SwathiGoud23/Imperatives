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
const axios_1 = __importDefault(require("axios"));
const mapSupplierCharacteristics = (characteristics, supplier) => __awaiter(void 0, void 0, void 0, function* () {
    const mappingConfig = {
        supplier1: {
            LINE_PROFILE: {
                '1': [
                    { name: 'UPSTREAM', value: '12' },
                    { name: 'DOWNSTREAM', value: '1000' },
                ],
                '2': [{ name: 'PROFILE', value: '1AB' }],
            }
        },
        supplier2: {
            LINE_PROFILE: {
                '1': [
                    { name: 'UPSTREAM', value: '12' },
                    { name: 'DOWNSTREAM', value: '1000' },
                ],
                '2': [{ name: 'PROFILE', value: '1AB' }],
            },
        },
    };
    const mappedCharacteristics = characteristics.flatMap(item => {
        const supplierConfig = supplier === 'supplier1' ? mappingConfig.supplier1 : mappingConfig.supplier2;
        if (supplierConfig[item.name] && supplierConfig[item.name][item.value]) {
            const mappingRules = supplierConfig[item.name][item.value];
            return mappingRules.map(rule => ({
                name: rule.name,
                value: rule.value,
            }));
        }
        else {
            return [{
                    name: item.name,
                    value: item.value,
                }];
        }
    });
    return mappedCharacteristics;
});
const app = (0, express_1.default)();
const PORT = 3003;
app.use(express_1.default.json());
app.get('/combinedData/:supplier', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response1 = yield axios_1.default.get('http://localhost:3000/supplier1');
        const data1 = response1.data.map((item) => (Object.assign(Object.assign({}, item), { name: 'LINE_PROFILE', supplier: 'supplier1' })));
        const response2 = yield axios_1.default.get('http://localhost:3001/supplier2');
        const data2 = response2.data.map((item) => (Object.assign(Object.assign({}, item), { name: 'LINE_PROFILE', supplier: 'supplier2' })));
        const combinedData = [...data1, ...data2];
        const mappedData = yield mapSupplierCharacteristics(combinedData, req.params.supplier);
        res.json(mappedData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
