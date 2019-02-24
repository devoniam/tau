import { Command, Input } from '@api';
import { Emoji } from '@bot/libraries/emoji';
import { Message, TextChannel, Collection, Snowflake } from 'discord.js';

export class Clear extends Command {
    constructor() {
        super({
            name: 'clear',
            description: 'Clears messages from the current channel.',
            arguments: [
                {
                    name: 'amount',
                    description: 'The number of messages to clear.',
                    patterns: /(\d+|all)/,
                    required: true,
                    usage: 'amount|all',
                    eval: (input: string) => {
                        if (input.equalsIgnoreCase('all')) return true;
                        if (parseInt(input) <= 0) return false;
                        if (parseInt(input) >= 1000) throw new Error('Amount must be 1,000 or less.');
                        return true;
                    }
                }
            ]
        });
    }

    async execute(input: Input) {
        let amount = input.getArgument('amount') as string;
        let limit = amount.equalsIgnoreCase('all') ? null : parseInt(amount);
        let message = await input.channel.send(':clock4:  Hold on...') as Message;
        let messagesToDelete = await this.getMessages(input.channel as TextChannel, limit, message.id);
        let originalSize = messagesToDelete.length;

        // Handle cases where all of the messages are older than two weeks
        if (messagesToDelete.length == 0) {
            await message.edit(`${Emoji.ERROR}  No messages left to delete.`);
            setTimeout(message.delete.bind(message), 5000);
            return;
        }

        // Add a fancy loading emoticon
        await message.edit(`${Emoji.LOADING}  Clearing ${messagesToDelete.length} messages (0%)...`);

        // Delete messages in chunks
        while (messagesToDelete.length > 0) {
            let chunk = messagesToDelete.slice(0, 99);
            messagesToDelete = messagesToDelete.slice(99);

            // Delete the chunk
            await input.channel.bulkDelete(chunk, true);

            // Calculate a percentage
            if (messagesToDelete.length > 0) {
                let percent = Math.floor(100 * ((originalSize - messagesToDelete.length) / originalSize));
                await message.edit(`${Emoji.LOADING}  Clearing ${messagesToDelete.length} messages (${percent}%)...`);
            }
        }

        await message.edit(`${Emoji.SUCCESS}  Cleared ${originalSize} messages.`);
        setTimeout(message.delete.bind(message), 5000);
    }

    /**
     * Returns an array of messages to delete.
     */
    private async getMessages(channel: TextChannel, limit: number | null, before: string) : Promise<Message[]> {
        let results : Message[] = [];
        let buffer : Collection<Snowflake, Message>;
        let twoWeeksAgo = _.now() - (86400 * 7 * 1000) + 300000;

        while ((buffer = await channel.fetchMessages({ before: before, limit: 100 })).size > 0) {
            let eligible = buffer.filter(message => message.createdTimestamp > twoWeeksAgo);

            eligible.forEach(msg => results.push(msg));

            if (eligible.last()) before = eligible.last().id;
            if (eligible.size < 100) break;
            if (limit && results.length >= limit) break;
        }

        return limit ? results.slice(0, limit) : results;
    }
}
