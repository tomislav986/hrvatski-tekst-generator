
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dobrodošli u Radne naloge</h1>
        <p className="text-xl text-gray-600 mb-8">Prijavite se za pristup vašim radnim nalozima</p>
        <Button 
          onClick={handleLogin}
          className="bg-gray-700 hover:bg-gray-800 text-white"
        >
          Prijavi se
        </Button>
      </div>
    </div>
  );
};

export default Index;
