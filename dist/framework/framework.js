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
const member_1 = require("./lib/database/buckets/member");
const guild_1 = require("./lib/database/buckets/guild");
const input_1 = require("./bot/input");
class Framework {
    static start() {
        this.logger = new logger_1.Logger();
        this.loadConfiguration();
        this.bindGracefulShutdown();
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
                authentication: { discord: { token: '' }, cleverbot: { user: '', key: '' } }
            }, null, 4));
            return welcome();
        }
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
        process.on('SIGINT', () => {
            this.logger.info('Stopping gracefully...');
            this.logger.verbose('Waiting for client to sign off...');
            this.client.destroy().then(() => {
                this.logger.verbose('All done, sayonara!');
                process.exit();
            });
        });
    }
    static loadCommands(inDirectory) {
        if (inDirectory) {
            this.logger.verbose('Scanning for commands:', inDirectory);
            if (!fs.existsSync(inDirectory))
                return;
            let files = this.getFilesSync(inDirectory);
            return files.forEach(filePath => {
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
                this.logger.verbose('Hit:', filePath);
                require(filePath);
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
            let member = message.member;
            let guild = message.guild;
            if (!guild.settings) {
                guild.settings = new guild_1.GuildBucket(guild.id);
                await guild.settings.load();
            }
            if (!message.content.startsWith(guild.settings.prefix))
                return;
            if (member.user.bot)
                return;
            if (!member.settings) {
                member.settings = new member_1.MemberBucket(member.id);
                await member.settings.load();
            }
            let input = new input_1.Input(message);
            let command = input.getCommand();
            if (command) {
                if (input.isProper()) {
                    command.execute(input);
                }
                else {
                    message.channel.send('Usage:  `' + command.getUsage() + '`');
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