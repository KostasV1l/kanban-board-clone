// Temporary Form (not connected to API)
export const LoginForm = () => {
    return (
        <form className="flex flex-col gap-4 p-10 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold">Login</h1>
            <input type="text" placeholder="Username" className="border border-gray-300 p-2 rounded" />
            <input type="password" placeholder="Password" className="border border-gray-300 p-2 rounded" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Login
            </button>
        </form>
    );
};
