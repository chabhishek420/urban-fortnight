import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
              K
            </div>
            <div>
              <h1 className="text-xl font-bold">Keitaro Tracker</h1>
              <p className="text-xs text-gray-400">TypeScript Translation v1.0.0</p>
            </div>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/status" className="hover:text-blue-400 transition">Status</Link>
            <a href="/api/test-click?campaign=test-campaign" className="hover:text-blue-400 transition bg-blue-600 px-3 py-1 rounded">Test Click</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          PHP → TypeScript Translation
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Complete translation of the Keitaro TDS (Traffic Direction System) from PHP 7.4 to TypeScript with Fastify and Prisma.
        </p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="TypeScript Files" value="130+" />
          <StatCard label="Prisma Models" value="25+" />
          <StatCard label="Pipeline Stages" value="22" />
          <StatCard label="Actions" value="18" />
        </div>

        {/* Test Button */}
        <div className="mb-12">
          <a 
            href="/api/test-click?campaign=test-campaign"
            className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            🧪 Test Click Pipeline
          </a>
          <p className="text-sm text-gray-400 mt-2">
            Click to test the full click processing pipeline
          </p>
        </div>
      </section>

      {/* Implementation Status */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6">Implementation Status</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Completed */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-green-500/30">
            <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Completed Components
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✅ Core Framework (Kernel, Router, DB)</li>
              <li>✅ Context System (11 contexts)</li>
              <li>✅ Dispatchers (9 dispatchers)</li>
              <li>✅ Pipeline Stages (22 stages)</li>
              <li>✅ Actions System (18 actions)</li>
              <li>✅ ClickRepository for persistence</li>
              <li>✅ Cached Repositories</li>
              <li>✅ Filter Engine</li>
              <li>✅ Request/Response Classes</li>
              <li>✅ Entity Models (13 entities)</li>
              <li>✅ Prisma Schema (SQLite)</li>
              <li>✅ Test Data Seeder</li>
            </ul>
          </div>

          {/* Architecture */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/30">
            <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Click Flow Architecture
            </h4>
            <pre className="text-xs text-gray-300 bg-gray-900/50 p-4 rounded-lg overflow-x-auto">
{`Request → Router → Context → Dispatcher
                        ↓
                  Pipeline (22 Stages)
                   ├─ CheckPrefetchStage
                   ├─ FindCampaignStage
                   ├─ ChooseStreamStage
                   ├─ ChooseOfferStage
                   ├─ ExecuteActionStage
                   └─ StoreRawClicksStage
                        ↓
                    Response`}
            </pre>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-700/50 p-2 rounded">
                <div className="text-gray-400">Source</div>
                <div className="font-mono">PHP 7.4 + IonCube</div>
              </div>
              <div className="bg-gray-700/50 p-2 rounded">
                <div className="text-gray-400">Target</div>
                <div className="font-mono">TypeScript + Prisma</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6">Key Components</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <ComponentCard 
            title="Pipeline Stages"
            count="22"
            items={['FindCampaignStage', 'ChooseStreamStage', 'ChooseOfferStage', 'ExecuteActionStage', 'StoreRawClicksStage', 'BuildRawClickStage']}
          />
          <ComponentCard 
            title="Actions"
            count="18"
            items={['HttpRedirect', 'Meta', 'DoubleMeta', 'Iframe', 'Frame', 'Curl', 'Remote', 'LocalFile', 'ShowHtml']}
          />
          <ComponentCard 
            title="Repositories"
            count="10"
            items={['CampaignRepository', 'OfferRepository', 'StreamRepository', 'ClickRepository', 'CachedCampaignRepository']}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-16 py-8 text-center text-gray-400 text-sm">
        <p>Based on Keitaro TDS v9.13.9 (IonCube decoded source)</p>
        <p className="mt-2">✅ TypeScript compilation passes with 0 errors</p>
        <p className="mt-1">✅ Test data seeded in SQLite database</p>
      </footer>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
      <div className="text-3xl font-bold text-blue-400">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function ComponentCard({ title, count, items }: { title: string; count: string; items: string[] }) {
  return (
    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">{title}</h4>
        <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded">{count}</span>
      </div>
      <ul className="space-y-1 text-xs text-gray-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            {item}
          </li>
        ))}
        <li className="text-gray-500">+ more...</li>
      </ul>
    </div>
  );
}
