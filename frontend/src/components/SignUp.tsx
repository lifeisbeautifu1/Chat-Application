import { useState } from 'react';
import { ISignUpFormState } from '../interfaces';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [loginFormState, setLoginFormState] = useState<ISignUpFormState>({
    name: '',
    email: '',
    password: '',
    image: '',
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
    const { name, email, password } = loginFormState;
    if (!name || !email || !password) {
      toast.error('Please provide all fields!');
    }
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/signup',
        loginFormState
      );
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Success! Redirecting to chat.');
      navigate('/chat');
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const postDetails = (pics: File) => {
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'dxf7urmsh');
      fetch('https://api.cloudinary.com/v1_1/dxf7urmsh/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setLoginFormState({
            ...loginFormState,
            image: data.url.toString(),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
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
            Name <span className="text-red-500">*</span>{' '}
          </label>
          <input
            type="text"
            required
            name="name"
            value={loginFormState.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
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
        <div className="flex flex-col gap-2">
          <label>Upload your picture </label>
          <input
            className="p-2 px-3 border border-gray-300 rounded-md w-full"
            type="file"
            name="image"
            accept="image/*"
            //@ts-ignore
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </div>
        <button className="bg-custom py-2 px-3 w-full rounded-full text-white font-bold transition duration-300 hover:scale-[0.98]">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
