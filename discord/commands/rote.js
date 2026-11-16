import { SlashCommandBuilder } from 'discord.js';

export const roteCommands = [
  new SlashCommandBuilder()
    .setName('rote_op_units')
    .setDescription('Get the players who have specific RotE operation units')
    .addStringOption(option =>
      option
        .setName('path')
        .setDescription('Choose the ROTE path')
        .setRequired(false)
        .addChoices(
          { name: 'Light', value: 'light' },
          { name: 'Neutral', value: 'neutral' },
          { name: 'Dark', value: 'dark' }
        )
    )
    .addIntegerOption(option =>
      option
        .setName('planet')
        .setDescription('Choose the planet')
        .setRequired(false)
        .addChoices(
          { name: 'Planet 1', value: 1 },
          { name: 'Planet 2', value: 2 },
          { name: 'Planet 3', value: 3 },
          { name: 'Planet 4', value: 4 },
          { name: 'Planet 5', value: 5 },
          { name: 'Planet 6', value: 6 }
        )
    )
    .addIntegerOption(option =>
      option
        .setName('operation')
        .setDescription('Choose the operation (1-6)')
        .setRequired(false)
        .addChoices(
          { name: 'Operation 1', value: 1 },
          { name: 'Operation 2', value: 2 },
          { name: 'Operation 3', value: 3 },
          { name: 'Operation 4', value: 4 },
          { name: 'Operation 5', value: 5 },
          { name: 'Operation 6', value: 6 }
        )
    )
];