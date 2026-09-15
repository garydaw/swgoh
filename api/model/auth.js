import bcrypt from 'bcrypt';
import runSQL from "./database.js";
import jwt from 'jsonwebtoken';


let auth = {};

//check password
auth.checkPassword = async (username, password) => {

    //get the user data
    const this_user = await auth.login(username);
    
    //no user then cant match
    if(this_user.length != 1)
        return false;
    
    // Compare the entered password with the stored hashed password
    return await bcrypt.compare(password, this_user[0].password);
    
}

//get basic user data
auth.login = async (username) => {

    let sql = "SELECT ally_code, password, access, guild_id ";
    sql += "FROM player ";
    sql += "WHERE ally_code = ? "
    sql += "OR ally_name = ? "

    const this_user = await runSQL(sql, [username, username]);
    
    return this_user;
}

//create a jwt token and return this with the user data
auth.getAuthToken = async (username) => {

    const this_user = await auth.login(username);
    this_user[0].token = jwt.sign({ username: this_user[0].ally_code, access: this_user[0].access}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '168h' });
    return this_user[0];
}

//verify the token
auth.verifyAuthToken = async (authToken) => {

    return jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return false;
        }
        return true;
    })
}

auth.changePassword = async (username, password) => {

    const hash = await bcrypt.hash(password.toString(), 10);

    let sql = "UPDATE player ";
    sql += "SET password = ? "
    sql += "WHERE ally_code = ?"

    await runSQL(sql, [hash, username]);
    
    return;
}

auth.changeAdmin = async (username, access) => {


    let sql = "UPDATE player ";
    sql += "SET access = ? "
    sql += "WHERE ally_code = ?"

    await runSQL(sql, [access, username]);
    
    return;
}

export default auth;