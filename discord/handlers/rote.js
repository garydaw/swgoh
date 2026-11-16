import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  MessageFlags
} from 'discord.js';

import { apiRequest, ApiError } from '../api.js';

export async function handleRoteInteraction(interaction) {

  // Handle the slash command
  if (
    interaction.isChatInputCommand() &&
    interaction.commandName === 'rote_op_units'
  ) {
    const path = interaction.options.getString('path');
    const planet = interaction.options.getInteger('planet');
    const operation = interaction.options.getInteger('operation');

    await interaction.deferReply();

    try {
      // If a path was supplied, skip the dropdown
      if (path) {
        if(planet) {
          if(operation){
            await showRoteOperationUnits(interaction, path, planet, operation);
          } else {
            await showRoteOperations(interaction, path, planet);
          }
        } else {
          await showRotePlanets(interaction, path);
        }
      } else {
        await showRotePathSelect(interaction);
      }
    } catch (error) {
      console.error('ROTE command error:', error);

      await interaction.editReply({
        content: 'Sorry, I couldn’t retrieve the ROTE information.',
        components: []
      });
    }

    return true;
  }

  // Handle the dropdown selection
  if (
    interaction.isStringSelectMenu() &&
    interaction.customId === 'rote_path_select'
  ) {
    const selectedPath = interaction.values[0];

    await interaction.deferUpdate();

    try {
      await showRotePlanets(interaction, selectedPath);
    } catch (error) {
      console.error('ROTE selection error:', error);

      await interaction.editReply({
        content: 'Sorry, I couldn’t retrieve the ROTE information.',
        components: []
      });
    }

    return true;
  }


  if (
    interaction.isStringSelectMenu() &&
    interaction.customId.startsWith('rote_planet_select_')
  ) {
    const path = interaction.customId.replace('rote_planet_select_', '');
    const planet = Number(interaction.values[0]);

    await interaction.deferUpdate();

    await showRoteOperations(interaction, path, planet);

    return true;
  }


  if (
    interaction.isStringSelectMenu() &&
    interaction.customId.startsWith('rote_operation_select_')
  ) {
    const path_planet = interaction.customId.replace('rote_operation_select_', '');
    const [path, planet] = path_planet.split('_');
    const operation = Number(interaction.values[0]);

    await interaction.deferUpdate();

    await showRoteOperationUnits(interaction, path, planet, operation);

    return true;
  }


  if (
    interaction.isStringSelectMenu() &&
    interaction.customId.startsWith('rote_unit_select_')
  ) {
    const path_planet_operation = interaction.customId.replace('rote_unit_select_', '');
    const [path, planet, operation] = path_planet_operation.split('_');
    const units = interaction.values;
    
    await interaction.deferUpdate();

    await showRoteOperationUnitsAllies(interaction, path, planet, operation, units);

    return true;
  }



  return false;
}


// Display the available paths
async function showRotePathSelect(interaction) {

  const paths = await apiRequest('/rote/ops');

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('rote_path_select')
    .setPlaceholder('Select a ROTE path')
    .addOptions(
      paths.map(path => ({
        label: path.charAt(0).toUpperCase() + path.slice(1),
        value: path.toLowerCase()
      }))
    );

  const row = new ActionRowBuilder()
    .addComponents(selectMenu);

  await interaction.editReply({
    content: 'Which ROTE path would you like?',
    components: [row]
  });
}


async function showRotePlanets(interaction, path) {

  const planets = await apiRequest(`/rote/ops/${path}/planets`);

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`rote_planet_select_${path}`)
    .setPlaceholder('Select a Planet')
    .addOptions(
      planets
        .sort((a, b) => a.phase - b.phase)
        .map(planet => ({
          label: `${planet.planet} (Planet ${planet.phase})`,
          value: String(planet.phase)
        }))
    );

  const row = new ActionRowBuilder()
    .addComponents(selectMenu);

  await interaction.editReply({
    content: 'Which planet would you like?',
    components: [row]
  });
}

async function showRoteOperations(interaction, path, planet) {

  const operations = [1, 2, 3, 4, 5, 6]; // Assuming there are 6 operations
  
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`rote_operation_select_${path}_${planet}`)
    .setPlaceholder('Select an Operation')
    .addOptions(
      operations.map(operation => ({
        label: `Operation ${operation}`,
        value: String(operation)
      }))
    );

  const row = new ActionRowBuilder()
    .addComponents(selectMenu);

  await interaction.editReply({
    content: 'Which operation would you like?',
    components: [row]
  });
}

async function showRoteOperationUnits(interaction, path, planet, operation) {

  const units = await apiRequest(`/rote/ops/${path}/${planet}/${operation}/units`);

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`rote_unit_select_${path}_${planet}_${operation}`)
    .setPlaceholder('Select a Unit or Units')
    .setMinValues(1)
    .setMaxValues(units.length)
    .addOptions(
      units.map(unit => ({
        label: unit.character_name,
        value: String(unit.base_id)
      }))
    );

  const row = new ActionRowBuilder()
    .addComponents(selectMenu);

  await interaction.editReply({
    content: 'Which unit would you like?',
    components: [row]
  });
}

async function showRoteOperationUnitsAllies(interaction, path, planet, operation, units) {
  const params = new URLSearchParams({
    units: units.join(',')
  });

  const data = await apiRequest(`/rote/ops/${path}/${planet}/${operation}/units/allies?${params}`);

  const groupedUnits = new Map();

  data.forEach(unit => {
    if (!groupedUnits.has(unit.character_name)) {
      groupedUnits.set(unit.character_name, []);
    }

    groupedUnits.get(unit.character_name).push(unit.ally_name);
  });

  let message = `**${data[0].path} - ${data[0].planet} Operation ${data[0].operation}**\n`;

  message += 'The following units can be placed by these players:\n\n';

  for (const [character, players] of groupedUnits) {
    message += `**${character}** - ${players.join(', ')}\n`;
  }

  await interaction.editReply({
    content: message,
    components: []
  });

}

