import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

export const meta = () => ([
  {title: "ResumeForg | Log In"},
  {name: "description" , content: "Log In To Your Account"}
])
export default function auth() {
  const {isLoading , auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split('next=')[1];
  const navigate = useNavigate();

  useEffect(function(){
    if(auth.isAuthenticated) navigate(next);
  } , [auth.isAuthenticated, next])
  return (
    <main className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-600 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:40px_40px] pointer-events-none"></div>
      {/* Main Div For Form */}
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col bg-white rounded-lg p-10 gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="!text-black">Welcome</h1>
            <h2>Log In To Continue Your Job Journey</h2>
          </div>
          <div>
            {isLoading ?(
              <button className="auth-button animate-pulse"><p>Signning You In....</p></button>
            ) : (
            <>
            {auth.isAuthenticated ?
            <button className="auth-button" onClick={auth.signOut}><p>Sign Out</p></button>
            :
            <button className="auth-button" onClick={auth.signIn}><p>Sign In</p></button>
            }
            </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
