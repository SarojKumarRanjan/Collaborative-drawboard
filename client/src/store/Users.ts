import { create } from 'zustand';
import {socket} from "@/lib/Socket"


type Users = {
  [userId: string]: Move[]
};

/*

Move = {
path: [number, number][];
options: {
  lineWidth: number;
  lineColor: string;  
}

}

*/

interface UsersStore {
  users: Users;
  userIds: () => string[];
  setUser: (userId: string, moves:Move[]) => void;
  addUser: (userId:string) => void;
  removeUser: (userId:string) => void;
  initializeSocketListeners: () => () => void;
}

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: {},
  userIds: () => Object.keys(get().users),
  setUser: (userId: string, moves:Move[]) => 
    set((state) => ({
      users: {
        ...state.users,
        [userId]: moves
      }
    })),
  addUser: (userId) => {
    if(!(userId in get().users) ){
        set((state) => ({
            users: {...state.users,[userId]:[]}
        }))
    }
  },
  removeUser:(userId) => {
    set((state) => {
     const newUsers = {...state.users};
     delete newUsers[userId];
     return {users : newUsers}

    })
  },

   initializeSocketListeners: () => {
    const handleNewUsers = (newUsers: string[]) => {
      newUsers.forEach(user => {
        if (user !== socket.id) get().addUser(user);
      });
    };

    const handleDisconnect = (userId: string) => {
      get().removeUser(userId);
    };

    socket.on("user_in_room", handleNewUsers);
    socket.on("user_disconnected", handleDisconnect);

    
    return () => {
      socket.off("user_in_room", handleNewUsers);
      socket.off("user_disconnected", handleDisconnect);
    };
  }
}));


export const useUserIds = (): string[] => useUsersStore(state => state.userIds());
export const useUsers = (): Users => useUsersStore(state => state.users);
export const useSetUser = (): UsersStore['setUser'] => useUsersStore(state => state.setUser);