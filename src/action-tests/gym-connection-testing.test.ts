// exploratory-testing.test.ts

import { expect } from 'chai';
import axios from 'axios';
import { infoPath } from '../services/api-service';

describe('Gym Connectivity Test', function () {
    it('should successfully connect to the Gym endpoint', () => {
        axios.get(infoPath)
          .then((response) => {
            console.log(response);
            expect(response.status).to.equal(200);
          })
          .catch((error) => {
            throw error;
          });
      });
      
});
