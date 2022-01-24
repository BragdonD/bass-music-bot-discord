import { Client, Intents } from "discord.js";
import { AudioPlayer, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { video_basic_info, stream } from 'play-dl';
import youtubeSearch from "youtube-search";
import dotenv from "dotenv";

dotenv.config();

const client = new Client( { intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES ] } );

client.login( process.env.BOT_TOKEN );

client.on("messageCreate", async (message) => {
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
            
            youtubeSearch(terms, opts, (err, results) => {
                if(err) return console.log(err);
              
                //console.dir(results[0].thumbnails.);
            });
            message.channel.send()
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

const handleBot = () => {

}