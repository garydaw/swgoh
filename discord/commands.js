
import { SlashCommandBuilder } from 'discord.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if BB-VIP is responding'),

  new SlashCommandBuilder()
    .setName('getguildgp')
    .setDescription('Get the guild total Galactic Power'),

  new SlashCommandBuilder()
    .setName('rotekeyunits')
    .setDescription('Get the key units for the current ROTE event'),
];
