import { Command, Input } from '@api';
import { Framework } from '@core/framework';

export class Ping extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Returns the bot\'s current latency.'
        });
    }

    execute(input: Input) {
        //input.channel.send('Not yet implemented.');
        let pingValue = Framework.getClient().ping;
        pingValue = Number(pingValue.toPrecision(4));
        input.channel.send(":satellite: Bot's last ping to server was **" + pingValue + " ms.**");
    }
}
