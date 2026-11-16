
import 'dotenv/config';

import {
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags
} from 'discord.js';

import { handleGeneralInteraction } from './handlers/general.js';
import { handleRoteInteraction } from './handlers/rote.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, readyClient => {
  console.log(`BB-VIP is online as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {

  try {

    // General interactions
    if (await handleGeneralInteraction(interaction)) {
      return;
    }

    // RotE interactions
    if (await handleRoteInteraction(interaction)) {
      return;
    }

  } catch (error) {
    console.error('Interaction error:', error);

    const response = {
      content: 'Something went wrong. Please try again later.',
      flags: MessageFlags.Ephemeral
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(response);
    } else {
      await interaction.reply(response);
    }
  }

});

client.login(process.env.DISCORD_TOKEN);
