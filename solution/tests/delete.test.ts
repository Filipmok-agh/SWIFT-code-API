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

describe('SWIFT Codes API "DELETE"', () => {
  describe('DELETE /v1/swift-codes/:swiftCode', () => {
    it('should delete an existing SWIFT code and verify its deletion', async () => {
      (SwiftCode.findOne as jest.Mock).mockResolvedValueOnce({ swiftCode: 'XXXXXXXX' });
      (SwiftCode.destroy as jest.Mock).mockResolvedValue(1);
      (SwiftCode.findOne as jest.Mock).mockResolvedValueOnce(null);

      const deleteRes = await request(baseURL).delete('/v1/swift-codes/XXXXXXXX');
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe('SWIFT code: XXXXXXXX deleted successfully');

      const getRes = await request(baseURL).get('/v1/swift-codes/XXXXXXXX');
      expect(getRes.status).toBe(404);
    });
  });
});
