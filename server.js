const { response } = require("express");
const express = require("express");
const { as } = require("pg-promise");
const pgp = require("pg-promise")();
const db = pgp("postgres://hyeeumfv:1YwH3PINc4cZLU1YqnL2Lix1AtNwci7s@queenie.db.elephantsql.com:5432/hyeeumfv");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded());

// returns users
app.get('/users', async (req, res) => {
  const users = await db.any("SELECT * FROM users").then((users) => {
    return users;
  })
  res.send(users);
})

// returns comments
app.get('/comments', async (req, res) => {
  const comments = await db.any("SELECT * FROM comments").then((comments) => {
    return comments;
  })
  res.send(comments);
})

// find single user
app.get('/users/:id', async (req, res) => {
  const id = req.params.id;
  const oneUser = await db.one(`SELECT * FROM users WHERE id = ${id}`).then((oneUser) => {
    return oneUser
  })
  res.send(oneUser);
});

// create user 
app.post('/users', async (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  await db.none(`insert into users (name, email) values ($1, $2);`, [name, email]);
  res.send('user created')
})

// create comment
app.post('/comments', async (req, res) => {
  console.log(req.body);
  const comment = req.body.comment;
  const post_id = req.body.post_id;
  const user_id = req.body.user_id;
  await db.none(`insert into comments (comment, post_id, user_id) values ($1, $2, $3)`, [
    comment,
    post_id,
    user_id
  ]);
  res.send('comment created')
})

// update user
app.put('/users', async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const email = req.body.email;
  await db.none(`update users set name = $1, email = $2 where id = $3`, [name, email, id]);
  res.send('user updated')
})

// update comment
app.put('/comments', async (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const comment = req.body.comment;
  const post_id = req.body.post_id;
  const user_id = req.body.user_id;
  await db.none(`update comments set comment = $1, post_id = $2, user_id = $3 where id = $4`, [comment, post_id, user_id, id]);
  res.send('Comment updated')
})

// retrieve user's comments
app.get('/comments/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  const userComments = await db.any(`SELECT comment FROM comments WHERE user_id = ${user_id}`).then((userComments) =>{
    return userComments;
  });
  res.send(userComments);
})

app.listen(PORT, () => {
  console.log(`LikeyPix API is running on port ${PORT}`);
});
