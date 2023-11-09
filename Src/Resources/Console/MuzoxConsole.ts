import colors from 'colors';
import moment from "moment";

export default class Logger {
  static log(content: string, type = "log") {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    
const myTheme = {
  info: colors.blue,
  warn: colors.yellow,
  error: colors.red
};
    colors.setTheme(myTheme)
    switch (type) {
      
      case "Ready": {
        return console.log(
          `[${colors.white(date)}] ${colors.bgGreen(
            type.toUpperCase()
          )} ${colors.grey(content)}`
        );
      }
      case "Error":{
        return console.log(
            `[${colors.white(date)}] ${colors.red(type.toUpperCase())} ${colors.red(content)}`
        )
      }
      case "[Warn]":{
        return console.log(
            `${colors.yellow(type.toLocaleLowerCase())} ${colors.yellow(content)}`
        )
      }
      case "[/]":{
        return console.log(
            `[${colors.white(date)}] ${colors.green(type.toUpperCase())} ${colors.grey(content)}`
        )
      }
      case "Loaded":{
        return console.log(
            `[${colors.white(date)}] [${colors.green(type.toUpperCase())}] ${colors.grey(content)}`
        )
      }
      case "Lavalink":{
        return console.log(
          `[${colors.white(date)}] [${colors.red(type.toLocaleUpperCase())}] ${colors.grey(content)}` 
        )
      }
      case "Db": {
        return console.log(
          `[${colors.white(date)}] ${colors.bgBlue(type.toLocaleUpperCase())} ${colors.grey(content)}`
        )
      }
      case "[Shard]":{
        return console.log(
          `[${colors.white(date)}] ${colors.blue(type.toLocaleUpperCase())} ${colors.grey(content)}`
        )
      }
      case "[RateLimit]":{
        return console.log(
          `[${colors.white(date)}] ${colors.yellow(type.toLocaleUpperCase())} ${colors.grey(content)}`
        )
      }
      case "[RestDebug]":{
        return console.log(
          `[${colors.white(date)}] ${colors.yellow(type.toLocaleUpperCase())} ${colors.grey(content)}`
        )
        
      }

      case "[ShardError]": {
        return console.log(
          `[${colors.white(date)}] ${colors.red(type.toLocaleUpperCase())} ${colors.red(content)}`
        )
      }
      default:
        throw new TypeError(
          "Logger type must be either warn, debug, log, ready, cmd or error."
        );
    }
  }
}
