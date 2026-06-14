import Header from "./Header";

export default function AgentLayout({ children }) {
  return (
    <div className="min-h-screen font-sans relative">
      <Header />
      <div className="pt-32 pb-12 transition-all duration-300 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
