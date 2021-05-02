import { Logger } from "logger";

const logger = new Logger();
const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000));

export { logger, sleep }