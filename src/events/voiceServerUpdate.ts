import { dynamicVoice } from "../structures/dynamicVoice";

const voiceStateUpdate = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    // Return if not in the specified guild
    if (newState.guild.id !== "1000463095795302460") return;

    try {
      // Fetch channels in the guild
      const channels = await newState.guild.channels.fetch();

      // Iterate through channels
      channels.some((channel) => {
        // Skip channels that are not in the specified parent (category) channel
        if (channel.parentId !== "1056239859020333066") return;

        // Get the number of mmembers in the channel
        const memberCount = [...channel.members].length;

        // If there are no members in the channel, remove it and delete it.
        if (memberCount < 1) {
          dynamicVoice.removeChannel(channel.id);
          channel.delete();
        }
      });
    } catch (e) {
      // Log any errors that occur
      console.log("ERROR", e);
    }
  },
};

export default voiceStateUpdate;
