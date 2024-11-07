const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 3000;

// MySQL connection
const pool = mysql.createPool({
  host: "database-2.cf00csegghpu.us-east-1.rds.amazonaws.com",
  user: "root",
  password: "pass1234",
  database: "userdb",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware to parse JSON request bodies
app.use(express.json());

// CREATE user
app.post('/users', async (req, res) =>
{
  try
  {
    const { username, age } = req.body;
    const [result] = await pool.query('INSERT INTO users (username, age) VALUES (?, ?)', [username, age]);
    res.status(201).json({ message:"Hey i just made a change" });
  } catch (err)
  {
    console.error(err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// READ users
app.get('/users', async (req, res) =>
{
  try
  {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err)
  {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// UPDATE user
app.put('/users/:id', async (req, res) =>
{
  try
  {
    const { id } = req.params;
    const { username, age } = req.body;
    const [result] = await pool.query('UPDATE users SET username = ?, age = ? WHERE id = ?', [username, age, id]);
    if (result.affectedRows === 0)
    {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id, username, age });
  } catch (err)
  {
    console.error(err);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// DELETE user
app.delete('/users/:id', async (req, res) =>
{
  try
  {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0)
    {
      return res.status(404).json({ error: 'User not found' });
    }
    res.sendStatus(204);
  } catch (err)
  {
    console.error(err);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

app.listen(port, () =>
{
  console.log(`Server running on http://localhost:${port}`);
});
