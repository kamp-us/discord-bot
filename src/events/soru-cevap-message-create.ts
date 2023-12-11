import { Events, Message, ThreadChannel, bold } from "discord.js";

const isFirstMessageInSoruCevapChannel = (msg: Message, channel: ThreadChannel) => {
  return (
    channel.messageCount === 1 &&
    msg.position === 0 &&
    channel.parentId === process.env.SORU_CEVAP_CHANNEL_ID
  );
};

const messageCreateInSoruCevapChannel = {
  name: Events.MessageCreate,
  async execute(msg: Message) {
    if (msg.author.bot) return;
    // add this line if you want to restrict this to only one user which is me = can :D
    // if (msg.author.id !== "256111023939911683") return;

    const channel = msg.channel as ThreadChannel;
    if (!isFirstMessageInSoruCevapChannel(msg, channel)) return;

    const interactionButton = {
      type: 2,
      style: 1,
      label: "Okudum ve gerekli duzenlemeleri yaptim",
      customId: "read and understood",
      disabled: false,
    };

    const message = await channel.send({
      content: `## Selam ${msg.author.displayName}! Kucuk bir hatirlatma; lutfen sorunu sorarken ve sorduktan sonra su 6 maddeyi takip etmeyi unutma:
       * Sorudan once neler yaptin?
       * Ne yapmayi amacliyorsun?
       * Karsilastigin hata neydi?
       * Sordugun soru yazdigin bir kodla ilgiliyse mutlaka kod ornegi goster, hatta mumkunse github/gist linki ekle
       * Tek bir Google aramasiyla bulabilecegin sorulari sorma
       * Sorun cevaplandiktan sonra gonderi basligina **[Cozuldu]** eklemeyi unutma`,
      components: [{ type: 1, components: [interactionButton] }],
    });

    const filter = (i) => i.customId === "read and understood" && i.user.id === msg.author.id;
    const collector = message.createMessageComponentCollector({ filter });

    collector.on("collect", async (interaction) => {
      interaction.deferUpdate(); // Acknowledge the interaction

      // Disable the button
      interactionButton.disabled = true;
      // Update the message with the disabled button
      await message.edit({
        content: message.content + "\n### Okudum ve gerekli duzenlemeleri yaptim ✅",
        components: [{ type: 1, components: [interactionButton] }],
      });
    });
  },
};

export default messageCreateInSoruCevapChannel;
