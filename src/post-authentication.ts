interface EventInput {
  [key: string]: any;
}

export function postAuthentication(
  event: EventInput,
  ctx: any,
  callback: Function
) {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(ctx));
  callback(null, event);
}
