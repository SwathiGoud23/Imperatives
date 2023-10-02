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

// type MappingConfig = {
//     LINE_PROFILE: { [key: string]: MappingRule[] };
// };

interface CharacteristicWithoutSupplier {
  name: string;
  value: string;
}

type CharacteristicsMapper = (
  characteristics: Characteristic[],
  _supplier: string
) => Promise<CharacteristicWithoutSupplier[]>;

const mapGatewayCharacteristics: CharacteristicsMapper = async (characteristics, _supplier) => {
  const reverseMappingConfig: {
      supplier1: { [key: string]: MappingRule[] };
      supplier2: { [key: string]: MappingRule[] };
  } = {
      supplier1: {
          '12': [{ name: 'UPSTREAM', value: '1' }],
          '1000': [{ name: 'DOWNSTREAM', value: '1' }],
          '1AB': [{ name: 'PROFILE', value: '2' }],
      },
      supplier2: {
          '12': [{ name: 'UPSTREAM', value: '1' }],
          '1000': [{ name: 'DOWNSTREAM', value: '1' }],
          '1AB': [{ name: 'PROFILE', value: '2' }],
      },
  };

 
  const reverseMappedCharacteristics: CharacteristicWithoutSupplier[] = characteristics.flatMap(item => {
    const supplierConfig =
        _supplier === 'supplier1' ? reverseMappingConfig.supplier1 : reverseMappingConfig.supplier2;

    const matchingRules = Object.keys(supplierConfig)
        .filter(key => supplierConfig[key].some(rule => rule.name === item.name && rule.value === item.value))
        .map(key => supplierConfig[key])
        .flat();

    if (matchingRules.length > 0) {
        return matchingRules.map(rule => ({
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

return reverseMappedCharacteristics;
};














const app = express();
const PORT = 3004;

app.use(express.json());

interface RequestParams {
    supplier: string;
}

app.get('/gatewayCharacteristics/:supplier', async (req: express.Request<RequestParams>, res) => {
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

        const mappedData = await mapGatewayCharacteristics(combinedData, req.params.supplier);
        res.json(mappedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
