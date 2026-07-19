import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const emailError = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Please enter a valid email address' : '';
  const passwordError = password && (/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) 
    ? 'Password must be lowercase and contain at least one special character' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || passwordError) {
      setError('Please fix the errors in the form before submitting.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          // Save additional user data in Firestore (fire-and-forget to prevent hanging if Firestore isn't fully set up)
          setDoc(doc(db, "users", user.uid), {
            email,
            department,
            batchNumber,
            createdAt: new Date().toISOString()
          }).catch(dbErr => console.error("Firestore error:", dbErr));
        } catch (authError) {
          // If email is already in use, attempt to just sign them in so they aren't stuck
          if (authError.code === 'auth/email-already-in-use') {
            await signInWithEmailAndPassword(auth, email, password);
          } else {
            throw authError; // Rethrow to be caught by outer catch
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Auth error:", err);
      // Display the actual error message from Firebase so the user knows what went wrong
      let errorMessage = 'Failed to create account. Please try again.';
      if (err && err.message) {
        // Clean up the firebase error prefix if it exists
        errorMessage = err.message.replace('Firebase: ', '');
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">CampusOne</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
            One Campus. <br/>
            One Platform. <br/>
            <span className="text-primary-600">Infinite Possibilities.</span>
          </h1>
          <p className="text-lg text-gray-600">
            CampusOne centralizes every student service into one AI-powered platform.
          </p>
        </div>

        <div className="relative z-10">
          <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm inline-block">
            <p className="font-medium text-gray-900 mb-1">"The AI assistant is a lifesaver!"</p>
            <p className="text-sm text-gray-500">— Sarah, Computer Science</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center space-x-2 mb-10">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">CampusOne</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isRegistering ? 'Activate Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500">
              {isRegistering ? 'Register as a new student.' : 'Sign in to access your student dashboard.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl text-danger-500 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Email or Roll Number"
              id="email"
              type="email"
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              required
            />
            
            <div className="space-y-1 relative">
              <InputField
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                required
              />
              <button
                type="button"
                className={`absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none ${passwordError ? 'top-9' : 'top-9'}`}
                style={{ top: '36px' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              
              {!isRegistering && (
                <div className="flex justify-between items-center pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4" />
                    <span className="text-sm text-gray-600 select-none">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </a>
                </div>
              )}
            </div>

            {isRegistering && (
              <>
                <InputField
                  label="Department"
                  id="department"
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
                <InputField
                  label="Batch Number"
                  id="batchNumber"
                  type="text"
                  placeholder="e.g. 278117"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  required
                />
              </>
            )}

            <Button type="submit" className="w-full py-3" size="large" isLoading={isLoading}>
              {isRegistering ? 'Activate' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {isRegistering ? (
                <>Already have an account? <button onClick={() => setIsRegistering(false)} className="font-medium text-primary-600 hover:text-primary-700">Sign In</button></>
              ) : (
                <>New student? <button onClick={() => setIsRegistering(true)} className="font-medium text-primary-600 hover:text-primary-700">Activate your account</button></>
              )}
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
