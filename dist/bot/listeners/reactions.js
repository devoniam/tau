"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _api_1 = require("@api");
const reactions_1 = require("@bot/libraries/reactions");
class ReactionListener extends _api_1.Listener {
    onMessageReactionAdd(messageReaction, user) {
        reactions_1.Reactions.invoke('add', messageReaction.message, messageReaction, user);
    }
    onMessageReactionRemove(messageReaction, user) {
        reactions_1.Reactions.invoke('remove', messageReaction.message, messageReaction, user);
    }
}
exports.ReactionListener = ReactionListener;
//# sourceMappingURL=reactions.js.map