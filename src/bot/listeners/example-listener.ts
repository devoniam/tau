import { Listener } from "@api";
import { Guild } from 'discord.js';

export class ExampleListener extends Listener
{

    onGuildCreate(guild: Guild) {
        // This is one of many available event methods. You can use autocompletion to see all available methods & args.
        // Define the methods in your class and they will automatically be invoked when the event occurs.
    }

}
