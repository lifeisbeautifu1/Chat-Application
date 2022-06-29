import { useState } from 'react';
import { Login, SignUp } from '../components';

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="lg:w-2/5 md:w-3/5 w-4/5 m-auto flex flex-col gap-8 h-full">
      <div
        className="flex justify-center items-center bg-white rounded shadow p-4
      text-5xl font-[900]  mt-20"
      >
        <h1 className="logo">Talk-A-Tive</h1>
      </div>
      <div className="bg-white rounded shadow py-4 px-8 flex flex-col gap-4">
        <div className="flex gap-4">
          <button
            className={`w-full py-2 px-3 rounded-full  font-semibold ${
              isLogin ? 'bg-custom text-white' : ''
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-full  py-2 px-3 rounded-full  font-semibold ${
              !isLogin ? 'bg-custom text-white' : ''
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        {isLogin && <Login />}
        {!isLogin && <SignUp />}
      </div>
    </div>
  );
};

export default Home;
