import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/mongol-tori-logo.png";
import { Users, GraduationCap } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"student" | "alumni">("student");
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
        const response = await signUp(email, password, fullName, userType);
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
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />
                
                {/* User Type Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserType("student")}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        userType === "student"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <GraduationCap size={20} className={userType === "student" ? "text-primary" : "text-muted-foreground"} />
                      <span className="text-sm font-semibold">Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType("alumni")}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        userType === "alumni"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Users size={20} className={userType === "alumni" ? "text-primary" : "text-muted-foreground"} />
                      <span className="text-sm font-semibold">Alumni</span>
                    </button>
                  </div>
                </div>
              </>
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