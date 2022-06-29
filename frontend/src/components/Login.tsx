import { useState } from 'react';
import { ILoginFormState } from '../interfaces';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginFormState, setLoginFormState] = useState<ILoginFormState>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormState({
      ...loginFormState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = loginFormState;
    if (!email || !password) {
      toast.error('Please provide all fields!');
      return;
    }
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        loginFormState
      );
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Success! Redirecting to chat.');
      navigate('/chat');
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div>
      <form
        className="flex flex-col gap-3 text-gray-700"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label>
            Email Adress <span className="text-red-500">*</span>{' '}
          </label>
          <input
            type="email"
            required
            name="email"
            value={loginFormState.email}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>
            Password <span className="text-red-500">*</span>{' '}
          </label>
          <div className="relative">
            <input
              required
              type={`${showPassword ? 'text' : 'password'}`}
              name="password"
              value={loginFormState.password}
              onChange={handleChange}
              className="p-2 px-3 border border-gray-300 rounded-md w-full"
            />
            <span
              className="absolute cursor-pointer p-1 top-1 right-2 bg-gray-100 text-black rounded"
              onClick={() => setShowPassword(!showPassword)}
            >
              Show
            </span>
          </div>
        </div>
        <button className="bg-custom py-2 px-3 w-full rounded-full text-white font-bold transition duration-300 hover:scale-[0.98]">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
