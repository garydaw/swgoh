import { SlashCommandBuilder } from 'discord.js';

export const generalCommands = [

  new SlashCommandBuilder()
  .setName('vader')
  .setDescription('Summon the Dark Lord of the Sith'),

  new SlashCommandBuilder()
  .setName('yoda')
  .setDescription('Summon the wise Master Yoda'),

  new SlashCommandBuilder()
  .setName('linkaccount')
  .setDescription('Link your Discord account to your game profile'),

];