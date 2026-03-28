"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatusPage;
const link_1 = __importDefault(require("next/link"));
function StatusPage() {
    const status = {
        gates: [
            { name: 'Gate 1: Interfaces & Entities', progress: 100, status: 'completed' },
            { name: 'Gate 2: Data Access', progress: 100, status: 'completed' },
            { name: 'Gate 3: Services & Pipeline', progress: 95, status: 'completed' },
            { name: 'Gate 4: Controllers', progress: 100, status: 'completed' },
            { name: 'Gate 5: Infrastructure', progress: 100, status: 'completed' },
        ],
        files: {
            typescript: 130,
            prisma: 1,
            docs: 5,
        },
        components: {
            stages: 22,
            contexts: 11,
            dispatchers: 9,
            actions: 10,
            filters: 8,
            repositories: 9,
            services: 5,
            models: 13,
        },
    };
    return (<main className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <link_1.default href="/" className="text-blue-400 hover:underline mb-4 inline-block">
          ← Back to Home
        </link_1.default>
        
        <h1 className="text-3xl font-bold mb-8">Implementation Status</h1>
        
        {/* Gates */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Gate Progress</h2>
          <div className="space-y-3">
            {status.gates.map((gate, i) => (<div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">{gate.name}</span>
                  <span className={`text-sm ${gate.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {gate.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full ${gate.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${gate.progress}%` }}/>
                </div>
              </div>))}
          </div>
        </section>

        {/* Component Count */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Components</h2>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(status.components).map(([key, value]) => (<div key={key} className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{value}</div>
                <div className="text-xs text-gray-400 capitalize">{key}</div>
              </div>))}
          </div>
        </section>
      </div>
    </main>);
}
//# sourceMappingURL=page.js.map