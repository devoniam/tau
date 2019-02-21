const path = require('path');
const fs = require('fs');

// Add lodash as a global variable (see /src/framework/types/global.d.ts)
global._ = require('lodash');

// Add typescript sourcemapping for stack traces
try { require('source-map-support').install(); }
catch (err) {}

// Add support for typescript path mapping
const BuiltinModule = require('module');
const Module = module.constructor.length > 1 ? module.constructor : BuiltinModule;
const Resolve = Module._resolveFilename;
const Paths = require('./tsconfig.json')['compilerOptions']['paths'];
const BaseUrl = path.resolve(__dirname, require('./tsconfig.json')['compilerOptions']['outDir']);
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
                    let absolutePath = path.join(BaseUrl, Paths[base][0].replace('/*', ''));
                    if (!absolutePath.endsWith('.js')) absolutePath += '.js';

                    return Resolve.call(this, ResolverCache[filename] = absolutePath, parentModule, isMain);
                }

                let resolverPaths = Paths[base];

                for (let i = 0; i < resolverPaths.length; i++) {
                    let resolverPath = resolverPaths[i];
                    let absolutePath = path.join(BaseUrl, resolverPath.replace('/*', relative));

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
