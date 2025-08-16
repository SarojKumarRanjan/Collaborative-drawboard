import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from "flowbite-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "@/lib/Socket";
import roomStore from '@/store/room.store';
import { HiPlus, HiLogin, HiUserGroup, HiClipboardCopy, HiCheck } from "react-icons/hi";


const randomFourLetterString = () => {
    return Math.random().toString(36).substring(2, 6);
}

const CollaborateModal = ({ trigger, handleClose }: { trigger: boolean; handleClose: () => void; }) => {
    const { roomid } = useParams<{ roomid?: string }>();
    const navigate = useNavigate();
    const setRoomId = roomStore((state) => state.setRoomId);

    const [joinRoomId, setJoinRoomId] = useState<string>("");
    const [createUsername, setCreateUsername] = useState<string>("");
    const [joinUsername, setJoinUsername] = useState<string>("");
    const [currentRoomId, setCurrentRoomId] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        if (roomid) {
            setCurrentRoomId(roomid);
        }
    }, [roomid]);

    useEffect(() => {
        const handleCreate = (roomIdFromServer: string) => {
            setRoomId(roomIdFromServer);
            setCurrentRoomId(roomIdFromServer);
            navigate(`/${roomIdFromServer}`);
            setIsCreating(false);
            handleClose();
            
        }

        const handleJoined = (roomIdFromServer: string, failed: boolean) => {
            if (failed) {
                alert("Failed to join room - Room may not exist or is full");
                setIsJoining(false);
                return;
            }
            setRoomId(roomIdFromServer);
            setCurrentRoomId(roomIdFromServer);
            navigate(`/${roomIdFromServer}`);
            setIsJoining(false);
            handleClose();
            
        }

        socket.on("created", handleCreate);
        socket.on("joined", handleJoined);

        return () => {
            socket.off("created", handleCreate);
            socket.off("joined", handleJoined);
        }
    }, [navigate, setRoomId, handleClose]);

    const handleCreateRoom = () => {
        setIsCreating(true);
        const username = createUsername.trim() || `User_${randomFourLetterString()}`;
        socket.emit("create_room", randomFourLetterString(), username);
    }

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinRoomId.trim()) {
            alert("Please enter a room ID");
            return;
        }
        setIsJoining(true);
        const username = joinUsername.trim() || `User_${randomFourLetterString()}`;
        socket.emit("join_room", joinRoomId.trim(), username);
    }

    const copyRoomId = async () => {
        if (currentRoomId) {
            try {
                await navigator.clipboard.writeText(currentRoomId);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy room ID:', err);
            }
        }
    }

    const shareRoom = () => {
        if (navigator.share && currentRoomId) {
            navigator.share({
                title: 'Join my collaborative canvas',
                text: `Join me on this collaborative canvas! Room ID: ${currentRoomId}`,
                url: window.location.href,
            });
        } else {
            copyRoomId();
        }
    }

    return (
        <Modal size="2xl" show={trigger} onClose={handleClose} className="backdrop-blur-sm">
            <ModalHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 py-3">
                <div className="flex items-center gap-2">
                    <HiUserGroup className="text-lg text-blue-600" />
                    <span className="text-lg font-semibold text-gray-800">Collaborate</span>
                </div>
            </ModalHeader>
            
            <ModalBody className="bg-gray-50 p-4">
                <div className="space-y-5">
                    {/* Current Room Section */}
                    {currentRoomId && (
                        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                                    <HiUserGroup className="text-xs text-blue-600" />
                                    Current Room
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                                <span className="text-xs font-medium text-gray-600">ID:</span>
                                <code className="bg-white px-2 py-1 rounded text-xs text-blue-600 font-mono font-semibold">
                                    {currentRoomId}
                                </code>
                                <Button
                                    size="xs"
                                    color="light"
                                    onClick={copyRoomId}
                                    className="ml-auto"
                                >
                                    {copied ? <HiCheck className="text-green-500 text-xs" /> : <HiClipboardCopy className="text-xs" />}
                                    <span className="ml-1 text-xs">{copied ? 'Copied!' : 'Copy'}</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Create Room Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1">
                                <HiPlus className="text-xs text-green-600" />
                                Create Room
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <TextInput
                                        id="create-username"
                                        type="text"
                                        placeholder="Username (optional)"
                                        value={createUsername}
                                        onChange={(e) => setCreateUsername(e.target.value)}
                                        className="w-full"
                                        sizing="sm"
                                    />
                                </div>
                                <Button
                                    
                                    onClick={handleCreateRoom}
                                    disabled={isCreating}
                                    className="w-full"
                                    size="sm"
                                >
                                    <HiPlus className="mr-1 text-xs" />
                                    <span className="text-xs">{isCreating ? 'Creating...' : 'Create'}</span>
                                </Button>
                            </div>
                        </div>

                        {/* Join Room Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1">
                                <HiLogin className="text-xs text-blue-600" />
                                Join Room
                            </h3>
                            <form onSubmit={handleJoinRoom} className="space-y-3">
                                <div>
                                    <TextInput
                                        id="room-id"
                                        type="text"
                                        placeholder="Room ID"
                                        value={joinRoomId}
                                        onChange={(e) => setJoinRoomId(e.target.value)}
                                        required
                                        className="w-full"
                                        sizing="sm"
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        id="join-username"
                                        type="text"
                                        placeholder="Username (optional)"
                                        value={joinUsername}
                                        onChange={(e) => setJoinUsername(e.target.value)}
                                        className="w-full"
                                        sizing="sm"
                                    />
                                </div>
                                <Button
                                    
                                    type="submit"
                                    disabled={isJoining}
                                    className="w-full"
                                    size="sm"
                                >
                                    <HiLogin className="mr-1 text-xs" />
                                    <span className="text-xs">{isJoining ? 'Joining...' : 'Join'}</span>
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </ModalBody>
            
            <ModalFooter className="bg-gray-50 border-t border-gray-200 py-2">
                <div className="flex justify-between items-center w-full">
                    <Button color="gray" onClick={handleClose} size="sm">
                        Cancel
                    </Button>
                    {currentRoomId && (
                        <Button  onClick={shareRoom} size="sm">
                            <HiUserGroup className="mr-1 text-xs" />
                            <span className="text-xs">Invite</span>
                        </Button>
                    )}
                </div>
            </ModalFooter>
        </Modal>
    );
};

export default CollaborateModal;