import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-0)', color: 'var(--fg)' }}>
      <img
        src="/umbrella.png" // Replace this with the correct path to your umbrella image
        alt="umbrella"
        className="w-24 h-24 mb-8"
      />
      <h1 className="text-4xl font-bold">Breeze</h1>
      <p className="text-lg" style={{ color: 'var(--gray)' }}>Weather App</p>

      <button
        onClick={() => navigate("/")}
        className="mt-16 p-4 rounded-full transition"
        style={{ backgroundColor: 'var(--blue)', color: 'var(--bg-0)' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--aqua)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue)'}
      >
        <FaArrowRight size={20} />
      </button>
    </div>
  );
}

export default WelcomeScreen;
