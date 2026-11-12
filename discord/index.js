
import 'dotenv/config';
import {
  Client,
  Events,
  GatewayIntentBits
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
