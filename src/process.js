import { Command } from "commander";
import config from "./config/config.js";


const program = new Command();

program
    .option('-d', 'Variable para debug', true)
    .option('-p <port>', 'Puerto del server')
    .option('--mode <mode>', 'Modo de lanzamiento del programa', 'production')
    .option('--persistance <persistance>', 'Motor de persistencia a utilizar');

program.parse();

const options = program.opts();

export default options;