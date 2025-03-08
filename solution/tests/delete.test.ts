import request from 'supertest';
import app from '../src/server';
import SwiftCode from '../src/models/SwiftCode';

jest.mock('../src/models/SwiftCode');

describe('SWIFT Codes API "DELETE"', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('DELETE /v1/swift-codes/:swiftCode', () => {
    it('should delete an existing SWIFT code and verify its deletion', async () => {
        
      (SwiftCode.findOne as jest.Mock).mockResolvedValueOnce({ swiftCode: 'TESTUS33' });
      (SwiftCode.destroy as jest.Mock).mockResolvedValue(1);
      (SwiftCode.findOne as jest.Mock).mockResolvedValueOnce(null);

      const deleteRes = await request(app).delete('/v1/swift-codes/TESTUS33');
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe('SWIFT code: TESTUS33 deleted successfully');

      const getRes = await request(app).get('/v1/swift-codes/TESTUS33');
      expect(getRes.status).toBe(404);
    });
  });
});
