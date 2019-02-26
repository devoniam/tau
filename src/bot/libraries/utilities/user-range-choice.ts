// import {GuildMember} from "discord.js";
//
// export async function userRangedChoice(user: GuildMember, filter: (n: string) => boolean, amount: number) {
//     const collector = input.channel.createMessageCollector(filter);
//
//     collector.once('collect', async function (n) {
//         let topVid = topResults[parseInt(n.content) - 1];
//         getLogger().info(`Got input ${n.content} corresponding to ${topVid.title}`);
//
//         let videoInfo = await songInfo(topVid.url);
//
//         // Run the 'play' command
//         let id = input.guild.id;
//         await musicPlayer.playQueue(getServer(id), new video(topVid.title, videoInfo, input.author, input.channel));
//     });
// }