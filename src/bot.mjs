import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Message } from "discord.js";
import { stream } from 'play-dl';
import youtubeSearch from "youtube-search";
import axios from "axios";
import { createAddAudioMessage, sendEmbedMessage } from "./messages.mjs";

export default class musicBot {
    constructor(props) {
        this.ChannelOption = {
            channelId: "",
            guildId: "",
            adapterCreator: ""
        }
        this.client = props.client;
        this.player = createAudioPlayer();
        this.connection = {
            connectionChannel: null,
            channelId: "",
        };
        this.queue = [];
    }

    /**
     * 
     * @param {String} name 
     * @returns 
     */
    async searchAudio(name) {
        try {
            const opts = {
                maxResults: 1,
                key: process.env.YTB_SEARCH_API_KEY
            };
            const ytbResult = (await youtubeSearch(name, opts)).results[0];
            const ChannelInformations = await axios.get(`https://www.googleapis.com/youtube/v3/channels?id=${ytbResult.channelId}&key=${process.env.YTB_SEARCH_API_KEY}&part=snippet`);
            const TrackInformations = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${ytbResult.id}&part=contentDetails&key=${process.env.YTB_SEARCH_API_KEY}`)
            return {
                SearchInfo: ytbResult,
                TrackInfo: TrackInformations.data,
                ChannelInfo: ChannelInformations.data
            }
        } 
        catch (e) {
            console.log(e);
        }
    }

    async getAudio(id) {
        try {
            const ytbRessource = await stream(`https://youtube.com/watch?v=${id}`, {quality: 1});
            return createAudioResource(ytbRessource.stream, {
                inputType: ytbRessource.type
            });
        } 
        catch (e) {
            console.log(e);    
        }
    }

    async addAudio(audio, songInformations, message) {
        try {
            this.queue.push({
                audio: audio,
                informations: songInformations,
                message: message,
                position: this.queue.length + 1
            });

            sendEmbedMessage( this.queue.at(-1).message, await createAddAudioMessage(this.client, this.queue.at(-1)));

        } 
        catch (e) {
            console.log(e);
        }
        
    }

    skipAudio() {
        if(this.queue.length > 0) {
            this.queue.splice(0,1);
            this.player.stop();
            this.playAudio();
        }
    }

    pauseAudio() {
        if(this.player.state.status == AudioPlayerStatus.Playing) {
            this.player.pause();
        }
    }

    continueAudio() {
        if(this.player.state.status == AudioPlayerStatus.Paused) {
            this.player.unpause();
        }
    }

    playAudio() {
        if(this.queue.length > 0 ) {
            this.player.play(this.queue[0].audio);
            this.player.addListener("stateChange", (oldState, newState) => {
                if(newState.status == AudioPlayerStatus.Idle){
                    this.skipAudio();
                    this.playAudio();
                }
            })
        }
    }
    
    leave() {
        this.connection.connectionChannel.disconnect();
        this.connection.connectionChannel = null;
    }

    /**
     * 
     * @param {VoiceBasedChannel} voiceChannel 
     * @param {Message} message
     */
    joinChannel(voiceChannel, message) {
        this.ChannelOption.channelId = voiceChannel.id;
        this.ChannelOption.guildId = message.guild.id;
        this.ChannelOption.adapterCreator = message.guild.voiceAdapterCreator;
        this.connection.connectionChannel = joinVoiceChannel(this.ChannelOption);
        this.connection.connectionChannel.subscribe(this.player);
        this.connection.channelId = message.channel.id;
    }
}