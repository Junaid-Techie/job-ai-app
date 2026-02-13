export default function Login() {
  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-gray-900 border border-gray-700"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-gray-900 border border-gray-700"
        />

        <button className="w-full bg-white text-black py-3 rounded-lg">
          Sign In
        </button>
      </div>
    </div>
  );
}
