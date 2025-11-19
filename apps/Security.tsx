import React, { useState, useEffect, useRef } from 'react';
import { AppProps } from '../types';
import { Shield, Activity, Lock, Globe, AlertTriangle, CheckCircle, Search, XOctagon, Terminal } from 'lucide-react';

const Security: React.FC<AppProps> = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [threatsFound, setThreatsFound] = useState(0);

  // Mock Data for Logs
  const generateLog = () => {
    const actions = ['PACKET_FILTER', 'PORT_SCAN_DETECTED', 'LOGIN_ATTEMPT', 'OUTBOUND_CONN', 'SSL_HANDSHAKE'];
    const ips = ['192.168.1.105', '10.0.0.4', '172.16.0.1', '45.33.22.11', '8.8.8.8'];
    const status = ['ALLOWED', 'BLOCKED', 'ANALYZING'];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    const ip = ips[Math.floor(Math.random() * ips.length)];
    const stat = status[Math.floor(Math.random() * status.length)];
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    return `[${timestamp}] ${action} FROM ${ip} -> ${stat}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [generateLog(), ...prev].slice(0, 20));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const startScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setThreatsFound(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        // Simulate finding random threats
        if (Math.random() > 0.9) setThreatsFound(t => t + 1);
        return prev + 1;
      });
    }, 50);
  };

  return (
    <div className="h-full flex bg-slate-900 text-slate-100 font-mono overflow-hidden select-none">
      {/* Sidebar */}
      <div className="w-60 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <Shield size={32} className="text-emerald-500" />
          <div className="leading-tight">
            <h1 className="font-bold text-lg text-emerald-400 tracking-wider">CYBER</h1>
            <span className="text-xs text-slate-400">COMMAND CENTER</span>
          </div>
        </div>
        
        <div className="flex-1 py-4 space-y-1">
           <NavButton id="dashboard" icon={<Activity size={18} />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
           <NavButton id="scan" icon={<Search size={18} />} label="System Scan" active={activeTab === 'scan'} onClick={() => setActiveTab('scan')} />
           <NavButton id="network" icon={<Globe size={18} />} label="Network Monitor" active={activeTab === 'network'} onClick={() => setActiveTab('network')} />
           <NavButton id="intel" icon={<Lock size={18} />} label="Threat Intel" active={activeTab === 'intel'} onClick={() => setActiveTab('intel')} />
        </div>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
            <p>SIMULATION MODE ACTIVE</p>
            <p>v2.4.0-build</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-slate-900 relative">
          {/* Grid Background Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
               style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          <div className="p-8 relative z-10">
            
            {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-3 gap-4">
                        <StatusCard title="Threat Level" value="LOW" color="text-emerald-400" icon={<CheckCircle size={24} />} />
                        <StatusCard title="Firewall" value="ACTIVE" color="text-emerald-400" icon={<Shield size={24} />} />
                        <StatusCard title="Active Conns" value="14" color="text-blue-400" icon={<Globe size={24} />} />
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2"><Terminal size={16}/> LIVE EVENT LOG</h3>
                        <div className="h-48 overflow-hidden font-mono text-xs space-y-1">
                            {logs.map((log, i) => (
                                <div key={i} className={`truncate ${log.includes('BLOCKED') ? 'text-red-400' : 'text-emerald-500/80'}`}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'scan' && (
                <div className="flex flex-col items-center justify-center h-full py-10 animate-in fade-in zoom-in-95">
                    <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
                         {/* Spinner Rings */}
                         <div className={`absolute inset-0 rounded-full border-4 border-slate-800 ${isScanning ? 'border-t-emerald-500 animate-spin' : ''}`}></div>
                         <div className={`absolute inset-4 rounded-full border-4 border-slate-800 ${isScanning ? 'border-b-blue-500 animate-spin-slow' : ''}`}></div>
                         
                         <div className="flex flex-col items-center">
                             <span className="text-4xl font-bold text-white">{scanProgress}%</span>
                             <span className="text-xs text-slate-400">{isScanning ? 'SCANNING...' : 'READY'}</span>
                         </div>
                    </div>

                    {!isScanning ? (
                        <button onClick={startScan} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            INITIATE SYSTEM SCAN
                        </button>
                    ) : (
                        <div className="w-full max-w-md space-y-2">
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all duration-75" style={{ width: `${scanProgress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Files Scanned: {Math.floor(scanProgress * 142)}</span>
                                <span>Threats: <span className={threatsFound > 0 ? 'text-red-500' : 'text-emerald-500'}>{threatsFound}</span></span>
                            </div>
                        </div>
                    )}

                    {!isScanning && scanProgress === 100 && (
                        <div className="mt-8 p-4 bg-slate-800/50 border border-emerald-500/30 rounded-lg max-w-md w-full">
                            <div className="flex items-center gap-3 mb-2">
                                {threatsFound === 0 ? <CheckCircle className="text-emerald-500"/> : <AlertTriangle className="text-yellow-500" />}
                                <h3 className="font-bold text-white">Scan Complete</h3>
                            </div>
                            <p className="text-sm text-slate-300">
                                {threatsFound === 0 
                                    ? "No active threats detected. Your system is secure." 
                                    : `${threatsFound} low-priority tracking cookies found and isolated.`}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'network' && (
                 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                     <h2 className="text-xl font-bold text-white mb-4">Network Traffic Monitor</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-slate-950 border border-slate-800 p-4 rounded h-64 flex items-end justify-between gap-1">
                            {/* Fake Bar Chart */}
                            {Array.from({length: 20}).map((_, i) => (
                                <div key={i} className="w-full bg-emerald-900/40 rounded-t overflow-hidden relative h-full">
                                    <div 
                                        className="absolute bottom-0 w-full bg-emerald-500 transition-all duration-500"
                                        style={{ height: `${Math.random() * 100}%` }}
                                    ></div>
                                </div>
                            ))}
                         </div>
                         <div className="bg-slate-950 border border-slate-800 p-4 rounded h-64 overflow-hidden relative">
                             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <Globe size={120} className="text-blue-500 animate-pulse" />
                             </div>
                             <div className="relative z-10 space-y-2">
                                 <div className="flex justify-between text-xs border-b border-slate-800 pb-1 text-slate-500">
                                     <span>PROTOCOL</span>
                                     <span>STATUS</span>
                                 </div>
                                 {['HTTPS', 'SSH', 'FTP', 'SMTP', 'DNS'].map(p => (
                                     <div key={p} className="flex justify-between text-sm">
                                         <span className="text-slate-300">{p}</span>
                                         <span className="text-emerald-500 font-bold">SECURE</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     </div>
                 </div>
            )}

            {activeTab === 'intel' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><XOctagon className="text-red-500" /> Dark Web Monitor (Simulation)</h2>
                        <p className="text-sm text-slate-400 mb-6">
                            Scanning public data dumps for compromised credentials associated with "User". 
                            <br/>Note: This is a simulation using mock data. No real searches are performed.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-slate-950 p-3 rounded border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-slate-200">Breach_Collection_v1.dat</span>
                                </div>
                                <span className="text-xs font-mono bg-red-900/30 text-red-400 px-2 py-1 rounded">MATCH FOUND</span>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800 text-xs font-mono text-slate-400">
                                <p>EMAIL: user@example.com</p>
                                <p>PASS: ********** (Hidden for security)</p>
                                <p>SOURCE: Mock_Database_2023</p>
                            </div>
                        </div>

                        <div className="mt-6 p-3 bg-emerald-900/20 border border-emerald-500/20 rounded text-sm text-emerald-400 flex items-center gap-2">
                             <CheckCircle size={16} />
                             <span>Credit Cards: No leaked financial data found in simulation.</span>
                        </div>
                    </div>
                </div>
            )}
          </div>
      </div>
    </div>
  );
};

const NavButton = ({ id, icon, label, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all border-l-2 
        ${active 
            ? 'bg-slate-900 border-emerald-500 text-emerald-400 shadow-[inset_10px_0_20px_-10px_rgba(16,185,129,0.1)]' 
            : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
    >
        {icon}
        {label}
    </button>
);

const StatusCard = ({ title, value, color, icon }: any) => (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex flex-col justify-between h-24">
        <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase">{title}</span>
            <div className={`${color} opacity-80`}>{icon}</div>
        </div>
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
);

export default Security;
