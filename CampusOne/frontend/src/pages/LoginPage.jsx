import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (!name || !department || !batch) {
          setError('Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        if (!/^\d{6}$/.test(batch)) {
          setError('Batch number must be exactly 6 digits long.');
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
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
              {isSignUp ? 'Activate Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500">
              {isSignUp ? 'Create a new student account to access the platform.' : 'Sign in to access your student dashboard.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl text-danger-500 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {isSignUp && (
              <>
                <InputField
                  label="Full Name"
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Department"
                    id="department"
                    type="text"
                    placeholder="e.g. CSE, AI&DS"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required={isSignUp}
                  />
                  <InputField
                    label="Batch Number"
                    id="batch"
                    type="text"
                    placeholder="123456"
                    value={batch}
                    maxLength={6}
                    onChange={(e) => setBatch(e.target.value.replace(/\D/g, ''))}
                    required={isSignUp}
                  />
                </div>
              </>
            )}

            <InputField
              label={isSignUp ? "Email Address" : "Email or Roll Number"}
              id="email"
              type="email"
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="space-y-1">
              <InputField
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4" />
                  <span className="text-sm text-gray-600 select-none">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full py-3" size="large" isLoading={isLoading}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {isSignUp ? 'Already have an account? ' : 'New student? '}
              <button 
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }} 
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                {isSignUp ? 'Sign in instead' : 'Activate your account'}
              </button>
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
