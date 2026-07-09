const http = require('http');

const data = JSON.stringify({
  firstName: "Avinash",
  lastName: "Thakur",
  phone: "+91 9876543210",
  nationality: "Indian",
  preferredLanguage: "English",
  meetingPreferredDate: "2026-07-15",
  meetingPreferredTime: "Evening",
  meetingPreferredLanguage: "English",
  meetingNotes: "I want to know about Digital Nomad Visa process and requirements."
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/leads/238886b6-3632-4fa3-b6e6-27413cca393c/meeting-preference',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
