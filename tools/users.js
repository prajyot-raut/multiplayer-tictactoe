class User {
    constructor() {
        this.users = [];
    }

    createUser(user, id, room, isFirstPlayer) {
        this.users.push({user: user, id: id, room: room, isFirstPlayer: isFirstPlayer});
        console.log("Added");
    }

    getUserById(id) {
        let user = this.users.filter(user => {return user.id === id});

        if(user.length === 0) {
            return "User not found";
        }
        return user[0];
    }

    deleteUser(id) {
        let listWithRemovedUser = this.users.filter(user => {return user.id !== id});
        this.users = listWithRemovedUser;
    }

    isRoomFull(room) {
        let foundUserInRoom = this.users.filter(user => user.room === room);

        if(foundUserInRoom.length === 2) {
            return true;
        }
        return false;
    }

    isRoomEmpty(room) {
        let foundUserInRoom = this.users.filter(user => user.room === room);

        if(foundUserInRoom.length === 0) {
            return true;
        }
        return false;
    }
}

module.exports = User;