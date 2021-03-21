import {SimpleCanvas} from "./src/SimpleCanvas";

function version(): unknown {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return VERSION_INFO;
}

export {
  version,
  SimpleCanvas,
}
