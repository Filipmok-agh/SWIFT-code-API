import request from 'supertest';
import app from '../src/server';
import SwiftCode from '../src/models/SwiftCode';

jest.mock('../src/models/SwiftCode');

describe('SWIFT Codes API "INTEGRATION"', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('INTEGRATION TEST', () => {
    it('should add and retrieve SWIFT codes correctly', async () => {
      (SwiftCode.findOne as jest.Mock)
        .mockResolvedValueOnce(null); 

      let res = await request(app).get('/v1/swift-codes/TESTUS33');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('SWIFT code not found');

      const newSwiftCode = {
        address: 'Test Address',
        bankName: 'Test Bank',
        countryISO2: 'US',
        countryName: 'United States',
        isHeadquarter: false,
        swiftCode: 'TESTUS33',
      };

      (SwiftCode.create as jest.Mock).mockResolvedValue(newSwiftCode);
      (SwiftCode.findOne as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(newSwiftCode);

      const postRes = await request(app).post('/v1/swift-codes').send(newSwiftCode);
      expect(postRes.status).toBe(200);
      expect(postRes.body.message).toBe('SWIFT code: TESTUS33 added successfully');

      const getRes = await request(app).get('/v1/swift-codes/TESTUS33');
      expect(getRes.status).toBe(200);
      expect(getRes.body).toEqual(newSwiftCode);

      let branchCode = {
        address: 'Test Address',
        bankName: 'Test Bank',
        countryISO2: 'TS',
        countryName: 'TEST',
        isHeadquarter: false,  
        swiftCode: 'SWIFTTEST123'
      };

      (SwiftCode.findOne as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ 
          ...newSwiftCode, 
          branches: [branchCode]
        });

      (SwiftCode.create as jest.Mock).mockResolvedValue(branchCode);

      const branchRes = await request(app).post('/v1/swift-codes').send(branchCode);
      expect(branchRes.status).toBe(200);
      expect(branchRes.body.message).toBe('SWIFT code: SWIFTTEST123 added successfully');

      res = await request(app).get('/v1/swift-codes/TESTUS33');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ...newSwiftCode,
        branches: [branchCode]
      });
    });
  });
});
