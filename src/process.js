import { Command } from "commander";
import config from "./config/config.js";


const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del server', 8080)
    .option('--mode <mode>', 'Modo de lanzamiento del programa', 'production')
    .option('--persistance <persistance>', 'Motor de persistencia a utilizar');

program.parse();

const options = program.opts();

export default options;