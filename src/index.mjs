import { Client, Intents, MessageEmbed } from "discord.js";
import { AudioPlayer, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { video_basic_info, stream } from 'play-dl';
import youtubeSearch from "youtube-search";
import axios from "axios"
import dotenv from "dotenv";

dotenv.config();

const client = new Client( { intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES ] } );

client.login( process.env.BOT_TOKEN );

client.on("messageCreate", async (message) => {
    try {
        if(message.content.startsWith("!play")) {
            const terms = message.content.split("!play").pop();
            const voiceChannel = message.member.voice.channel;
            if(!voiceChannel) {
                message.reply("You must be in a voice channel");
            }
            else {
                const opts = {
                    maxResults: 10,
                    key: process.env.YTB_SEARCH_API_KEY
                };
                
                const ytbResult = await youtubeSearch(terms, opts);

                const EmbedMessage = await createEmbedMessage(ytbResult.results[0]);
    
                message.channel.send({embeds: [EmbedMessage]})
                /*const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator
                });
                
                const player = createAudioPlayer();
    
                connection.subscribe(player);
    
                const ytbRessource = await stream("https://youtube.com/watch?v=n843kREfbdw");
    
                console.log(ytbRessource);
    
                const audio = createAudioResource(ytbRessource.stream, {
                    inputType: ytbRessource.type
                });
    
                player.play(audio);*/
                
            }  
        }
    } catch (e) {
        console.log(e);
    }
    
})

/**
 * 
 * @param {String} term 
 * @returns 
 */
const Search = (term) => {
    try {
        
    } 
    catch (e) {
        console.log(e);
        return null;
    }
}

/**
 * 
 * @param {youtubeSearch.YouTubeSearchResults} data 
 * @returns 
 */
const createEmbedMessage = async (data) => {
    const res = await axios.get(`https://www.googleapis.com/youtube/v3/channels?id=${data.channelId}&key=${process.env.YTB_SEARCH_API_KEY}&part=snippet`);
    const ytbdata = res.data;
    const res2 = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${data.id}&part=contentDetails&key=${process.env.YTB_SEARCH_API_KEY}`)
    const duration = res2.data.items[0].contentDetails.duration.slice(2,res2.data.items[0].contentDetails.duration.length).toLowerCase();
    console.log(duration);
    const Embed = new MessageEmbed()
        .setColor('#ff5733')
        .setTitle(data.title)
        .setURL(data.link)
        .setAuthor({ name: data.channelTitle, iconURL: ytbdata.items[0].snippet.thumbnails.default.url, url: data.link })
        .addField("Duration : ", duration, true)
        .setThumbnail(data.thumbnails.default.url)
        .setTimestamp();

    return Embed;
}

const handleBot = () => {

}