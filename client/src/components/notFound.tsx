import { useModalStore } from "@/store/Modal.store";


const NotFound = ({id}:{id:string}) => {
  const { closeModal } = useModalStore();

  return (
    <div className=" relative flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-lg mb-8">The room with id {id} does not exist. Please try again.</p>
      <button
        onClick={closeModal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
}

export default NotFound;