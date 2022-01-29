import { Client, Intents } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import youtubeSearch from "youtube-search";
import dotenv from "dotenv";
import musicBot from "./bot.mjs";
import { createErrorJoinChannel, sendEmbedMessage } from "./messages.mjs";

dotenv.config();

const client = new Client( { intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ] } );

client.login( process.env.BOT_TOKEN );

let bot = new musicBot({client: client});

client.on("messageCreate", async (message) => {
    try {
        if(message.content.startsWith("!play")) {
            const nameOfTheSong = message.content.split("!play").pop();
            const voiceChannel = message.member.voice.channel;
            if(!voiceChannel) {
                await sendEmbedMessage( message, await createErrorJoinChannel( client ) );
                return;
            }
            else {
                if(!bot.connection.connectionChannel) {
                    bot.joinChannel(voiceChannel, message);
                }
                if(nameOfTheSong.length > 0) {
                    const songInformations = await bot.searchAudio(nameOfTheSong);
                    const audioRessouce = await bot.getAudio(songInformations.SearchInfo.id);
                    bot.addAudio(audioRessouce, songInformations, message);
                    if(bot.player.state.status == AudioPlayerStatus.Idle) {
                        bot.playAudio();
                    }
                }
            }      
        }
        else if(message.content.startsWith("!skip")) {
            bot.skipAudio();
        }
        else if(message.content.startsWith("!pause")) {
            bot.pauseAudio();
        }
        else if(message.content.startsWith("!unpause")) {
            bot.continueAudio();
        }
        else if(message.content.startsWith("!leave")) {
            bot.leave();
        }
    }
    catch (e) {
        console.log(e);
    } 
})
/*
/**
 * 
 * @param {String} term 
 * @returns 
 *//*
const Search = (term) => {
    try {
        
    } 
    catch (e) {
        console.log(e);
        return null;
    }
}*/

/**
 * 
 * @param {youtubeSearch.YouTubeSearchResults} data 
 * @returns 
 *//*
const createEmbedMessage = async (data) => {
    try {
        const res = await axios.get(`https://www.googleapis.com/youtube/v3/channels?id=${data.channelId}&key=${process.env.YTB_SEARCH_API_KEY}&part=snippet`);
        const ytbdata = res.data;
        const res2 = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${data.id}&part=contentDetails&key=${process.env.YTB_SEARCH_API_KEY}`)
        const duration = res2.data.items[0].contentDetails.duration;
        const Embed = new MessageEmbed()
            .setColor('#ff5733')
            .setTitle(data.title)
            .setURL(data.link)
            .setAuthor({ name: data.channelTitle, iconURL: ytbdata.items[0].snippet.thumbnails.default.url, url: data.link })
            .addField("Duration : ", createTimeStampAudio(duration), true)
            .setThumbnail(data.thumbnails.default.url)
            .setTimestamp();

        return Embed;
    } catch (e) {
        console.log(e);
    }
}*/

/**
 * 
 * @param {String} duration Iso 8601 format given by Ytb Api v3
 *//*
const createTimeStampAudio = (duration) => {
    const troncation = duration.slice(2);
    
    if(troncation.indexOf("H") == -1){
        if(troncation.indexOf("M") != -1){
            const min = troncation.slice(0,1);
            const sec = troncation.slice(2,3);
            return `${transformDuration(min)}:${transformDuration(sec)}`;
        }
        else {
            const sec = troncation.slice(3,4);
            return `00:${transformDuration(sec)}`;
        }
    }
    else {
        const hour = troncation.slice(0,1);
        const min = troncation.slice(3,4);
        const sec = troncation.slice(6,7)
        return `${transformDuration(hour)}:${transformDuration(min)}:${transformDuration(sec)}`
    }
}*/

/**
 * 
 * @param {String} duration 
 *//*
const transformDuration = (duration) => {
    if(duration != "") {
        if(parseInt(duration) < 10){
            return `0${duration}`;
        }
        else {
            return duration;
        }
    }
    else {
        return "00"
    }
   
}*/ 
/*
const handleBot = () => {

}*/