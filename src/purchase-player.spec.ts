import { expect } from 'chai';
import { of } from 'rxjs';
import { createSandbox, SinonStub } from 'sinon';

import { purchasePlayer } from './purchase-player';
import { PlayerService } from './shared/player.service';
import { TeamService } from './shared/team.service';

describe(purchasePlayer.name, () => {
  let sandbox = createSandbox();
  let addPlayerToTeamStub: SinonStub;
  let getPlayerStub: SinonStub;
  let deletePlayerStub: SinonStub;

  before(() => {
    addPlayerToTeamStub = sandbox
      .stub(TeamService.prototype, 'addPlayerToTeam')
      .returns(
        of({
          id: 'player-0',
          name: 'Fred Johnson',
          firstName: 'Fred',
          lastName: 'Johnson',
          countryOfOrigin: 'New Zealand',
        })
      );
    getPlayerStub = sandbox.stub(PlayerService.prototype, 'getPlayer').returns(
      of({
        Item: {
          id: 'player-0',
          name: 'Fred Johnson',
          firstName: 'Fred',
          lastName: 'Johnson',
          countryOfOrigin: 'New Zealand',
          expireAt: new Date(100).toISOString(),
        },
      })
    );
    deletePlayerStub = sandbox
      .stub(PlayerService.prototype, 'deletePlayer')
      .returns(
        of({
          mockResponse: 200,
        })
      );
  });

  it('purchases a player', done => {
    const event = {
      username: 'cognito-user-abc-5',
      teamId: 'panther-team',
      playerId: 'player-0',
    };
    purchasePlayer(event, null, (err: any, data: any) => {
      // should add the player to the team
      expect(addPlayerToTeamStub.calledOnce).true;
      expect(addPlayerToTeamStub.getCall(0).args).to.deep.equal([
        'cognito-user-abc-5',
        'panther-team',
        {
          id: 'player-0',
          name: 'Fred Johnson',
          firstName: 'Fred',
          lastName: 'Johnson',
          countryOfOrigin: 'New Zealand',
          expireAt: new Date(100).toISOString(),
        },
      ]);
      expect(data).to.deep.equal({
        id: 'player-0',
        name: 'Fred Johnson',
        firstName: 'Fred',
        lastName: 'Johnson',
        countryOfOrigin: 'New Zealand',
      });
      done(err);
    });
  });

  afterEach(() => sandbox.resetHistory());
  after(() => sandbox.restore());
});
