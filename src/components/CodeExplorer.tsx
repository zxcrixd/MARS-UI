import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, AndroidFile } from '../data/androidProjectFiles';
import { 
  FileCode, Copy, Check, Search, Download, 
  FolderTree, Terminal, Shield, Cpu, Layers
} from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(
    ANDROID_PROJECT_FILES.find(f => f.path.includes('MainActivity.kt')) || ANDROID_PROJECT_FILES[0]
  );
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = ANDROID_PROJECT_FILES.filter(f => 
    f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (cat: AndroidFile['category']) => {
    switch (cat) {
      case 'manifest': return <Shield className="w-3.5 h-3.5 text-yellow-400" />;
      case 'gradle': return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
      case 'kotlin': return <FileCode className="w-3.5 h-3.5 text-purple-400" />;
      case 'res': return <Layers className="w-3.5 h-3.5 text-green-400" />;
      case 'docs': return <Terminal className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  return (
    <div className="w-full bg-[#0a0a0f] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[750px]">
      {/* Explorer Top Toolbar */}
      <div className="px-5 py-3.5 bg-[#12121a] border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderTree className="w-5 h-5 text-red-500" />
          <h2 className="text-sm font-bold text-white tracking-wide">Native Android Project Source Tree</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300">
            {ANDROID_PROJECT_FILES.length} Verified Files
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            <span>{copied ? 'Copied' : 'Copy File'}</span>
          </button>
        </div>
      </div>

      {/* Explorer Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left File Tree Sidebar */}
        <div className="w-80 bg-[#0e0e16] border-r border-neutral-800 flex flex-col">
          {/* File search */}
          <div className="p-3 border-b border-neutral-800">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Filter files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161622] border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredFiles.map(file => {
              const isSelected = selectedFile.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`px-3 py-2 rounded-lg cursor-pointer flex flex-col gap-0.5 transition ${
                    isSelected ? 'bg-red-950/40 border border-red-600/50 text-white' : 'hover:bg-neutral-900 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(file.category)}
                    <span className="text-xs font-mono truncate font-medium">{file.path}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 line-clamp-1 ml-5">{file.description}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="flex-1 flex flex-col bg-[#08080c] overflow-hidden">
          {/* File Header */}
          <div className="px-5 py-2.5 bg-[#0f0f17] border-b border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-bold">{selectedFile.path}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">{selectedFile.description}</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-500">
              {selectedFile.content.split('\n').length} lines • {new Blob([selectedFile.content]).size} bytes
            </div>
          </div>

          {/* Code Body with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-neutral-300 leading-relaxed bg-[#060609]">
            <pre className="flex">
              <code className="text-neutral-600 select-none pr-4 text-right border-r border-neutral-800/60 mr-4">
                {selectedFile.content.split('\n').map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </code>
              <code className="text-neutral-200">
                {selectedFile.content}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
