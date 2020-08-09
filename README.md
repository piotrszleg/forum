# Forum
Simple forum supporting nested replies and simple text formatting.

Links in text are turned into html links and images and youtube videos are embedded automatically.

Used as an exercise to learn MySQL and nodejs.

# Installation
Install mysql and nodejs.

Open `cmd` or unix terminal.

Type in:

`mysqld`

Open second terminal window, navigate to this folder and type in:
`mysql -u "user" -p "password" < init.sql`

Replace `mysql` and `mysqld` with paths to these programs on your computer if they are not in your PATH variable.

Replace `user` and `password` with your database's user and password.

In `server.js` replace host, user and password values with the correct values for your environment. 

Type in: 

`npm init`

and then:

`node main.js`

Open the printed url in your browser and check if it displays the webpage.

Replace `npm` and `node`  with paths to these programs on your computer if they are not in your PATH variable.
