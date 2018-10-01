import * as AWS from 'aws-sdk';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';

import { TeamService } from './team.service';

describe(TeamService.name, () => {
  let sandbox = createSandbox();
  let service: TeamService;
  let putStub: SinonStub;
  let updateStub: SinonStub;

  before(() => {
    service = new TeamService('team-table');
    putStub = sandbox
      .stub(AWS.DynamoDB.DocumentClient.prototype, 'put')
      .returns({
        promise: () =>
          Promise.resolve({
            mockDynamoResponse: true,
          }),
      });
    updateStub = sandbox
      .stub(AWS.DynamoDB.DocumentClient.prototype, 'update')
      .returns({
        promise: () =>
          Promise.resolve({
            mockDynamoResponse: true,
          }),
      });
  });

  it('creates a team for a user', done => {
    const team = {
      id: '000',
      name: 'Panthers',
      abbreviation: 'PTH',
    };
    service.createTeam('user-cognito-123', team).subscribe(data => {
      expect(putStub.calledOnce).true;
      expect(putStub.getCall(0).args).to.deep.equal([
        {
          TableName: 'team-table',
          Item: {
            id: '000',
            name: 'Panthers',
            abbreviation: 'PTH',
            ownerUsername: 'user-cognito-123',
            players: [],
          },
        },
      ]);
      expect(data).to.deep.equal({
        mockDynamoResponse: true,
      });
      done();
    }, done);
  });

  it('adds a player to a team', done => {
    const player: Player = {
      id: 'player-id-0',
      name: 'Bob Smith',
      firstName: 'Bob',
      lastName: 'Smith',
      countryOfOrigin: 'Armenia',
      expireAt: new Date(500).toISOString(),
    };
    service
      .addPlayerToTeam('user-cognito-123', 'team-panthers', player)
      .subscribe(data => {
        expect(updateStub.calledOnce).true;
        expect(updateStub.getCall(0).args).to.deep.equal([
          {
            TableName: 'team-table',
            Key: {
              id: 'team-panthers',
            },
            UpdateExpression:
              'SET #playerAttr = list_append(#playerAttr, :player)',
            ExpressionAttributeNames: {
              '#playerAttr': 'players',
            },
            // Can only add a player on a team the user owns
            ConditionExpression: 'ownerUsername = :username',
            ExpressionAttributeValues: {
              ':player': [
                {
                  id: 'player-id-0',
                  name: 'Bob Smith',
                  firstName: 'Bob',
                  lastName: 'Smith',
                  countryOfOrigin: 'Armenia',
                },
              ],
              ':username': 'user-cognito-123',
            },
          },
        ]);
        expect(data).to.deep.equal({
          id: 'player-id-0',
          name: 'Bob Smith',
          firstName: 'Bob',
          lastName: 'Smith',
          countryOfOrigin: 'Armenia',
        });
        done();
      }, done);
  });

  afterEach(() => sandbox.resetHistory());
  after(() => sandbox.restore());
});
