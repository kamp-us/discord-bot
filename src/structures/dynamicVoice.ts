interface IChannelData {
  channelId: string;
  channelName: string;
  ownerId: string;
  createdAt?: number;
  lastActivity?: number;
}

class DynamicVoice {
  private channels: IChannelData[] = [];

  /**
   * Add a new channel to the list of channels
   * @param channel The channel data to be saved
   */
  public addChannel(channel: IChannelData) {
    this.channels.push({
      ...channel,
      createdAt: Date.now(),
    });
  }

  /**
   * Get the list of channels
   * @returns The list of channels
   */
  public getChannels() {
    return this.channels;
  }

  /**
   * Check if the user has any channels in the list
   * @param ownerId The ID of the user
   * @returns `true` if the user has at least one channel, `false` otherwise
   */
  public userHasChannels(ownerId: string) {
    return this.channels.some((channel) => channel.ownerId === ownerId);
  }

  /**
   * Check if there is a channel with the given name in the list
   * @param channelName The name of the channel
   * @returns `true` if there is a channel with the given name, `false` otherwise
   */
  public channelNameInUse(channelName: string) {
    return this.channels.some((channel) => channel.channelName === channelName);
  }

  /**
   * Get the index of the channel with the given ID in the list
   * @param channelId The ID of the channel
   * @returns The index of the channel, or -1 if it is not found
   */
  private getChannelIndex(channelId: string) {
    return this.channels.findIndex((channel) => channel.channelId === channelId);
  }

  /**
   * Remove the channel with the given ID from the list
   * @param channelId The ID of the channel to be removed
   */
  public removeChannel(channelId: string) {
    this.channels.splice(this.getChannelIndex(channelId), 1);
  }
}

export const dynamicVoice = new DynamicVoice();
