
import 'dotenv/config';
import {
  ActionRowBuilder,
  Client,
  Events,
  GatewayIntentBits,
  StringSelectMenuBuilder
} from 'discord.js';


const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, readyClient => {
  console.log(`BB-VIP blah is online as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong! 🏓');
    }

    if (interaction.commandName === 'getguildgp') {
      await interaction.reply('Guild GP coming soon');
    }

    if (interaction.commandName === 'rotekeyunits') {
      
      await interaction.deferReply();

      try {
        const apiUrl = `${process.env.API_BASE_URL}/rote/ops`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${process.env.DISCORD_API_SECRET}`
          }
        });

        if (!response.ok) {
          throw new Error(data.message || `API returned ${response.status}`);
        }

        const territories = await response.json();

        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId('territory_select')
          .setPlaceholder('Select a territory')
          .addOptions(
            territories.map(territory => ({
              label: territory.charAt(0).toUpperCase() + territory.slice(1),
              value: territory
            }))
          );

        const row = new ActionRowBuilder()
          .addComponents(selectMenu);

        await interaction.editReply({
          content: 'Which territory would you like?',
          components: [row]
        });

      } catch (error) {
        console.error('rote ops error:', error);

        await interaction.editReply(
          'Sorry, I couldn\'t retrieve the territory information.'
        );
      }

    }
  } catch (error) {
    console.error('Command error:', error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'Something went wrong.',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: 'Something went wrong.',
        ephemeral: true
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
