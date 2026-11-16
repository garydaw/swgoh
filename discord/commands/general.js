import { SlashCommandBuilder } from 'discord.js';

export const generalCommands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if BB-VIP is responding'),

  new SlashCommandBuilder()
    .setName('getguildgp')
    .setDescription('Get the guild total Galactic Power'),

  new SlashCommandBuilder()
  .setName('vader')
  .setDescription('Summon the Dark Lord of the Sith'),

  new SlashCommandBuilder()
  .setName('yoda')
  .setDescription('Summon the wise Master Yoda'),

];