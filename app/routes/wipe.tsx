import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <main className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-600 min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h1 className="text-2xl font-bold text-white mb-4">Developer Tools</h1>
                    <p className="text-neutral-200 mb-6">Authenticated as: {auth.user?.username}</p>
                    
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-white mb-3">Existing Files ({files.length})</h2>
                        <div className="bg-black/20 rounded-lg p-4 max-h-60 overflow-y-auto">
                            {files.length > 0 ? (
                                <div className="space-y-2">
                                    {files.map((file) => (
                                        <div key={file.id} className="text-neutral-300 text-sm font-mono">
                                            {file.name}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-neutral-400 text-sm">No files found</p>
                            )}
                        </div>
                    </div>
                    
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                        onClick={() => handleDelete()}
                    >
                        🗑️ Wipe All App Data
                    </button>
                </div>
            </div>
        </main>
    );
};

export default WipeApp;