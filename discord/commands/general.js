import { SlashCommandBuilder } from 'discord.js';

export const generalCommands = [

  new SlashCommandBuilder()
  .setName('bot_help')
  .setDescription('List the BB-VIP commands with descrptions '),

  new SlashCommandBuilder()
  .setName('link_account')
  .setDescription('Link your Discord account to your game profile'),

  new SlashCommandBuilder()
  .setName('vader')
  .setDescription('Summon the Dark Lord of the Sith'),

  new SlashCommandBuilder()
  .setName('yoda')
  .setDescription('Summon the wise Master Yoda'),

];