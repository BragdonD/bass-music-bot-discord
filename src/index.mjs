import { Client, Intents, VoiceChannel } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";

import dotenv from "dotenv"
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
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });
        }
        
    }
})