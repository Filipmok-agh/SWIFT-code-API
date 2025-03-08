import request from 'supertest';
import app from '../src/server';
import SwiftCode from '../src/models/SwiftCode';

jest.mock('../src/models/SwiftCode');

describe('SWIFT Codes API "POST', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /v1/swift-codes', () => {
    it('should create a new SWIFT code and verify its existence with correct body', async () => {
      const newSwiftCode = {
        address: 'Test Address',
        bankName: 'Test Bank',
        countryISO2: 'US',
        countryName: 'United States',
        isHeadquarter: false,
        swiftCode: 'TESTUS33',
      };

      (SwiftCode.findOne as jest.Mock).mockResolvedValueOnce(null);
      (SwiftCode.create as jest.Mock).mockResolvedValue(newSwiftCode);
      (SwiftCode.findOne as jest.Mock).mockResolvedValueOnce(newSwiftCode);

      const postRes = await request(app).post('/v1/swift-codes').send(newSwiftCode);

      expect(postRes.status).toBe(200);
      expect(postRes.body.message).toBe('SWIFT code: TESTUS33 added successfully');

      const getRes = await request(app).get('/v1/swift-codes/TESTUS33');
      expect(getRes.status).toBe(200);
      expect(getRes.body).toEqual(newSwiftCode);
    });
  });
});
