# Conflicts-ahead

### Server Implementation
Currently there are two possible ways I can think of how to use this product:

1. We will have an `Heroku` server up and running that will serve users from 
different locations.
    > 1. the server should have login mechanism for every group
    > 2. the server will show all of team repos
    > 3. for each team repo we'll be able to see user list which contains user data

    API:
    * /repos - return list of all available repos
    * /users/:repoName - return list of user objects associated to the repo
    

2. Every team will install the hub-server on a local machine, and every user
will connect to it.

### App Logic
#### server first
1. server up
2. user connects
3. user send data to server
4. user data saved in server's memory