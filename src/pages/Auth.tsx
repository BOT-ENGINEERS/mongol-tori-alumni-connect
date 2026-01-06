import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/mongol-tori-logo.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await signIn(email, password);
        if (response.error) throw new Error(response.error);
        toast({ title: "Welcome back!" });
        navigate("/");
      } else {
        const response = await signUp(email, password, fullName);
        if (response.error) throw new Error(response.error);
        toast({ title: "Account created successfully!" });
        navigate("/");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Mongol-Tori" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-black"><span className="text-foreground">MONGOL</span><span className="text-primary">-TORI</span></h1>
        </div>
        <div className="card-elevated p-8">
          <h2 className="text-xl font-bold mb-6 text-center">{isLogin ? "Welcome Back" : "Join the Network"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              required
            />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-lg">
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;