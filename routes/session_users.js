const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM session_users;`)
      .then(data => {
        const session_users = data.rows;
        res.json({ session_users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // ADD A NEW SESSION USER
  router.post("/", (req, res) => {

    let { user_id, session_id } = req.body;

    const query_string = `
    INSERT INTO session_users (session_id, user_id)
    VALUES ($1, $2);
    `
    db.query(query_string, [session_id, user_id])
      .then( data => {
        res.status(201).send("Success");
        console.log("Inserted session_users record");
      })
      .catch( err => {
        res.status(500).send("Failure");
        console.log("Error inserting session_users record");
      })
  });

  // CHANGE STATE TO CANCELLED AND CANCEL SESSION IF USER IS LAST PENDING USER IN SESSION
  router.put("/cancel", (req, res) => {

    let { user_id, session_id } = req.body;
    let cancelSession = false;

    const query_string1 = `
    UPDATE session_users
    SET state = 'canceled'
    WHERE session_id = $1 
    AND user_id = $2;
    `

    const query_string2 = `
    SELECT CASE
      WHEN COUNT(session_users.*) > 0 THEN FALSE
      WHEN COUNT(session_users.*) = 0 THEN TRUE
    END AS cancel_session FROM sessions
    JOIN session_users ON session_users.session_id = sessions.id
    WHERE session_users.session_id = $1
    AND sessions.state = 'pending'
    AND session_users.state = 'pending';
    `

    const query_string3 = `
    UPDATE sessions
    SET state = 'canceled'
    WHERE sessions.id = $1;    
    `

    db.query(query_string1, [session_id, user_id])
      .then( data => {
        console.log("Change session_user state to canceled");
        db.query(query_string2, [session_id])
        .then( data => {
          cancelSession = data.rows[0].cancel_session;
          console.log("Checking whether to the session should be cancelled:", cancelSession);
          if (!cancelSession) {
            res.status(201).send("Success");
          }
          else db.query(query_string3, [session_id])
          .then ( data => {
            console.log("Cancelled session");
            res.status(201).send("Success");
          })
          .catch( err => {
            res.status(500).send("Failure");
            console.log("Error cancelling session");
          })
        .catch( err => {
          res.status(500).send("Failure");
          console.log("Error checking whether session should be cancelled");
        });
      })
      .catch( err => {
        res.status(500).send("Failure");
        console.log("Error cancelling session_users record");
      })
    });
  });

  return router;
};
