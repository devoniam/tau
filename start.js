const path = require('path');
const fs = require('fs');

// Add lodash as a global variable (see /src/framework/types/global.d.ts)
global._ = require('lodash');

// Add pub, tmp, and sleep global functions

global.pub = function(p) {
    return path.join(__dirname, 'public', p);
};

global.readPublicFile = function(p) {
    let filePath = path.join(__dirname, 'public', p);

    if (!fs.existsSync(filePath)) {
        throw new Error('Public file does not exist: ' + p);
    }

    let data = fs.readFileSync(filePath).toString();
    let lines = data.split('\n');

    return lines.filter(function (line) {
        return line.indexOf('#') != 0;
    }).join('\n').trim();
};

global.tmp = function(p) {
    return path.join(__dirname, p);
};

global.rootpath = function(p) {
    return path.join(__dirname, p);
};

global.sleep = function(t) {
    return new Promise(resolve => {
        setTimeout(resolve, t);
    });
};

// Add to string prototype

String.prototype.equalsIgnoreCase = (function(o) {
    return o.toLowerCase() == this.toLowerCase();
});

String.prototype.equals = (function(o) {
    return o == this;
});

String.prototype.capitalize = (function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
});

// Add to message and guild prototypes

const { Message, Guild, GuildMember } = require('discord.js');

Message.prototype.deleteAfter = (function(ms) {
    setTimeout(() => {
        this.delete().catch(err => {});
    }, ms);
});

Message.prototype.reactCustom = (async function(emoji) {
    let client = require('@core/framework').Framework.getClient();
    let matches = /<:.+:(\d+)>/.exec(emoji);

    if (matches) {
        let id = matches[1];
        let emoji = client.emojis.get(id);

        return await this.react(emoji);
    }

    throw new Error('No known custom emoji "' + emoji + '".');
});

Guild.prototype.getDefaultChannel = (function() {
    let channels = this.channels.array();
    let user = require('@core/framework').Framework.getClient().user;

    if (this.systemChannel && this.systemChannel.permissionsFor(user).has('SEND_MESSAGES') && this.systemChannel.permissionsFor(user).has('READ_MESSAGES')) {
        return this.systemChannel;
    }

    for (let i = 0; i < channels.length; i++) {
        let channel = channels[i];

        if (channel.type == 'text' && channel.permissionsFor(user).has('SEND_MESSAGES') && channel.permissionsFor(user).has('READ_MESSAGES')) {
            return channel;
        }
    }

    return undefined;
});

Guild.prototype.load = (async function() {
    if (!this.settings) {
        let { GuildBucket } = require('@libraries/database/guild');
        this.settings = new GuildBucket(this.id);
        await this.settings.load();
    }

    await this.settings.wait();
});

GuildMember.prototype.load = (async function() {
    if (!this.settings) {
        let { MemberBucket } = require('@libraries/database/member');
        this.settings = new MemberBucket(this.id, this.guild.id);
        await this.settings.load();
    }

    await this.settings.wait();
    await this.guild.load();
});

// Add typescript sourcemapping for stack traces
try { require('source-map-support').install(); }
catch (err) {}

// Add support for typescript path mapping
const BuiltinModule = require('module');
const Module = module.constructor.length > 1 ? module.constructor : BuiltinModule;
const Resolve = Module._resolveFilename;
const Paths = require('./tsconfig.json')['compilerOptions']['paths'];
const BaseUrl = path.resolve(__dirname, require('./tsconfig.json')['compilerOptions']['outDir']);
const BaseUrlTmp = path.resolve(__dirname, 'dist-tmp');
const ResolverCache = {};

Module._resolveFilename = (filename, parentModule, isMain) => {
    if (filename.startsWith('@')) {
        filename = filename.toLowerCase();

        if (filename in ResolverCache) {
            return ResolverCache[filename];
        }

        for (let base in Paths) {
            let baseRegExp = new RegExp(base.replace('/*', '(\/(.+))?'));

            if (baseRegExp.test(filename)) {
                let relative = baseRegExp.exec(filename)[1];

                if (relative === undefined) {
                    let absolutePath = path.join((fs.existsSync(BaseUrlTmp)) ? BaseUrlTmp : BaseUrl, Paths[base][0].replace('/*', ''));
                    if (!absolutePath.endsWith('.js')) absolutePath += '.js';

                    return Resolve.call(this, ResolverCache[filename] = absolutePath, parentModule, isMain);
                }

                let resolverPaths = Paths[base];

                for (let i = 0; i < resolverPaths.length; i++) {
                    let resolverPath = resolverPaths[i];
                    let absolutePath = path.join((fs.existsSync(BaseUrlTmp)) ? BaseUrlTmp : BaseUrl, resolverPath.replace('/*', relative));

                    if (!absolutePath.endsWith('.js')) absolutePath += '.js';

                    if (fs.existsSync(absolutePath) || i === (resolverPaths.length - 1)) {
                        return Resolve.call(this, ResolverCache[filename] = absolutePath, parentModule, isMain);
                    }
                }
            }
        }
    }

    return Resolve.call(this, filename, parentModule, isMain);
}

require('@core/framework').Framework.start();
