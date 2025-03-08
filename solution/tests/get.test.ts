import request from 'supertest';
import app from '../src/server';
import SwiftCode from '../src/models/SwiftCode';

jest.mock('../src/models/SwiftCode');

let server: any;
let baseURL: string;

beforeAll((done) => {
  server = app.listen(0, () => {
    const address = server.address();
    baseURL = `http://localhost:${address.port}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('SWIFT Codes API, "GET"', () => {
  describe('GET /v1/swift-codes/:swiftCode', () => {
    it('should return SWIFT code details without branches', async () => {
      (SwiftCode.findOne as jest.Mock).mockResolvedValue({
        address: 'Test Address',
        bankName: 'Test Bank',
        countryISO2: 'TS',
        countryName: 'TEST',
        isHeadquarter: true,
        swiftCode: 'XXXXXXXX',
      });

      const res = await request(baseURL).get('/v1/swift-codes/TESTUS33');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        address: 'Test Address',
        bankName: 'Test Bank',
        countryISO2: 'TS',
        countryName: 'TEST',
        isHeadquarter: true,
        swiftCode: 'XXXXXXXX',
      });
    });

    it('should return SWIFT code details with branches', async () => {      
      (SwiftCode.findOne as jest.Mock).mockResolvedValueOnce({
        address: 'Test Address',
        bankName: 'Test Bank',
        countryISO2: 'TS',
        countryName: 'TEST',
        isHeadquarter: true,  
        swiftCode: 'SWIFTTESTXXX', 
      });

      (SwiftCode.findAll as jest.Mock).mockResolvedValueOnce([
        {
          address: 'Test Address',
          bankName: 'Test Bank',
          countryISO2: 'TS',
          swiftCode: 'SWIFTTEST1',
          isHeadquarter: false,
        },
        {
          address: 'Test Address',
          bankName: 'Test Bank',
          countryISO2: 'TS',
          swiftCode: 'SWIFTTEST2',
          isHeadquarter: false,
        },
      ]);
  
      const res = await request(baseURL).get('/v1/swift-codes/SWIFTTESTXXX');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        address: 'Test Address',
        bankName: 'Test Bank',
        countryISO2: 'TS',
        countryName: 'TEST',
        isHeadquarter: true,
        swiftCode: 'SWIFTTESTXXX',
        branches: [
          {
            address: 'Test Address',
            bankName: 'Test Bank',
            countryISO2: 'TS',
            swiftCode: 'SWIFTTEST1',
            isHeadquarter: false,
          },
          {
            address: 'Test Address',
            bankName: 'Test Bank',
            countryISO2: 'TS',
            swiftCode: 'SWIFTTEST2',
            isHeadquarter: false,
          },
        ],
      });
    });

    it('should return 404 if SWIFT code not found', async () => {
      (SwiftCode.findOne as jest.Mock).mockResolvedValue(null);

      const res = await request(baseURL).get('/v1/swift-codes/NONEXIST33');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('SWIFT code not found');
    });
  });

  describe('GET /v1/swift-codes/country/:countryISO2code', () => {
    it('should return all SWIFT codes for a country', async () => {
      (SwiftCode.findAll as jest.Mock).mockResolvedValue([
        {
          address: 'Test Address',
          bankName: 'Test Bank',
          countryISO2: 'PL',
          countryName: 'Poland',
          isHeadquarter: true,
          swiftCode: 'TESTPL33',
        },
        {
          address: 'Test Address',
          bankName: 'Test Bank',
          countryISO2: 'PL',
          countryName: 'Poland',
          isHeadquarter: false,
          swiftCode: 'TESTPL111',
        },
      ]);
    
      const res = await request(baseURL).get('/v1/swift-codes/country/PL');
    
      expect(res.status).toBe(200);
    
      expect(res.body).toEqual({
        countryISO2: 'PL',
        countryName: 'Poland',
        swiftCodes: [
          {
            address: 'Test Address',
            bankName: 'Test Bank',
            countryISO2: 'PL',
            isHeadquarter: true,
            swiftCode: 'TESTPL33',
          },
          {
            address: 'Test Address',
            bankName: 'Test Bank',
            countryISO2: 'PL',
            isHeadquarter: false,
            swiftCode: 'TESTPL111',
          },
        ],
      });
    });
  });
});
