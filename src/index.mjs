import { Client, Intents, VoiceChannel } from "discord.js";
import { AudioPlayer, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import fs, { createReadStream } from "fs";
import ytdl from "ytdl-core";
import dotenv from "dotenv";
import ffmpeg from "ffmpeg-static"
import path from "path";

const __dirname = path.resolve(path.dirname(''));

dotenv.config();

const client = new Client( { intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES ] } );

client.login( process.env.BOT_TOKEN );

client.on("messageCreate", async (message) => {
    if(message.content.startsWith("!play")) {
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) {
            message.reply("You must be in a voice channel");
        }
        else {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });
            ytdl(`https://youtube.com/watch?v=n843kREfbdw`, {quality: "highestaudio"}).pipe(fs.createWriteStream('./data/video.mp4'));
            let ressource = fs.createReadStream( path.join(__dirname,"./data/video.mp4") );
            ressource.on("open", () => {
                let player = createAudioPlayer(path.join(__dirname,"./data/video.mp4"));
                player.play();
            })
            //console.log(path.join(__dirname,"./data/video.mp4"));
            
        }  
    }
})

