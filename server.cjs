const http = require('http');

let users = [
  { id: 1, name: 'Alex Rivera', email: 'alex.rivera@adminhub.com', role: 'admin', is_active: true, created_at: '2026-01-15T08:30:00Z' },
  { id: 2, name: 'Sofia Chen', email: 'sofia.chen@adminhub.com', role: 'admin', is_active: true, created_at: '2026-02-10T14:15:00Z' },
  { id: 3, name: 'Marcus Miller', email: 'marcus.miller@example.com', role: 'user', is_active: true, created_at: '2026-03-22T09:45:00Z' },
  { id: 4, name: 'Elena Rostova', email: 'elena.rostova@example.com', role: 'user', is_active: false, created_at: '2026-04-05T11:20:00Z' },
  { id: 5, name: 'David Kim', email: 'david.kim@example.com', role: 'user', is_active: true, created_at: '2026-05-12T16:00:00Z' },
  { id: 6, name: 'Amara Diallo', email: 'amara.diallo@example.com', role: 'user', is_active: false, created_at: '2026-05-30T10:10:00Z' },
  { id: 7, name: 'Liam O Connor', email: 'liam.oconnor@example.com', role: 'user', is_active: true, created_at: '2026-06-01T13:40:00Z' }
];

let nextId = 8;

function getStats() {
  const total = users.length;
  const active = users.filter(u => u.is_active).length;
  const inactive = total - active;
  const admins = users.filter(u => u.role === 'admin').length;
  return {
    total_users: total,
    active_users: active,
    inactive_users: inactive,
    admins: admins
  };
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // GET /stats
  if (path === '/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getStats()));
    return;
  }

  // GET /users
  if (path === '/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    return;
  }

  // POST /users
  if (path === '/users' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.name || !data.email || !data.role) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Name, email, and role are required.' }));
          return;
        }
        const newUser = {
          id: nextId++,
          name: data.name,
          email: data.email,
          role: data.role || 'user',
          is_active: data.is_active !== undefined ? data.is_active : true,
          created_at: new Date().toISOString()
        };
        users.push(newUser);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body.' }));
      }
    });
    return;
  }

  // GET /users/{id}, PUT /users/{id}, DELETE /users/{id}
  const userMatch = path.match(/^\/users\/(\d+)$/);
  if (userMatch) {
    const id = parseInt(userMatch[1], 10);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `User with ID ${id} not found.` }));
      return;
    }

    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users[userIndex]));
      return;
    }

    if (req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const user = users[userIndex];
          if (data.name !== undefined) user.name = data.name;
          if (data.email !== undefined) user.email = data.email;
          if (data.role !== undefined) user.role = data.role;
          if (data.is_active !== undefined) user.is_active = data.is_active;
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(user));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON body.' }));
        }
      });
      return;
    }

    if (req.method === 'DELETE') {
      const deletedUser = users.splice(userIndex, 1)[0];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(deletedUser));
      return;
    }
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found.' }));
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Mock API Server is running on http://localhost:${PORT}`);
});
