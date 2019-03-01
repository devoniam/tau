import { Listener } from "@api";
import { MessageReaction, User } from "discord.js";
import { Reactions } from "@bot/libraries/reactions";

export class ReactionListener extends Listener
{

    onMessageReactionAdd(messageReaction: MessageReaction, user: User) {
        Reactions.invoke('add', messageReaction.message, messageReaction, user);
    }

    onMessageReactionRemove(messageReaction: MessageReaction, user: User) {
        Reactions.invoke('remove', messageReaction.message, messageReaction, user);
    }

}
