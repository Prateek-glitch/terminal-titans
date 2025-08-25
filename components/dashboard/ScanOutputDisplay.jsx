"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Copy, 
  CheckCircle, 
  Terminal, 
  Activity, 
  AlertTriangle,
  Shield,
  Eye,
  Download
} from "lucide-react"
import { toast } from "react-hot-toast"

export default function ScanOutputDisplay({ output, insights }) {
  const [copiedText, setCopiedText] = useState("")

  const copyToClipboard = async (text, label = "output") => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      toast.success(`${label} copied to clipboard!`)
      setTimeout(() => setCopiedText(""), 2000)
    } catch (err) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const downloadOutput = () => {
    if (!output) return
    
    const blob = new Blob([output], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scan-output-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('Scan output downloaded!')
  }

  const formatOutput = (text) => {
    if (!text) return text
    
    // Add syntax highlighting for common patterns
    return text
      .replace(/(\d+\.\d+\.\d+\.\d+)/g, '<span class="text-blue-400">$1</span>')
      .replace(/(port\s+\d+)/gi, '<span class="text-yellow-400">$1</span>')
      .replace(/(open|closed|filtered)/gi, '<span class="text-green-400">$1</span>')
      .replace(/(vulnerability|vuln|exploit)/gi, '<span class="text-red-400">$1</span>')
      .replace(/(https?:\/\/[^\s]+)/gi, '<span class="text-blue-300 underline">$1</span>')
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Terminal className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-semibold text-white">Scan Output Terminal</h3>
          {output && (
            <div className="flex items-center gap-1 text-sm text-green-400">
              <Activity className="h-4 w-4" />
              <span>Live Feed</span>
            </div>
          )}
        </div>
        
        {output && (
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(output, "Scan output")}
                    className="glassmorphic-light border-green-400/30 text-green-400 hover:bg-green-400/10"
                  >
                    {copiedText === "Scan output" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy output to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadOutput}
                    className="glassmorphic-light border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as text file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      <div className="glassmorphic rounded-2xl overflow-hidden">
        <ScrollArea className="h-96 p-4">
          {output ? (
            <div className="space-y-4">
              {/* Terminal Output Section */}
              <div className="terminal-output p-4 rounded-lg backdrop-filter backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2 text-green-400">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-sm font-mono">Pentest Terminal - Scan Results</span>
                </div>
                <pre 
                  className="whitespace-pre-wrap break-words text-sm font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatOutput(output) }}
                />
              </div>

              {/* Quick Insights Panel */}
              {insights && insights.vulnerabilities && insights.vulnerabilities.length > 0 && (
                <div className="glassmorphic-light p-4 rounded-lg slide-up">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-red-400" />
                    <h4 className="text-lg font-semibold text-white">Quick Security Overview</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="glassmorphic-light p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-400">
                        {insights.vulnerabilities.filter(v => v.severity === 'High' || v.severity === 'Critical').length}
                      </div>
                      <div className="text-sm text-gray-400">Critical/High</div>
                    </div>
                    <div className="glassmorphic-light p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {insights.vulnerabilities.filter(v => v.severity === 'Medium').length}
                      </div>
                      <div className="text-sm text-gray-400">Medium</div>
                    </div>
                    <div className="glassmorphic-light p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {insights.vulnerabilities.filter(v => v.severity === 'Low' || v.severity === 'Informational').length}
                      </div>
                      <div className="text-sm text-gray-400">Low/Info</div>
                    </div>
                  </div>

                  {insights.vulnerabilities.slice(0, 3).map((insight, index) => (
                    <div key={index} className="mb-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${
                              insight.severity === "Critical" || insight.severity === "High"
                                ? "bg-red-600 hover:bg-red-700"
                                : insight.severity === "Medium"
                                  ? "bg-yellow-600 hover:bg-yellow-700"
                                  : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {insight.severity}
                          </Badge>
                          <p className="font-medium text-white text-sm">{insight.vulnerability}</p>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(
                                  `Vulnerability: ${insight.vulnerability}\nSeverity: ${insight.severity}\nRemediation: ${insight.remediation}`,
                                  `Vulnerability ${index + 1}`
                                )}
                                className="h-6 w-6 p-0 hover:bg-white/10"
                              >
                                {copiedText === `Vulnerability ${index + 1}` ? (
                                  <CheckCircle className="h-3 w-3 text-green-400" />
                                ) : (
                                  <Copy className="h-3 w-3 text-gray-400" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy vulnerability details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-gray-300 text-xs">
                        <strong>Fix:</strong> {insight.remediation || "No remediation provided"}
                      </p>
                    </div>
                  ))}
                  
                  {insights.vulnerabilities.length > 3 && (
                    <div className="text-center mt-3">
                      <p className="text-sm text-gray-400">
                        +{insights.vulnerabilities.length - 3} more vulnerabilities in detailed view below
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="glassmorphic-light p-8 rounded-2xl max-w-md">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Awaiting Scan Results</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Run a scan or upload a file to see the terminal output and security analysis here.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Terminal className="h-4 w-4" />
                  <span>Ready for incoming data...</span>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
