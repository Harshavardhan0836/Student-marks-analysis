import { Link } from "react-router-dom";
import { BarChart3, Upload, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 text-white px-6">
      <div className="text-center space-y-8 max-w-3xl">
        {/* Title */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          ATME Student Analytics Portal
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-300">
          Analyze student performance, upload academic records, and gain
          predictive insights — all in one intelligent platform.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Overview Card */}
          <Link
            to="/overview"
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 
                       hover:bg-white/20 transition-all hover:scale-105 flex flex-col items-center 
                       justify-center space-y-3"
          >
            <BarChart3 className="text-indigo-400" size={40} />
            <h3 className="font-semibold text-xl">Analytics Overview</h3>
            <p className="text-sm text-gray-300 text-center">
              View institution-wide insights and performance metrics.
            </p>
          </Link>

          {/* Department Analytics Card */}
          <Link
            to="/department"
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 
                       hover:bg-white/20 transition-all hover:scale-105 flex flex-col items-center 
                       justify-center space-y-3"
          >
            <Users className="text-green-400" size={40} />
            <h3 className="font-semibold text-xl">Department Insights</h3>
            <p className="text-sm text-gray-300 text-center">
              Analyze results department and semester-wise.
            </p>
          </Link>

          {/* Upload Student Data Card */}
          <Link
            to="/upload"
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 
                       hover:bg-white/20 transition-all hover:scale-105 flex flex-col items-center 
                       justify-center space-y-3"
          >
            <Upload className="text-purple-400" size={40} />
            <h3 className="font-semibold text-xl">Upload Student Data</h3>
            <p className="text-sm text-gray-300 text-center">
              Upload and process student marks (PDF/Excel).
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
