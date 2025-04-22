import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center text-white p-4">
      <img
        src="/umbrella.png" // Replace this with the correct path to your umbrella image
        alt="umbrella"
        className="w-24 h-24 mb-8"
      />
      <h1 className="text-4xl font-bold">Breeze</h1>
      <p className="text-lg text-gray-400">Weather App</p>

      <button
        onClick={() => navigate("/")}
        className="mt-16 bg-blue-500 hover:bg-blue-600 p-4 rounded-full transition"
      >
        <FaArrowRight size={20} />
      </button>
    </div>
  );
}

export default WelcomeScreen;
