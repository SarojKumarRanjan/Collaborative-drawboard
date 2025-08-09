import { useEffect } from "react";
import { socket } from "@/lib/Socket";
import roomStore from "@/store/room.store";

export const useSocketDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  drawing: boolean
) => {
  const { handleAddMoveToUser, handleRemoveMoveFromUser } =
    roomStore.getState();

  // Handle real-time drawing from other users
  useEffect(() => {
    const movesToDrawLater: Move[] = [];
    let userIdLater = "";

    const handleUserDraw = (move: Move, userId: string) => {
      if (ctx && !drawing) {
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
      if (ctx && movesToDrawLater.length > 0 && userIdLater) {
        movesToDrawLater.forEach((move) => {
          handleAddMoveToUser(userIdLater, move);
        });
      }
    };
  }, [ctx, handleAddMoveToUser, drawing]);

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
