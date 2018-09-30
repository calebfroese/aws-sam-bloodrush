import * as AWS from 'aws-sdk';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';

import { PlayerService } from './player.service';

describe(PlayerService.name, () => {
  let sandbox = createSandbox();
  let service: PlayerService;
  let batchWriteStub: SinonStub;

  before(() => {
    service = new PlayerService('player-table');
    batchWriteStub = sandbox
      .stub(AWS.DynamoDB.DocumentClient.prototype, 'batchWrite')
      .returns({
        promise: () =>
          Promise.resolve({
            mockDynamoResponse: true,
          }),
      });
  });

  it('bulk creates players in dynamodb', done => {
    const players = [
      {
        id: '123',
        firstName: 'Bob',
        lastName: 'Smith',
        name: 'Bob Smith',
        countryOfOrigin: 'USA',
      },
    ];
    service.createPlayers(players).subscribe(data => {
      expect(batchWriteStub.calledOnce).true;
      expect(batchWriteStub.getCall(0).args).to.deep.equal([
        {
          RequestItems: {
            'player-table': [
              {
                PutRequest: {
                  TableName: 'player-table',
                  Item: {
                    id: { S: '123' },
                    firstName: { S: 'Bob' },
                    lastName: { S: 'Smith' },
                    name: { S: 'Bob Smith' },
                    countryOfOrigin: { S: 'USA' },
                  },
                },
              },
            ],
          },
        },
      ]);
      expect(data).to.deep.equal({
        mockDynamoResponse: true,
      });
      done();
    }, done);
  });

  afterEach(() => sandbox.reset());
  after(() => sandbox.restore());
});
