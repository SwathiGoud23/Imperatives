


import express from 'express';
import axios from 'axios';

interface Characteristic {
    name: string;
    value: string;
    supplier: string;
}

type MappingRule = {
  name: string;
  value: string;
};

type MappingConfig = {
  LINE_PROFILE: { [key: string]: MappingRule[] };
};

type CharacteristicsMapper = (
    characteristics: Characteristic[],
    supplier: string
) => Promise<Characteristic[]>;

const mapSupplierCharacteristics: CharacteristicsMapper = async (characteristics, supplier) => {
  const mappingConfig: {
    supplier1: MappingConfig;
    supplier2: MappingConfig;
} = {
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

  const mappedCharacteristics: Characteristic[] = characteristics.flatMap(item => {
    const supplierConfig =
        supplier === 'supplier1' ? mappingConfig.supplier1 : mappingConfig.supplier2;

    if (supplierConfig[item.name] && supplierConfig[item.name][item.value]) {
        const mappingRules = supplierConfig[item.name][item.value];

        return mappingRules.map(rule => ({
            name: rule.name,
            value: rule.value,
        }));
    } else {
        return [{
            name: item.name,
            value: item.value,
        }];
    }
});

return mappedCharacteristics;
};


const app = express();
const PORT = 3003;

app.use(express.json());

interface RequestParams {
  supplier: string;
}


app.get('/combinedData/:supplier', async (req: express.Request<RequestParams>, res) => {
      try {
        const response1 = await axios.get('http://localhost:3000/supplier1');
        const data1: Characteristic[] = response1.data.map((item: Characteristic) => ({
            ...item,
            name: 'LINE_PROFILE',
            supplier: 'supplier1'
        }));

        const response2 = await axios.get('http://localhost:3001/supplier2');
        const data2: Characteristic[] = response2.data.map((item: Characteristic) => ({
            ...item,
            name: 'LINE_PROFILE',
            supplier: 'supplier2'
        }));

        const combinedData: Characteristic[] = [...data1, ...data2];

        const mappedData = await mapSupplierCharacteristics(combinedData, req.params.supplier);
        res.json(mappedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


