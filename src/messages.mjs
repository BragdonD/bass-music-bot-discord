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
            .addField("Track Length", audio.informations.TrackInfo.items[0].contentDetails.duration , true)
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
