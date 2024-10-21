import { Message } from "discord.js";
import { users, servers } from "../util/model";
import { generateError } from "./embed";

export async function adminCommands(message: Message) {
  if (message.author.id !== process.env.OWNER_ID) return;
  if (message.content.toLowerCase().startsWith("updatecd")) {
    if (message.mentions.users.size === 1) {
      const user = await users.findById(message.mentions.users.first().id);
      if (!user)
        return await message.channel.send({
          embeds: [generateError("User in not database")],
        });

      await users.updateOne(
        { _id: message.mentions.users.first().id },
        {
          cooldown:
            parseFloat(message.cleanContent.replace(/[^0-9.]/g, "")) * 60000,
        }
      );

      return await message.channel.send({ content: "User updated" });
    } else {
      const guild = await servers.findById(message.guild.id);
      if (!guild) return generateError("Guild not in database");

      await servers.updateOne(
        { _id: message.guild.id },
        {
          cooldown:
            parseFloat(message.cleanContent.replace(/[^0-9.]/g, "")) * 60000,
        }
      );

      return await message.channel.send({ content: "Guild updated" });
    }
  }

  if (
    message.content.toLowerCase().startsWith("updatect") &&
    message.mentions.users.size === 1
  ) {
    const user = await users.findById(message.mentions.users.first().id);
    if (!user) return generateError("User not in database");

    const creditMatch = message.cleanContent.match(/-?[0-9]\d*(\.\d+)?/);

    if (creditMatch) {
      const credit = parseFloat(creditMatch[0]);
      await users.updateOne(
        { _id: message.mentions.users.first().id },
        { credit }
      );

      await message.channel.send({ content: "Credit for user updated" });
    }
  }
}
