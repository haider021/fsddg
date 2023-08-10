const { readdirSync } = require('fs');
const ascii = require('ascii-table');

let table = new ascii('Events');
table.setHeading('Event Name', 'Loaded Status');

module.exports = (client1) => {
  const events = readdirSync('./events/').filter((file) => file.endsWith('.js'));
  for (const file of events) {
    try {
      let pull = require(`../events/${file}`);
      if (pull.event && typeof pull.event !== 'string') {
        table.addRow(file, '❌');
        continue;
      }
      pull.event = pull.event || file.replace('.js', '');
      if (typeof pull.run !== 'function') {
        table.addRow(file, '❌');
        continue;
      }
      client1.on(pull.event, pull.run.bind(null, client1));
      table.addRow(file, '✔');
    } catch (error) {
      console.error(`Error loading event '${file}':`, error);
      table.addRow(file, '❌');
    }
  }
};
