import { AccountService } from './shared/account.service';

interface EventInput {
  userPoolId: string;
  userName: string;
  [key: string]: any;
}

export function postAuthentication(event: EventInput, ctx: any, callback: any) {
  const accountService = new AccountService(<string>process.env.DB_ACCOUNTS);
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(ctx));

  accountService.createAccount({ username: event.userName }).subscribe(
    () => {
      console.log('Resolving');
      callback(null, event);
    },
    err => {
      console.error(err);
      callback(err);
    }
  );
}
