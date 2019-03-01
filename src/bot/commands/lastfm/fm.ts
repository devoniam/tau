import { Command, Input } from '@api';
import * as request from 'request';
import { Response } from 'request';
const unescape = require('unescape');

export class LastFm extends Command {

    constructor() {
        super({
            name: 'lastfm',
            description: '',
            arguments: [
                {
                    name: 'action',
                    options: ['set', 'get', 'remove', 'album', 'artist', 'chart', 'artistchart', 'trackchart'],
                    default: 'get'
                },
                {
                    name: 'user',
                    constraint: 'string'
                }
            ]
        });
    }

    async execute(input: Input) {
        let db = input.member.settings;

        let action = input.getArgument('action') as string;
        let user = input.getArgument('user') as string | undefined;
        if (!user) { user = db.lastfmId; }

        let key = '87aa68ded7b81dc193520b678aff7da6';
        let lastfmURL = 'http://ws.audioscrobbler.com/2.0/?method=';
        let queryString = '&user=' + user + '&api_key= ' + key + '&limit=2&format=json';

        switch(action) {
            case 'get':
                if (user && user != '') {
                    let requestURL = request((lastfmURL + 'user.getRecentTracks' + queryString), (error: any, response: Response, body: any) => {
                        if (error) {
                            input.channel.send({
                                embed: {
                                    color: 3447003,
                                    title: 'Connection Error',
                                    description: "Unable to retrieve lastfm data"
                                }
                            });
                        }

                        let nullText = '[undefined]';
                        let parsed = JSON.parse(body);
                        let currentTrack = parsed.recenttracks.track[0];

                        let trackName = currentTrack.name;
                        let artistName = currentTrack.artist['#text'];
                        let albumName = currentTrack.album['#text'];
                        let albumImage = currentTrack.image[1]['#text'];

                        let lastTrack = parsed.recenttracks.track[1];

                        let lastTrackName = lastTrack.name;
                        let lastArtistName = lastTrack.artist['#text'];
                        let lastAlbumName = lastTrack.album['#text'];

                        let description = 'Recently Played:';
                        let prefix = 'Last track:';
                        if (currentTrack.IsNowPlaying) {
                            description = 'Now Playing:';
                            prefix = 'Current:';
                        }
                        input.channel.send( {
                            embed: 
                            {
                                color: 3447003,
                                author: {
                                    name: user,
                                    icon_url: input.member.user.avatarURL
                                },
                                title: user + ', ' + input.member.displayName,
                                url:  'https://www.last.fm/user/' + user,
                                description: description,
                                thumbnail: {
                                    url: albumImage
                                },
                                fields: [
                                    {
                                        name: prefix + ' ' + trackName,
                                        value: artistName + ' | ' + albumName
                                    },
                                    {
                                        name: 'Previous: ' + lastTrackName,
                                        value: lastArtistName + ' | ' + lastAlbumName
                                    }
                                ]
                            }
                        });
                    });
                }
                break;
            case 'set':
                if (user && user != '') {
                    db.lastfmId = user;
                    input.channel.send('Lastfm username set to ' + user);
                } else {
                    input.channel.send('Please input a username');
                }
                break;
            case 'remove':
                db.lastfmId = '';
                input.channel.send('Lastfm username has been reset');
                break;
        }

        await db.save();
    }
}