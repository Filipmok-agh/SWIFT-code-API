import express from 'express';
import sequelize from './db'; 
import SwiftCode from './models/SwiftCode';
import  { Request, Response } from 'express'; 
import { Op } from 'sequelize';
const app = express();
app.use(express.json());


import fs from 'fs';
import csvParser from 'csv-parser';


async function importCSVData(filePath: string) {
  const swiftCodes: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      const countryISO2 = row['COUNTRY ISO2 CODE'].toUpperCase();
      const countryName = row['COUNTRY NAME'].toUpperCase();

      const isHeadquarter = row['SWIFT CODE'].endsWith('XXX');

      swiftCodes.push({
        swiftCode: row['SWIFT CODE'],
        bankName: row['NAME'],
        countryISO2: countryISO2,
        countryName: countryName,
        address: row['ADDRESS'],
        isHeadquarter: isHeadquarter,
      });
    })
    .on('end', async () => {
      try {
        await sequelize.sync();
        
        for (const swiftCode of swiftCodes) {
          const existingSwiftCode = await SwiftCode.findOne({
            where: { swiftCode: swiftCode.swiftCode }
          });

          if (!existingSwiftCode) {
            await SwiftCode.create(swiftCode);
          } else {
            console.log(`${swiftCode.swiftCode} already exist`);
          }
        }
        console.log('Data imported');
      } catch (error) {
        console.error('Data import error: ', error);
      }
    });
}

// importing data
// importCSVData('./src/data.csv');






app.get('/v1/swift-codes/:swiftCode', async (req: Request, res: Response) => { 
  const { swiftCode } = req.params;

  try {
    const row = await SwiftCode.findOne({
      where: { swiftCode },
    });

    if (row) {
      if (row.isHeadquarter) {
        const branches = await SwiftCode.findAll({
          where: { swiftCode: { [Op.like]: `${swiftCode.slice(0, 8)}%` } },
        });

        const response: any = {
          address: row.address,
          bankName: row.bankName,
          countryISO2: row.countryISO2,
          countryName: row.countryName,
          isHeadquarter: true,
          swiftCode: row.swiftCode,
        };

        if (branches && branches.length > 0) {
          response.branches = branches.map((branch: any) => ({
            address: branch.address,
            bankName: branch.bankName,
            countryISO2: branch.countryISO2,
            isHeadquarter: false,
            swiftCode: branch.swiftCode,
          }));
        }

        return res.json(response);
      } else {
        const response = {
          address: row.address,
          bankName: row.bankName,
          countryISO2: row.countryISO2,
          countryName: row.countryName,
          isHeadquarter: false,
          swiftCode: row.swiftCode,
        };
        return res.json(response);
      }
    } else {
      return res.status(404).json({ message: 'SWIFT code not found' });
    }
  } catch (error) {
    console.error('Error fetching SWIFT code details:', error);
    return res.status(500).json({ message: 'Error' });
  }
});



app.get('/v1/swift-codes/country/:countryISO2code', async (req: Request, res: Response) => {
  const { countryISO2code } = req.params;

  if (!countryISO2code || countryISO2code.trim() === '') {
    return res.status(400).json({ message: 'Country ISO2 code cannot be empty' });
  }

  try {
    const swiftCodes = await SwiftCode.findAll({
      where: { countryISO2: countryISO2code.toUpperCase() },
    });

    if (swiftCodes.length === 0) {
      return res.status(404).json({ message: `No SWIFT codes found for country: ${countryISO2code}` });
    }

    const response = {
      countryISO2: countryISO2code.toUpperCase(),
      countryName: swiftCodes[0].countryName,
      swiftCodes: swiftCodes.map((swiftCode: any) => ({
        address: swiftCode.address,
        bankName: swiftCode.bankName,
        countryISO2: swiftCode.countryISO2,
        isHeadquarter: swiftCode.isHeadquarter,
        swiftCode: swiftCode.swiftCode,
      })),
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching SWIFT codes for country:', error);
    return res.status(500).json({ message: 'Error' });
  }
});



app.post('/v1/swift-codes', async (req: Request, res: Response) => {
  const { address, bankName, countryISO2, countryName, isHeadquarter, swiftCode } = req.body;

  if (!address || !bankName || !countryISO2 || !countryName || typeof isHeadquarter !== 'boolean' || !swiftCode) {
    return res.status(400).json({ message: 'All fields are required, and isHeadquarter must be a boolean (true or false).' });
  }

  try {
    const existingSwiftCode = await SwiftCode.findOne({
      where: { swiftCode }
    });

    if (existingSwiftCode) {
      return res.status(400).json({ message: 'SWIFT code already exists' });
    }

    await SwiftCode.create({
      address,
      bankName,
      countryISO2,
      countryName,
      isHeadquarter,
      swiftCode
    });
    return res.status(200).json({
      message: `SWIFT code: ${swiftCode} added successfully`
    });
  } catch (error) {
    console.error('Error adding SWIFT code:', error);
    return res.status(500).json({ message: 'Error' });
  }
});

app.delete('/v1/swift-codes/:swiftCode', async (req: Request, res: Response) => {
  const { swiftCode } = req.params;

  if (!swiftCode || swiftCode.trim() === '') {
    return res.status(400).json({ message: 'SWIFT code cannot be empty' });
  }

  try {
    const existingSwiftCode = await SwiftCode.findOne({
      where: { swiftCode }
    });

    if (!existingSwiftCode) {
      return res.status(404).json({ message: 'SWIFT code not found' });
    }

    await SwiftCode.destroy({
      where: { swiftCode }
    });

    return res.status(200).json({
      message: `SWIFT code: ${swiftCode} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting SWIFT code:', error);
    return res.status(500).json({ message: 'Error' });
  }
});
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
export default app;
