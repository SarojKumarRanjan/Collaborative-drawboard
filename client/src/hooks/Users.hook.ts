import { useEffect } from 'react';
import {socket} from "@/lib/Socket"
import roomStore from '@/store/room.store';





export const useInitUser = () => {

const {setRoomUsers,handleAddMoveToUser,handleSetMovesWithoutUser,removeRoomUser } = roomStore.getState();



  
  useEffect(() => {
 
    socket.on("room",(room,usersToParse) => {
      // set the user and moves to the room store
      const users = new Map<string, Move[]>(JSON.parse(usersToParse) );
        if(users) {
          users.forEach((moves, userId) => {
            setRoomUsers(userId);
            moves.forEach((move) => {
              handleAddMoveToUser(userId, move);
            });
          });
        }
      // now set the mvoes without user
      if (room.drawed) {
        handleSetMovesWithoutUser(room.drawed);
      }
        
    });


    socket.on("new_user", (userId) => {
      setRoomUsers(userId);
    });

    socket.on("user_disconnected", (userId) => {
      removeRoomUser(userId);
    });


    return () => {
      socket.off("room");
      socket.off("new_user");
      socket.off("user_disconnected");
    };

  }, [handleAddMoveToUser, handleSetMovesWithoutUser, removeRoomUser, setRoomUsers]);
}
