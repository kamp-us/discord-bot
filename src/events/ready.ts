const ready = {
  name: "ready",
  once: true,
  execute(client) {
    // When the client is ready, run this code (only once)
    console.log("Ready!"); // Logged in as ${client.user.tag}
  },
};

export default ready;
