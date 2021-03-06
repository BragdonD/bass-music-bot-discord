import { Client, Message, MessageEmbed } from "discord.js"

/**
 * 
 * @param {Client} client the bot client
 */
export const createErrorJoinChannel = async () => {
    try {
        const embedMessageError = new MessageEmbed()
            .setColor("#f84a51")
            .addField("Error : ", "You need to be connected to a voice channel for me to play a song!", true)
        return embedMessageError;
    } 
    catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {Client} client the bot client
 * @param {{audio: AudioRessource, informations: {SearchInfo: youtubeSearch.YouTubeSearchResults,ChannelInfo: any,TrackInfo: any,}, message: Message, position: Number}} audio
 */
 export const createAddAudioMessage = async (client, audio) => {
    try {
        const embedMessageAdd = new MessageEmbed()
            .setColor("#607eba")
            .setTitle("Added track")
            .addField("Track", `**[${audio.informations.SearchInfo.title}](${audio.informations.SearchInfo.link})**`, false)
            .addField("Creator", `**[${audio.informations.SearchInfo.channelTitle}](https://www.youtube.com/channel/${audio.informations.SearchInfo.channelId})**`, false)
            .addField("Track Length", createTimeStampAudio(audio.informations.TrackInfo.items[0].contentDetails.duration) , true)
            .addField("Position in Queue", audio.position.toString(), true)
            .setThumbnail(audio.informations.SearchInfo.thumbnails.default.url)
        return embedMessageAdd;
    } 
    catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {Message} message the message received
 * @param {MessageEmbed} embedMessage the message to send
 */
export const sendEmbedMessage = async (message, embedMessage) => {
    try {
        await message.channel.send({embeds: [embedMessage]})
    } 
    catch (e) {
        console.log(e);
    }
}

/**
 * 
 * @param {String} duration Iso 8601 format given by Ytb Api v3
 */
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
}

/**
 * 
 * @param {String} duration 
 */
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
   
}