const usersList = [];

const getUsers = () => {
    return usersList;
 }


const addUsers = (id,username,room) => {
    username = username.trim();
    room = room.trim();
    userID = id;

    usersList.push({userID,username,room});
 }

 const removeUsers = (userID) => {
   const removeIndex = usersList.findIndex((item)=>item.userID == userID);
   usersList.splice(removeIndex,1);
 }

 const getUsersByRoom = (room) => {
   const user = usersList.filter((item) => item.room === room );
   return user;
 }


 module.exports = {getUsers, addUsers, removeUsers, getUsersByRoom}
