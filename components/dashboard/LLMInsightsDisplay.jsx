"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  ChevronDown, 
  ChevronRight, 
  Brain, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  PieChart,
  Copy,
  CheckCircle,
  ExternalLink,
  Info
} from "lucide-react"
import { toast } from "react-hot-toast"

export default function LLMInsightsDisplay({ insights }) {
  const [openSections, setOpenSections] = useState(new Set(['overview', 'statistics']))
  const [copiedText, setCopiedText] = useState("")

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      toast.success(`${label} copied to clipboard!`)
      setTimeout(() => setCopiedText(""), 2000)
    } catch (err) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const toggleSection = (section) => {
    setOpenSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  // Transform the raw array into the expected format
  const transformData = (raw) => {
    if (!raw) return null;
    
    // If already in correct format, return as-is
    if (raw.summary && raw.vulnerabilities) return raw;
    
    // If it's an array (your current case)
    if (Array.isArray(raw)) {
      const severityCount = raw.reduce((acc, v) => {
        acc[v.severity] = (acc[v.severity] || 0) + 1
        return acc
      }, {})

      const highestSeverity = raw.reduce((max, v) => 
        ['Critical','High','Medium','Low','Informational'].indexOf(v.severity) < 
        ['Critical','High','Medium','Low','Informational'].indexOf(max) 
          ? v.severity : max, 'Informational')

      return {
        summary: `Analysis completed with ${raw.length} security findings. Risk assessment shows ${highestSeverity.toLowerCase()} priority issues requiring attention.`,
        keyPoints: [
          `Total vulnerabilities detected: ${raw.length}`,
          `Highest severity level: ${highestSeverity}`,
          `Security categories affected: ${new Set(raw.map(v => v.vulnerability.split(' ')[0])).size}`,
          `Immediate action required: ${raw.filter(v => ['Critical', 'High'].includes(v.severity)).length} items`
        ],
        vulnerabilities: raw,
        statistics: severityCount
      }
    }
    
    return null;
  };

  const displayData = transformData(insights);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-600 border-red-500 text-red-100'
      case 'high': return 'bg-red-500 border-red-400 text-red-100'
      case 'medium': return 'bg-yellow-500 border-yellow-400 text-yellow-100'
      case 'low': return 'bg-blue-500 border-blue-400 text-blue-100'
      case 'informational': return 'bg-gray-500 border-gray-400 text-gray-100'
      default: return 'bg-gray-500 border-gray-400 text-gray-100'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />
      case 'medium':
        return <Shield className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  if (!displayData) {
    return (
      <div className="fade-in">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">AI Security Intelligence</h3>
        </div>
        
        <div className="glassmorphic rounded-2xl p-8 text-center">
          <div className="glassmorphic-light p-8 rounded-xl max-w-md mx-auto">
            <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
            <h4 className="text-lg font-semibold text-white mb-2">AI Analysis Standby</h4>
            <p className="text-gray-400 text-sm">
              Run a security scan to receive intelligent vulnerability analysis and actionable insights.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">AI Security Intelligence</h3>
          <Badge className="bg-purple-600/20 border-purple-400 text-purple-300">
            AI-Powered
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(
                    `Security Analysis Summary:\n${displayData.summary}\n\nKey Points:\n${displayData.keyPoints.join('\n')}`,
                    "Analysis summary"
                  )}
                  className="glassmorphic-light border-purple-400/30 text-purple-400 hover:bg-purple-400/10"
                >
                  {copiedText === "Analysis summary" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy analysis summary</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="glassmorphic rounded-2xl overflow-hidden">
        <ScrollArea className="h-[600px] p-6">
          <div className="space-y-6">
            
            {/* Overview Section */}
            <Collapsible 
              open={openSections.has('overview')} 
              onOpenChange={() => toggleSection('overview')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-0 hover:bg-transparent">
                  <div className="flex items-center gap-3 w-full">
                    {openSections.has('overview') ? (
                      <ChevronDown className="h-5 w-5 text-purple-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-purple-400" />
                    )}
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    <h4 className="font-semibold text-white text-lg">Executive Summary</h4>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="slide-up">
                <div className="mt-4 ml-8">
                  <div className="glassmorphic-light p-4 rounded-lg">
                    <p className="text-gray-300 leading-relaxed">
                      {displayData.summary}
                    </p>
                  </div>
                  
                  {displayData.keyPoints?.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-white mb-3">Key Findings</h5>
                      <div className="grid gap-2">
                        {displayData.keyPoints.map((point, i) => (
                          <div 
                            key={`point-${i}`}
                            className="glassmorphic-light p-3 rounded-lg text-gray-300 flex items-start gap-2"
                          >
                            <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Statistics Section */}
            <Collapsible 
              open={openSections.has('statistics')} 
              onOpenChange={() => toggleSection('statistics')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-0 hover:bg-transparent">
                  <div className="flex items-center gap-3 w-full">
                    {openSections.has('statistics') ? (
                      <ChevronDown className="h-5 w-5 text-blue-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-blue-400" />
                    )}
                    <PieChart className="h-5 w-5 text-blue-400" />
                    <h4 className="font-semibold text-white text-lg">Security Metrics</h4>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="slide-up">
                <div className="mt-4 ml-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(displayData.statistics || {}).map(([severity, count]) => (
                      <div key={severity} className="glassmorphic-light p-4 rounded-lg text-center">
                        <div className={`text-2xl font-bold ${
                          severity === 'Critical' || severity === 'High' ? 'text-red-400' :
                          severity === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {count}
                        </div>
                        <div className="text-sm text-gray-400 capitalize">{severity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Vulnerabilities Section */}
            <Collapsible 
              open={openSections.has('vulnerabilities')} 
              onOpenChange={() => toggleSection('vulnerabilities')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-0 hover:bg-transparent">
                  <div className="flex items-center gap-3 w-full">
                    {openSections.has('vulnerabilities') ? (
                      <ChevronDown className="h-5 w-5 text-red-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-red-400" />
                    )}
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <h4 className="font-semibold text-white text-lg">
                      Detailed Vulnerabilities ({displayData.vulnerabilities?.length || 0})
                    </h4>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="slide-up">
                <div className="mt-4 ml-8 space-y-4">
                  {displayData.vulnerabilities?.length > 0 ? (
                    displayData.vulnerabilities.map((vuln, i) => (
                      <div 
                        key={`vuln-${i}`}
                        className="glassmorphic-vuln p-5 rounded-xl border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getSeverityIcon(vuln.severity)}
                            <Badge className={`${getSeverityColor(vuln.severity)} border`}>
                              {vuln.severity}
                            </Badge>
                            <h5 className="font-medium text-white text-lg">
                              {vuln.vulnerability}
                            </h5>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(
                                    `Vulnerability: ${vuln.vulnerability}\nSeverity: ${vuln.severity}\nCause: ${vuln.cause}\nRemediation: ${vuln.remediation}`,
                                    `Vulnerability ${i + 1}`
                                  )}
                                  className="h-8 w-8 p-0 hover:bg-white/10"
                                >
                                  {copiedText === `Vulnerability ${i + 1}` ? (
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                  ) : (
                                    <Copy className="h-4 w-4 text-gray-400" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy vulnerability details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {vuln.riskLevel && (
                            <div className="glassmorphic-light p-3 rounded-lg">
                              <span className="text-gray-400">Risk Level:</span> 
                              <span className="text-white ml-2 font-medium">{vuln.riskLevel}</span>
                            </div>
                          )}
                          
                          {vuln.occurrence && (
                            <div className="glassmorphic-light p-3 rounded-lg">
                              <span className="text-gray-400">Occurrence:</span> 
                              <span className="text-white ml-2 font-medium">{vuln.occurrence}</span>
                            </div>
                          )}
                          
                          {vuln.cause && (
                            <div className="glassmorphic-light p-3 rounded-lg md:col-span-2">
                              <span className="text-gray-400">Root Cause:</span> 
                              <span className="text-white ml-2">{vuln.cause}</span>
                            </div>
                          )}
                          
                          <div className="glassmorphic-light p-3 rounded-lg md:col-span-2">
                            <span className="text-gray-400">Remediation:</span> 
                            <span className="text-white ml-2">{vuln.remediation || 'No fix provided'}</span>
                          </div>
                          
                          {vuln.cve && (
                            <div className="glassmorphic-light p-3 rounded-lg">
                              <span className="text-gray-400">CVE:</span> 
                              <span className="text-white ml-2 font-mono">{vuln.cve}</span>
                            </div>
                          )}
                        </div>

                        {vuln.references?.length > 0 && (
                          <div className="mt-4">
                            <p className="text-gray-400 mb-2">References:</p>
                            <div className="flex flex-wrap gap-2">
                              {vuln.references.map((ref, j) => (
                                <a
                                  key={`ref-${j}`}
                                  href={ref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="glassmorphic-light px-3 py-1 rounded-full text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors"
                                >
                                  {new URL(ref).hostname}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="glassmorphic-light p-6 rounded-lg text-center text-gray-400">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-green-400" />
                      <p>No vulnerabilities detected - System appears secure</p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
