import { useEffect } from "react";
import { socket } from "@/lib/Socket";
import roomStore from "@/store/room.store";

export const useSocketDraw = (
 
  drawing: boolean
) => {
  const { handleAddMoveToUser, handleRemoveMoveFromUser } =
    roomStore((state)=> (state));

  // Handle real-time drawing from other users
  useEffect(() => {
    const movesToDrawLater: Move[] = [];
    let userIdLater = "";

    const handleUserDraw = (move: Move, userId: string) => {
      if ( !drawing) {
        handleAddMoveToUser(userId, move);
      } else {
        // Queue moves to draw later
        movesToDrawLater.push(move);
        userIdLater = userId;
      }
    };

    socket.on("user_draw", handleUserDraw);

    return () => {
      socket.off("user_draw", handleUserDraw);

      // Draw queued moves on cleanup
      if (movesToDrawLater.length > 0 && userIdLater) {
        movesToDrawLater.forEach((move) => {
          handleAddMoveToUser(userIdLater, move);
        });
      }
    };
  }, [handleAddMoveToUser, drawing]);

  // Handle undo from other users
  useEffect(() => {
    const handleUserUndo = (userId: string) => {
      handleRemoveMoveFromUser(userId);
    };

    socket.on("user_undo", handleUserUndo);

    return () => {
      socket.off("user_undo", handleUserUndo);
    };
  }, [handleRemoveMoveFromUser]);
};
