"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const cli_1 = require("./utils/cli");
const logger_1 = require("./bot/logger");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const command_1 = require("./bot/command");
const listener_1 = require("./bot/listener");
const job_1 = require("./bot/job");
const input_1 = require("./bot/input");
const emoji_1 = require("@bot/libraries/emoji");
const server_1 = require("./internal/server");
const database_1 = require("./lib/database");
const chalk_1 = require("chalk");
class Framework {
    static start() {
        this.logger = new logger_1.Logger();
        this.loadConfiguration();
        this.startServer();
        this.bindGracefulShutdown();
        if (!cli_1.CommandLine.hasFlag('dry')) {
            this.logger.info('Logging in...');
            this.client = new discord_js_1.Client();
            this.client.login(this.config.authentication.discord.token);
            this.client.on('ready', () => {
                this.logger.clear();
                this.logger.info('Logged in as %s.', this.client.user.tag);
                this.logger.debug('Logged in with Client Id: %s', this.client.user.id);
                this.logger.verbose('This client is a %s.', this.client.user.bot ? 'bot' : 'user');
                this.logger.verbose('Found %d channels across %d guilds.', this.client.channels.size, this.client.guilds.size);
                this.logger.debug('Loading components...');
                this.loadCommands();
                this.loadListeners();
                this.loadScripts();
                this.loadJobs();
                this.listen();
                this.logger.debug('Bot is online...');
            });
        }
        else {
            this.loadCommands();
            this.loadScripts();
        }
    }
    static getConfig() {
        return this.config;
    }
    static getClient() {
        return this.client;
    }
    static getLoggingLevel() {
        if (cli_1.CommandLine.hasFlag('debug'))
            return 'debug';
        if (cli_1.CommandLine.hasFlag('verbose'))
            return 'verbose';
        return this.config.options.loggingLevel;
    }
    static getEnvironment() {
        return this.config.environment;
    }
    static loadConfiguration() {
        let configFilePath = path.join(__dirname, '../../', 'config.json');
        let welcome = () => {
            this.logger.error('Welcome!');
            this.logger.error('A starter config.json file was generated for you.');
            this.logger.error('Please edit this file and configure a Discord client token.');
            process.exit();
        };
        if (fs.existsSync(configFilePath) && this.start) {
            this.config = require(configFilePath);
            if (!this.config.authentication.discord.token) {
                return welcome();
            }
        }
        else {
            fs.writeFileSync(configFilePath, JSON.stringify({
                environment: 'test',
                options: { allowCodeExecution: false, loggingLevel: 'normal' },
                server: { enabled: true, port: 3121 },
                authentication: { discord: { token: '' }, cleverbot: { user: '', key: '' } }
            }, null, 4));
            return welcome();
        }
    }
    static startServer() {
        this.logger.verbose('Starting socket server on port %d...', this.config.server.port || 3121);
        this.server = new server_1.Server(this.config.server.port);
        this.server.start();
    }
    static bindGracefulShutdown() {
        if (process.platform === 'win32') {
            let rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.on('SIGINT', () => {
                process.emit('SIGINT');
            });
        }
        process.on('SIGINT', async () => {
            if (!cli_1.CommandLine.hasFlag('dry')) {
                this.logger.info('Stopping gracefully...');
                this.logger.verbose('Waiting for client to sign off...');
                await this.client.destroy();
                if (this.server) {
                    this.logger.verbose('Waiting for socket server to shut down...');
                    await this.server.stop();
                }
                this.logger.verbose('All done, sayonara!');
                process.exit();
            }
            else {
                if (this.server) {
                    this.logger.verbose('Waiting for socket server to shut down...');
                    await this.server.stop();
                }
                this.logger.verbose('Closing database...');
                await database_1.Database.close();
                process.exit();
            }
        });
    }
    static loadCommands(inDirectory) {
        if (inDirectory) {
            this.logger.verbose('Scanning for commands:', inDirectory);
            if (!fs.existsSync(inDirectory))
                return;
            let files = this.getFilesSync(inDirectory);
            return files.forEach(filePath => {
                let fileName = filePath.substring(inDirectory.length + 1);
                try {
                    this.logger.verbose('Hit:', filePath);
                    let classes = require(filePath);
                    for (let className in classes) {
                        let command = classes[className];
                        if (typeof command === 'function') {
                            let instance = new command();
                            if (instance instanceof command_1.Command) {
                                this.commands.push(instance);
                            }
                        }
                    }
                }
                catch (error) {
                    this.logger.error(`Encountered an error when loading commands/${fileName}:`);
                    this.logger.error(error);
                }
            });
        }
        this.loadCommands(path.join(__dirname, '../bot/commands'));
    }
    static loadListeners(inDirectory) {
        if (inDirectory) {
            this.logger.verbose('Scanning for listeners:', inDirectory);
            if (!fs.existsSync(inDirectory))
                return;
            let files = this.getFilesSync(inDirectory);
            return files.forEach(filePath => {
                let fileName = filePath.substring(inDirectory.length + 1);
                try {
                    this.logger.verbose('Hit:', filePath);
                    let classes = require(filePath);
                    for (let className in classes) {
                        let listener = classes[className];
                        if (typeof listener === 'function') {
                            let instance = new listener();
                            if (instance instanceof listener_1.Listener) {
                                instance.start();
                            }
                        }
                    }
                }
                catch (error) {
                    this.logger.error(`Encountered an error when loading listeners/${fileName}:`);
                    this.logger.error(error);
                }
            });
        }
        this.loadListeners(path.join(__dirname, '../bot/listeners'));
    }
    static loadScripts(inDirectory) {
        if (inDirectory) {
            this.logger.verbose('Scanning for scripts:', inDirectory);
            if (!fs.existsSync(inDirectory))
                return;
            let files = this.getFilesSync(inDirectory);
            return files.forEach(filePath => {
                let fileName = filePath.substring(inDirectory.length + 1);
                try {
                    this.logger.verbose('Hit:', filePath);
                    require(filePath);
                }
                catch (error) {
                    this.logger.error(`Encountered an error when loading scripts/${fileName}:`);
                    this.logger.error(error);
                }
            });
        }
        this.loadScripts(path.join(__dirname, '../bot/scripts'));
    }
    static loadJobs(inDirectory) {
        if (inDirectory) {
            this.logger.verbose('Scanning for jobs:', inDirectory);
            if (!fs.existsSync(inDirectory))
                return;
            let files = this.getFilesSync(inDirectory);
            return files.forEach(filePath => {
                let fileName = filePath.substring(inDirectory.length + 1);
                try {
                    this.logger.verbose('Hit:', filePath);
                    let classes = require(filePath);
                    for (let className in classes) {
                        let job = classes[className];
                        if (typeof job === 'function') {
                            let instance = new job();
                            if (instance instanceof job_1.Job) {
                                instance.start();
                            }
                        }
                    }
                }
                catch (error) {
                    this.logger.error(`Encountered an error when loading jobs/${fileName}:`);
                    this.logger.error(error);
                }
            });
        }
        this.loadJobs(path.join(__dirname, '../bot/jobs'));
    }
    static getFilesSync(dir, filelist) {
        let files = fs.readdirSync(dir);
        let found = filelist || [];
        files.forEach(file => {
            if (fs.statSync(dir + '/' + file).isDirectory()) {
                found = this.getFilesSync(dir + '/' + file, found);
            }
            else if (file.toLowerCase().endsWith('.js')) {
                found.push(path.resolve(dir + '/' + file));
            }
        });
        return found;
    }
    static listen() {
        this.client.on('message', async (message) => {
            if (message.channel.type !== 'text')
                return;
            let member = message.member;
            let guild = message.guild;
            if (!guild.settings) {
                await guild.load();
            }
            if (!message.content.startsWith(guild.settings.prefix))
                return;
            if (member.user.bot)
                return;
            if (!member.settings) {
                await member.load();
            }
            let input = new input_1.Input(message);
            await input.wait();
            let command = input.getCommand();
            if (command) {
                if (input.isProper()) {
                    let commandName = command.getName();
                    let serverId = (this.getEnvironment() == 'production') ? `${chalk_1.default.gray(input.guild.name)}: ` : '';
                    try {
                        this.logger.info(`${serverId}${input.member.user.tag} issued command: ${input.message.content}`);
                        if (command.getPermission() == undefined || input.member.hasPermission(command.getPermission())) {
                            let returned = command.execute(input);
                            if (Promise.resolve(returned) == returned) {
                                returned.catch(error => {
                                    this.logger.error(`Encountered an error when running ${commandName} command:`);
                                    this.logger.error(error);
                                    input.channel.send(':tools:  Internal error, check console.');
                                });
                            }
                        }
                        else {
                            this.logger.info(`${serverId}${input.member.user.tag} was denied access to command.`);
                            input.channel.send(`${emoji_1.Emoji.ERROR}  You don't have permissions to run that command, sorry.`);
                        }
                    }
                    catch (error) {
                        this.logger.error(`Encountered an error when running ${commandName} command:`);
                        this.logger.error(error);
                        input.channel.send(':tools:  Internal error, check console.');
                    }
                }
                else {
                    let error = input.getError();
                    if (error) {
                        if (error.message.endsWith('.')) {
                            error.message = error.message.substring(0, error.message.length - 1) + ':';
                        }
                    }
                    if (error && (!error.message.startsWith('Please enter a') || error.message.startsWith('Please enter a valid'))) {
                        message.channel.send(`${emoji_1.Emoji.ERROR}  ${error.message}  \`${command.getUsage()}\``);
                    }
                    else {
                        message.channel.send(`${emoji_1.Emoji.HELP}  Usage:  \`${command.getUsage()}\``);
                    }
                }
            }
        });
    }
    static findCommand(name) {
        for (let i = 0; i < this.commands.length; i++) {
            let command = this.commands[i];
            if (command.hasAlias(name)) {
                return command;
            }
        }
        return null;
    }
}
Framework.commands = [];
exports.Framework = Framework;
//# sourceMappingURL=framework.js.map