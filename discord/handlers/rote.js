
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  MessageFlags
} from 'discord.js';

import { apiRequest } from '../api.js';

// Store selected units for each Discord message
const roteUnitSelections = new Map();


export async function handleRoteInteraction(interaction) {

  try {

    // ==========================================
    // ROTE MY OP DEPLOYMENTS
    // ==========================================

    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === 'rote_my_ops'
    ) {

      const phase = interaction.options.getInteger('phase');

      const deployments = await apiRequest(`/rote/ops/deployments/${phase}/${interaction.user.id}`);

      //player not found
      if(!deployments.player){
        await interaction.reply({
          content: 'Player not found, check you have linked your account by calling /link_account',
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      // no active plan
      if(!deployments.planner){
        await interaction.reply({
          content: 'No Active rote plan has been set, send a message to Bobba Daw',
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const embed = createDeploymentEmbed(deployments.deployments);

      await interaction.reply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral
      });
    }

  function createDeploymentEmbed(deployments) {
    const paths = {
        dark: { name: '🌑 Dark Side', operations: {} },
        light: { name: '🌟 Light Side', operations: {} },
        neutral: { name: '⚖️ Neutral', operations: {} }
    };

    for (const deployment of deployments) {
        const { path, planet, operation, character_name } = deployment;

        if (!paths[path]) continue;

        paths[path].planet = planet;

        if (!paths[path].operations[operation]) {
            paths[path].operations[operation] = [];
        }

        paths[path].operations[operation].push(character_name);
    }

    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('Your ROTE Deployments')
        .setDescription(
            Object.values(paths)
                .filter(group => Object.keys(group.operations).length > 0)
                .map(group => {
                    const operationText = Object.entries(group.operations)
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([operation, characters]) =>
                            `**Operation ${operation}**\n` +
                            characters.map(name => `• ${name}`).join('\n')
                        )
                        .join('\n');

                    return `**${group.name} – ${group.planet}**\n${operationText}`;
                })
                .join('\n\n')
        )
        .setFooter({
            text: `Total deployments: ${deployments.length}`
        });

    return embed;
  }


    

    // ==========================================
    // ROTE OP UNITS COMMAND
    // ==========================================

    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === 'rote_op_units'
    ) {
      const path = interaction.options.getString('path');
      const planet = interaction.options.getInteger('planet');
      const operation = interaction.options.getInteger('operation');

      await interaction.deferReply({
        flags: MessageFlags.Ephemeral
      });

      // If a path was supplied, skip the path dropdown
      if (path) {

        if (planet) {

          if (operation) {
            await showRoteOperationUnits(
              interaction,
              path,
              planet,
              operation
            );
          } else {
            await showRoteOperations(interaction, path, planet);
          }

        } else {
          await showRotePlanets(interaction, path);
        }

      } else {
        await showRotePathSelect(interaction);
      }

      return true;
    }


    // ==========================================
    // PATH DROPDOWN SELECTION
    // ==========================================

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === 'rote_path_select'
    ) {
      const selectedPath = interaction.values[0];

      await interaction.deferUpdate();

      await showRotePlanets(interaction, selectedPath);

      return true;
    }


    // ==========================================
    // PLANET DROPDOWN SELECTION
    // ==========================================

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId.startsWith('rote_planet_select_')
    ) {
      const path = interaction.customId.replace(
        'rote_planet_select_',
        ''
      );

      const planet = Number(interaction.values[0]);

      await interaction.deferUpdate();

      await showRoteOperations(interaction, path, planet);

      return true;
    }


    // ==========================================
    // OPERATION DROPDOWN SELECTION
    // ==========================================

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId.startsWith('rote_operation_select:')
    ) {
      const [, path, planet] = interaction.customId.split(':');

      const operation = Number(interaction.values[0]);

      await interaction.deferUpdate();

      await showRoteOperationUnits(
        interaction,
        path,
        Number(planet),
        operation
      );

      return true;
    }


    // ==========================================
    // UNIT BUTTON TOGGLE
    // ==========================================

    if (
      interaction.isButton() &&
      interaction.customId.startsWith('rote_unit_toggle:')
    ) {
      const messageId = interaction.message.id;

      const selection = roteUnitSelections.get(messageId);

      if (!selection) {
        await interaction.reply({
          content: 'This selection has expired. Please run the command again.',
          flags: MessageFlags.Ephemeral
        });

        return true;
      }

      // Get the selected unit ID
      const baseId = interaction.customId.split(':')[1];

      // Toggle the selected unit
      if (selection.selectedUnits.has(baseId)) {
        selection.selectedUnits.delete(baseId);
      } else {
        selection.selectedUnits.add(baseId);
      }

      await interaction.deferUpdate();

      // Refresh the buttons
      await updateUnitButtons(
        interaction,
        selection.units,
        selection.selectedUnits
      );

      return true;
    }


    // ==========================================
    // UNIT SUBMIT BUTTON
    // ==========================================

    if (
      interaction.isButton() &&
      interaction.customId === 'rote_unit_submit'
    ) {
      const messageId = interaction.message.id;

      const selection = roteUnitSelections.get(messageId);

      if (!selection || selection.selectedUnits.size === 0) {
        await interaction.reply({
          content: 'Please select at least one unit.',
          flags: MessageFlags.Ephemeral
        });

        return true;
      }

      // Retrieve the stored selection details
      const {
        path,
        planet,
        operation,
        selectedUnits
      } = selection;

      // Convert the Set into an array
      const units = [...selectedUnits];

      await interaction.deferUpdate();

      // Retrieve the eligible players
      await showRoteOperationUnitsAllies(
        interaction,
        path,
        planet,
        operation,
        units
      );

      // Remove the stored selection once complete
      roteUnitSelections.delete(messageId);

      return true;
    }

  } catch (error) {

    console.error('ROTE interaction error:', error);

    const errorMessage = {
      content: 'Sorry, something went wrong retrieving the ROTE information.',
      components: []
    };

    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(errorMessage);
      } else {
        await interaction.reply({
          ...errorMessage,
          flags: MessageFlags.Ephemeral
        });
      }
    } catch (replyError) {
      console.error('Could not send ROTE error response:', replyError);
    }

    return true;
  }

  return false;
}


// ==========================================
// DISPLAY AVAILABLE PATHS
// ==========================================

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


// ==========================================
// DISPLAY AVAILABLE PLANETS
// ==========================================

async function showRotePlanets(interaction, path) {

  const planets = await apiRequest(
    `/rote/ops/${path}/planets`
  );

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


// ==========================================
// DISPLAY AVAILABLE OPERATIONS
// ==========================================

async function showRoteOperations(interaction, path, planet) {

  const operations = [1, 2, 3, 4, 5, 6];

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`rote_operation_select:${path}:${planet}`)
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


// ==========================================
// DISPLAY AVAILABLE UNITS AS BUTTONS
// ==========================================

async function showRoteOperationUnits(interaction, path, planet, operation) {

  const units = await apiRequest(
    `/rote/ops/${path}/${planet}/${operation}/units`
  );

  if (!units.length) {
    await interaction.editReply({
      content: 'No units were found for this operation.',
      components: []
    });

    return;
  }

  // Start with nothing selected
  const selectedUnits = new Set();

  // Update the original interaction response
  const message = await interaction.editReply({
    content: 'Which units are needed? Select as many as you need.',
    components: []
  });

  // Store everything needed for the selection
  roteUnitSelections.set(message.id, {
    units,
    selectedUnits,
    path,
    planet,
    operation
  });

  await updateUnitButtons(
    interaction,
    units,
    selectedUnits
  );
}


// ==========================================
// CREATE / UPDATE UNIT BUTTONS
// ==========================================

async function updateUnitButtons(interaction, units, selectedUnits) {

  const rows = [];

  // Create buttons in groups of five
  for (let i = 0; i < units.length; i += 5) {

    const row = new ActionRowBuilder();

    units.slice(i, i + 5).forEach(unit => {

      const baseId = String(unit.base_id);
      const selected = selectedUnits.has(baseId);

      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`rote_unit_toggle:${baseId}`)
          .setLabel(unit.character_name)
          .setStyle(
            selected
              ? ButtonStyle.Success
              : ButtonStyle.Secondary
          )
      );
    });

    rows.push(row);
  }

  // Add the Submit button
  const submitRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('rote_unit_submit')
        .setLabel(`Submit selection (${selectedUnits.size})`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(selectedUnits.size === 0)
    );

  rows.push(submitRow);

  // Edit the original response (supports ephemeral messages)
  await interaction.editReply({
    components: rows
  });
}


// ==========================================
// RETRIEVE PLAYERS WHO CAN DEPLOY THE UNITS
// ==========================================

async function showRoteOperationUnitsAllies(
  interaction,
  path,
  planet,
  operation,
  units
) {

  const params = new URLSearchParams({
    units: units.join(',')
  });

  const data = await apiRequest(
    `/rote/ops/${path}/${planet}/${operation}/units/allies?${params}`
  );

  if (!data || !data.length) {
    await interaction.editReply({
      content: 'No players were found for the selected units.',
      components: []
    });

    return;
  }

  // Group players by character
  const groupedUnits = new Map();

  data.forEach(unit => {

    if (!groupedUnits.has(unit.character_name)) {
      groupedUnits.set(unit.character_name, []);
    }

    groupedUnits.get(unit.character_name).push(unit.ally_name);
  });

  // Build the Discord message
  let message =
    `**${data[0].path} - ${data[0].planet} Operation ${data[0].operation}**\n`;

  message += 'The following units can be placed by these players:\n\n';

  for (const [character, players] of groupedUnits) {

    // Remove duplicate player names
    const uniquePlayers = [...new Set(players)];

    message += `**${character}** - ${uniquePlayers.join(', ')}\n`;
  }

  await interaction.editReply({
    content: message,
    components: []
  });
}
