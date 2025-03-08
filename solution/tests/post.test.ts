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

describe('SWIFT Codes API "POST"', () => {
  describe('POST /v1/swift-codes', () => {
    it('should create a new SWIFT code and verify its existence with correct body', async () => {
      const newSwiftCode = {
        address: 'Test Address',
        bankName: 'Test Bank',
        countryISO2: 'TS',
        countryName: 'Test',
        isHeadquarter: false,
        swiftCode: 'XXXXXXXX',
      };

      (SwiftCode.findOne as jest.Mock).mockResolvedValueOnce(null);
      (SwiftCode.create as jest.Mock).mockResolvedValue(newSwiftCode);
      (SwiftCode.findOne as jest.Mock).mockResolvedValueOnce(newSwiftCode);

      const postRes = await request(baseURL).post('/v1/swift-codes').send(newSwiftCode);

      expect(postRes.status).toBe(200);
      expect(postRes.body.message).toBe('SWIFT code: XXXXXXXX added successfully');

      const getRes = await request(baseURL).get('/v1/swift-codes/XXXXXXXX');
      expect(getRes.status).toBe(200);
      expect(getRes.body).toEqual(newSwiftCode);
    });
  });
});
