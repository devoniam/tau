"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
class ExampleListener extends _api_1.Listener {
    onGuildMemberUpdate(oldMember, newMember) {
        if (oldMember.displayName != newMember.displayName) {
            newMember.settings.nameHistory.push({
                name: newMember.displayName,
                time: _.now()
            });
            newMember.settings.save();
        }
    }
}
exports.ExampleListener = ExampleListener;
//# sourceMappingURL=nicknames.js.map