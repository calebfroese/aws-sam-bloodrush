import { expect } from 'chai';
import { of } from 'rxjs';
import { createSandbox, SinonStub } from 'sinon';

import { createTeam } from './create-team';
import { AccountService } from './shared/account.service';
import { TeamService } from './shared/team.service';

describe(createTeam.name, () => {
  let sandbox = createSandbox();
  let createTeamStub: SinonStub;
  let addTeamStub: SinonStub;

  before(() => {
    addTeamStub = sandbox
      .stub(AccountService.prototype, 'addTeam')
      .returns(of({ mockCreateResponse: 100 }));
    createTeamStub = sandbox
      .stub(TeamService.prototype, 'createTeam')
      .returns(of({ mockCreateResponse: 100 }));
  });

  it('creates the expected amount of players', done => {
    createTeam(
      {
        username: 'bob-smith',
        team: {
          name: 'Panthers',
          abbreviation: 'PTH',
        },
      },
      null,
      (err: any, data: any) => {
        expect(createTeamStub.calledOnce).true;
        const [username, team] = createTeamStub.getCall(0).args;
        expect(username).eq('bob-smith');
        expect(team).to.haveOwnProperty('name', 'Panthers');
        expect(team).to.haveOwnProperty('abbreviation', 'PTH');
        expect(team).to.haveOwnProperty('id');
        // response should contain the team
        expect(data).to.haveOwnProperty('name', 'Panthers');
        expect(data).to.haveOwnProperty('abbreviation', 'PTH');
        expect(data).to.haveOwnProperty('id');

        expect(addTeamStub.calledOnce).true;
        expect(addTeamStub.getCall(0).args[0]).eq('bob-smith');
        expect(addTeamStub.getCall(0).args[1]).exist;

        done(err);
      }
    );
  });

  afterEach(() => sandbox.resetHistory());
  after(() => sandbox.restore());
});
